# useTransition & startTransition

## useTransition 原理

### useTransition 介绍

`useTransition` is a React Hook that lets you update the state without blocking the UI.

useTransition returns an array with exactly two items:

1. The isPending flag that tells you whether there is a pending Transition.
2. The startTransition function that lets you mark updates as a Transition.

调试用例如下：

```jsx
function App() {
  const [tab, setTab] = useState("home")
  const [isPending, startTransition] = useTransition()

  const getTab = (nextTab) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(nextTab)
      }, 2000)
    })
  }
  function selectTab(nextTab) {
    startTransition(async () => {
      const res = await getTab(nextTab)
      startTransition(() => {
        setTab(res)
      })
    })
  }

  function Loading() {
    return <h2>🌀 Loading...</h2>
  }

  return (
    <>
      <div>
        <h1 isActive={tab === "home"} onClick={() => selectTab("home")}>
          Home
        </h1>
        <h1 isActive={tab === "about"} onClick={() => selectTab("about")}>
          About
        </h1>
      </div>
      {isPending ? <Loading /> : null}
      <main>
        {tab === "home" && <div>Home TAB</div>}
        {tab === "about" && <div>About TAB</div>}
      </main>
    </>
  )
}
```

### `mountTransition`

`mountTransition`做了两件事：1.创建一个`state hook`存储`isPending`；2. 定义`startTransition`方法，然后返回`[isPending,startTransition]`。

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
useTransition(): [boolean, (() => void) => void] {
  currentHookNameInDev = 'useTransition';
  mountHookTypesDev();
  return mountTransition();
}

function mountTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  // 【创建了一个state hook存储isPending】
  const [isPending, setPending] = mountState(false);
  // The `start` method never changes.
  const start = startTransition.bind(null, setPending);
  const hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [isPending, start];
}

function startTransition(setPending, callback, options) {
  const previousPriority = getCurrentUpdatePriority();
  setCurrentUpdatePriority(
    higherEventPriority(previousPriority, ContinuousEventPriority),
  );
  // 【lane为1】
  setPending(true);

  // 【设置ReactCurrentBatchConfig.transition，在后续requestUpdateLane判断中认定为是Transition，所以优先级设置为Transition的优先级】
  const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = {};
  const currentTransition = ReactCurrentBatchConfig.transition;

  if (enableTransitionTracing) {
    if (options !== undefined && options.name !== undefined) {
      ReactCurrentBatchConfig.transition.name = options.name;
      ReactCurrentBatchConfig.transition.startTime = now();
    }
  }

  // 【省略代码...】

  try {
    // 【lane为64】
    setPending(false);
    callback();
  } finally {
    setCurrentUpdatePriority(previousPriority);

    ReactCurrentBatchConfig.transition = prevTransition;

    // 【省略代码...】
  }
}
```

根据前文内容我们已经知道，`setState`进入`dispatchSetState`中会调用`requestUpdateLane(fiber)`动态设置`lane`优先级，然后调用去调度更新任务。而在`startTransition`中，根据对`ReactCurrentBatchConfig.transition`的设置，在第二次`setState`时，`lane`会设置为`Transition`的优先级，是一个相对较低的优先级。

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
function dispatchSetState<S, A>(
  fiber: Fiber,//【currentlyRenderingFiber】
  queue: UpdateQueue<S, A>,//【queue】
  action: A,
): void {
  // 【省略代码...】
  // 【动态获取优先级】
  const lane = requestUpdateLane(fiber);

  // 【创建一个update任务】
  // 【action是值的话就是确定值】
  // 【action是函数的话还未计算】
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

  // 【省略代码...】
}

// 【packages/react-reconciler/src/ReactFiberWorkLoop.js】
export function requestUpdateLane(fiber: Fiber): Lane {
  // 【省略代码...】
  const isTransition = requestCurrentTransition() !== NoTransition;
  // 【是Transition的情况】
  if (isTransition) {
    const actionScopeLane = peekEntangledActionLane();
    return actionScopeLane !== NoLane
      ? // We're inside an async action scope. Reuse the same lane.
        actionScopeLane
      : // We may or may not be inside an async action scope. If we are, this
        // is the first update in that scope. Either way, we need to get a
        // fresh transition lane.
        requestTransitionLane();
  }
  // 【省略代码...】
}
export function requestCurrentTransition(): Transition | null {
  return ReactCurrentBatchConfig.transition;
}
```

在`ensureRootIsScheduled`中：

1. 对比新旧`rerender`优先级`existingCallbackPriority  === newCallbackPriority`，若优先级相同则继续仍旧完成旧`rerender`；意味着如果多次触发相同优先级的更新（比如在一个 `Transition` 里连续多次 `setState`），React 不会启动多个调度任务，而是让之前的任务在执行时一次性处理掉所有处于该 `Lane` 的更新。
2. `existingCallbackNode != null`说明旧`rerender`仍未完成又调度了一次更高优先级的新`rerender`，则旧的`rerender`将被取消，这就是中断的发生机制；`newCallbackPriority` 是通过 `getNextLanes` 计算出的全树最高优先级。如果当前有一个旧任务在跑，而现在多了一个新更新，那么 `newCallbackPriority` 只可能大于或等于旧优先级。
3. 根据`newCallbackPriority`是否`SyncLane`调度不同的方法安排`rerender`任务入队；

简单理解就是React永远取树(`root.pendingLanes`)上最高优先级的任务去执行，不同的行为会形成不同优先级的`rerender`任务。

`startTransition(() => { ... })`：其实就是强行将更新降级为低优先级为了优化体验。

```ts
// 【packages/react-reconciler/src/ReactFiberWorkLoop.js】
// Use this function to schedule a task for a root. There's only one task per
// root; if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  const existingCallbackNode = root.callbackNode

  // Check if any lanes are being starved by other work. If so, mark them as
  // expired so we know to work on those next.
  markStarvedLanesAsExpired(root, currentTime)

  // 【getNextLanes()返回的是最高优先级lane，如果SyncLane和Transition Lanes同时存在，会返回SyncLane】
  // Determine the next lanes to work on, and their priority.
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  )

  if (nextLanes === NoLanes) {
    // Special case: There's nothing to work on.
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode)
    }
    root.callbackNode = null
    root.callbackPriority = NoLane
    return
  }

  // We use the highest priority lane to represent the priority of the callback.
  const newCallbackPriority = getHighestPriorityLane(nextLanes)

  // Check if there's an existing task. We may be able to reuse it.
  const existingCallbackPriority = root.callbackPriority
  if (
    existingCallbackPriority === newCallbackPriority &&
    // Special case related to `act`. If the currently scheduled task is a
    // Scheduler task, rather than an `act` task, cancel it and re-scheduled
    // on the `act` queue.
    !(
      __DEV__ &&
      ReactCurrentActQueue.current !== null &&
      existingCallbackNode !== fakeActCallbackNode
    )
  ) {
    // 【省略代码...】
    // The priority hasn't changed. We can reuse the existing task. Exit.
    return
  }

  // 【existingCallbackNode如果存在，如果未执行完旧的rerender，而又调度了一次新的rerender，则旧的rerender将被取消。这就是中断的发生机制。】
  if (existingCallbackNode != null) {
    // Cancel the existing callback. We'll schedule a new one below.
    cancelCallback(existingCallbackNode)
  }

  // Schedule a new callback.
  let newCallbackNode
  if (newCallbackPriority === SyncLane) {
    // Special case: Sync React callbacks are scheduled on a special
    // internal queue
    if (root.tag === LegacyRoot) {
      // 【省略代码...】
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root))
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
    }
    if (supportsMicrotasks) {
      // Flush the queue in a microtask.
      if (__DEV__ && ReactCurrentActQueue.current !== null) {
        // Inside `act`, use our internal `act` queue so that these get flushed
        // at the end of the current scope even when using the sync version
        // of `act`.
        ReactCurrentActQueue.current.push(flushSyncCallbacks)
      } else {
        scheduleMicrotask(() => {
          // In Safari, appending an iframe forces microtasks to run.
          // https://github.com/facebook/react/issues/22459
          // We don't support running callbacks in the middle of render
          // or commit so we need to check against that.
          if ((executionContext & (RenderContext | CommitContext)) === NoContext) {
            // Note that this would still prematurely flush the callbacks
            // if this happens outside render or commit phase (e.g. in an event).
            flushSyncCallbacks()
          }
        })
      }
    } else {
      // Flush the queue in an Immediate task.
      scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks)
    }
    newCallbackNode = null
  } else {
    let schedulerPriorityLevel
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority
        break
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority
        break
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority
        break
      default:
        schedulerPriorityLevel = NormalSchedulerPriority
        break
    }
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    )
  }

  root.callbackPriority = newCallbackPriority
  root.callbackNode = newCallbackNode
}
```

### `updateTransition`

此处除了将`isPending`设置为`false`之外并无其他变动。

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
function updateTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  const [isPending] = updateState(false)
  const hook = updateWorkInProgressHook()
  const start = hook.memoizedState
  return [isPending, start]
}
```

---

## useDeferredValue 原理

### useDeferredValue 介绍

`useDeferredValue` is a React Hook that lets you defer updating a part of the UI.

`useDeferredValue` 允许你推迟更新某个非紧急的 UI 部分。它接受一个值并返回该值的“延迟版本”，该版本会“滞后”于原始值。React 会在其他更紧急的更新（如用户输入）完成后，再用新值重新渲染。

如果你能拿到修改状态的函数，你通常可以用 `useTransition`。但如果你是从 `Props` 接收值，或者值来自第三方 `Hook`（无法包裹 `startTransition`），那么 `useDeferredValue` 是唯一的选择。

### `mountDeferredValue`

`mountDeferredValue`干的事情非常简单，就是创建`hook`并且把传入的值存储起来。

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
function mountDeferredValue<T>(value: T): T {
  const hook = mountWorkInProgressHook()
  hook.memoizedState = value
  return value
}
```

### `updateDeferredValue`

在`updateDeferredValue`中，主要就是调用`updateDeferredValueImpl`方法。根据当前是否有高优先级任务在执行，决定了当前内容是否要以低优先级安排。

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
function updateDeferredValue<T>(value: T): T {
  const hook = updateWorkInProgressHook();
  const resolvedCurrentHook: Hook = (currentHook: any);
  const prevValue: T = resolvedCurrentHook.memoizedState;
  return updateDeferredValueImpl(hook, prevValue, value);
}

function updateDeferredValueImpl<T>(hook: Hook, prevValue: T, value: T): T {
  const shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);
  if (shouldDeferValue) {
    // 【当前正在处理SyncLane | InputContinuousLane | DefaultLane等高优先级任务，需要defer】
    // This is an urgent update. If the value has changed, keep using the
    // previous value and spawn a deferred render to update it later.

    if (!is(value, prevValue)) {
      // 【新旧值不同，用一个较低的优先级Lane】
      // Schedule a deferred render
      const deferredLane = claimNextTransitionLane();
      currentlyRenderingFiber.lanes = mergeLanes(
        currentlyRenderingFiber.lanes,
        deferredLane,
      );
      markSkippedUpdateLanes(deferredLane);

      // Set this to true to indicate that the rendered value is inconsistent
      // from the latest value. The name "baseState" doesn't really match how we
      // use it because we're reusing a state hook field instead of creating a
      // new one.
      // 【借用baseState标记一下用的是defer值】
      hook.baseState = true;
    }

    // 【仍旧先用旧值，后面再去更新】
    // Reuse the previous value
    return prevValue;
  } else {
    // 【没有高优先级任务在做，那就直接用新值，不必defer】
    // This is not an urgent update, so we can use the latest value regardless
    // of what it is. No need to defer it.

    // However, if we're currently inside a spawned render, then we need to mark
    // this as an update to prevent the fiber from bailing out.
    //
    // `baseState` is true when the current value is different from the rendered
    // value. The name doesn't really match how we use it because we're reusing
    // a state hook field instead of creating a new one.
    if (hook.baseState) {
      // Flip this back to false.
      hook.baseState = false;
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = value;
    return value;
  }
}

export function includesOnlyNonUrgentLanes(lanes: Lanes) {
  const UrgentLanes = SyncLane | InputContinuousLane | DefaultLane;
  return (lanes & UrgentLanes) === NoLanes;
}
```

## useOptimistic 原理

<!-- TODO -->

### useOptimistic 介绍

`useOptimistic` is a React Hook that lets you optimistically update the UI.

`useOptimistic` 是一个用于“乐观”更新的 Hook。它允许你在异步操作（如网络请求）完成之前，立即更新 UI 以反映预期的结果，从而提供更快的用户体验。如果操作最终失败，UI 会自动回滚到之前的状态。

调试用例如下：

```html

```

### `mountOptimistic`

```ts
function mountOptimistic<S, A>(
  passthrough: S,
  reducer: ?(S, A) => S,
): [S, (A) => void] {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = hook.baseState = passthrough;
  const queue: UpdateQueue<S, A> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    // Optimistic state does not use the eager update optimization.
    lastRenderedReducer: null,
    lastRenderedState: null,
  };
  hook.queue = queue;
  // This is different than the normal setState function.
  const dispatch: A => void = (dispatchOptimisticSetState.bind(
    null,
    currentlyRenderingFiber,
    true,
    queue,
  ): any);
  queue.dispatch = dispatch;
  return [passthrough, dispatch];
}
```

### `updateOptimistic`

```ts
function updateOptimistic<S, A>(
  passthrough: S,
  reducer: ?(S, A) => S,
): [S, (A) => void] {
  const hook = updateWorkInProgressHook();
  return updateOptimisticImpl(
    hook,
    ((currentHook: any): Hook),
    passthrough,
    reducer,
  );
}
```

---

## 总结

1. `useTransition`：关注更新动作 (Update Function)，`useDeferredValue`：关注数据本身 (Value)；
2. `useTransition`/`useDeferredValue`都通过进行低优先级任务的安排来优化任务的执行，不去抢占高优先级的渲染任务；

![react](./assets/useTransition/useTransition.svg)

## 参考资料

[useTransition](https://react.dev/reference/react/useTransition)

[useOptimistic](https://react.dev/reference/react/useOptimistic)

[useDeferredValue](https://react.dev/reference/react/useDeferredValue)
