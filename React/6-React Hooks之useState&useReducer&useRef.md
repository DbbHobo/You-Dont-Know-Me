# useState

## useState 相关的重要数据结构
```ts
export type Update<S, A> = {
  lane: Lane,
  action: A,
  hasEagerState: boolean,
  eagerState: S | null,
  next: Update<S, A>,
};

export type UpdateQueue<S, A> = {
  pending: Update<S, A> | null,
  lanes: Lanes,
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
};
```

## useState 入口
`useState`方法入口，后续可能会调用方法有`mountState` | `updateState` | `rerenderState`：
```ts
useState<S>(
    initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    currentHookNameInDev = 'useState';
    mountHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
    try {
        return mountState(initialState);
    } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
    }
}

useState<S>(
    initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    currentHookNameInDev = 'useState';
    updateHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current =
    InvalidNestedHooksDispatcherOnRerenderInDEV;
    try {
        return rerenderState(initialState);
    } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
    }
}

useState<S>(
    initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    currentHookNameInDev = 'useState';
    warnInvalidHookAccess();
    updateHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current =
    InvalidNestedHooksDispatcherOnUpdateInDEV;
    try {
        return updateState(initialState);
    } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
    }
},
```

## useState 原理
### `mountState`
创建一个对应的 `hook` 并定义 `memoizedState` 、 `baseState` 、 `queue` 等属性，返回`[hook.memoizedState, dispatch]`， `dispatch` 就是返回给用户更新状态的方法：
```ts
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 【创建hook】
  const hook = mountWorkInProgressHook();
  //【用户传入的initialState如果是函数就执行】
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  // 【hook的memoizedState设为initialState】
  hook.memoizedState = hook.baseState = initialState;
  // 【生成一个queue并挂到hook上】
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  // 【dispatch用于更新状态的方法，实际调用了dispatchSetState，保存在queue的dispatch属性上】
  const dispatch: Dispatch<BasicStateAction<S>> = (queue.dispatch =
    (dispatchSetState.bind(null, currentlyRenderingFiber, queue): any));
  // 【返回[hook.memoizedState, dispatch]，dispatch就是返回给用户用来更新状态的方法】
  return [hook.memoizedState, dispatch];
}
```

`dispatchSetState`可能有两种情况，一种是在 `render` 过程中产生的 `update`，那就会把当前 `update` 加入 `queue` 的 `pending` 队列，另外就是非 `render` 过程，那就会先趁空隙计算出当前状态值，和之前的状态值对比，如果没有变化那也就不需要更新，如果有变化去调度更新。
```ts
function dispatchSetState<S, A>(
  fiber: Fiber,//【currentlyRenderingFiber】
  queue: UpdateQueue<S, A>,//【queue】
  action: A,
): void {
  // 【省略代码...】
  // 【获取优先级】
  const lane = requestUpdateLane(fiber);

  // 【创建一个update】
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

  // 【将 update 链接到更新队列中】
  if (isRenderPhaseUpdate(fiber)) {
    // 【在render过程中，会触发re-render】
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    // 【非render过程中】
    const alternate = fiber.alternate;
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // 【queue为空时，先把state计算好保存到eagerState中】
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        // 【省略代码...】
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.
          update.hasEagerState = true;
          update.eagerState = eagerState;
          //【对比新旧state，如果相同无需更新，用Object.is比较】
          if (is(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            // TODO: Do we still need to entangle transitions in this case?
            enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }
    // 【根据状态改变调用scheduleUpdateOnFiber调度update，继而走到beginWork/completeWork环节】
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root !== null) {
      const eventTime = requestEventTime();
      scheduleUpdateOnFiber(root, fiber, lane, eventTime);
      entangleTransitionUpdate(root, queue, lane);
    }
  }

  markUpdateInDevTools(fiber, lane, action);
}

// Whether an update was scheduled at any point during the render phase. This
// does not get reset if we do another render pass; only when we're completely
// finished evaluating this component. This is an optimization so we know
// whether we need to clear render phase updates after a throw.
let didScheduleRenderPhaseUpdate: boolean = false;
// Where an update was scheduled only during the current render pass. This
// gets reset after each attempt.
// TODO: Maybe there's some way to consolidate this with
// `didScheduleRenderPhaseUpdate`. Or with `numberOfReRenders`.
let didScheduleRenderPhaseUpdateDuringThisPass: boolean = false;

function enqueueRenderPhaseUpdate<S, A>(
  queue: UpdateQueue<S, A>,
  update: Update<S, A>,
): void {
  // 【这是一个render过程中的update】
  // This is a render phase update. Stash it in a lazily-created map of
  // queue -> linked list of updates. After this render pass, we'll restart
  // and apply the stashed updates on top of the work-in-progress hook.
  didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate =
    true;
  //【把当前这个update加入queue的pending队列，update之间用next链接，并且是头尾衔接循环的】
  const pending = queue.pending;
  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  queue.pending = update;
}
```

### `updateState` => `updateReducer`
`updateState` 实际调用的是 `updateReducer`，首先拿到当前对应 `hook` 和 `hook.queue`，然后把 `pending` 的 `queue` 加入到上一轮还没执行的 `update` 队列 `current.baseQueue` 中，然后遍历执行这个已经串起来的 `update` 队列。`update` 队列的每一项都根据其参数进行进行处理，获取最新的 `state` 然后更新到对应 `hook` 上。
```ts
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}

function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  // $FlowFixMe: Flow doesn't like mixed types
  return typeof action === 'function' ? action(state) : action;
}

function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (queue === null) {
    throw new Error(
      'Should have a queue. This is likely a bug in React. Please file an issue.',
    );
  }

  queue.lastRenderedReducer = reducer;

  const current: Hook = (currentHook: any);

  // 【当前currentFiber上未完成的update】
  // The last rebase update that is NOT part of the base state.
  let baseQueue = current.baseQueue;

  // The last pending update that hasn't been processed yet.
  // 【当前workInProgressFiber上还没处理的pending中的update加入到baseQueue中，还是形成一个单向循环链表】
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    // We have new updates that haven't been processed yet.
    // We'll add them to the base queue.
    // 【baseQueue上有内容就串上去】
    if (baseQueue !== null) {
      // Merge the pending queue and the base queue.
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    // 【省略代码...】
    // 【baseQueue上没有内容把pendingQueue给currentFiber上的baseQueue，然后清空当前pending】
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  // 【baseQueue中有内容，遍历每一个update并处理】
  if (baseQueue !== null) {
    // We have a queue to process.
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast: Update<S, A> | null = null;
    let update = first;
    do {
      // An extra OffscreenLane bit is added to updates that were made to
      // a hidden tree, so that we can distinguish them from updates that were
      // already there when the tree was hidden.
      const updateLane = removeLanes(update.lane, OffscreenLane);
      const isHiddenUpdate = updateLane !== update.lane;

      // Check if this update was made while the tree was hidden. If so, then
      // it's not a "base" update and we should disregard the extra base lanes
      // that were added to renderLanes when we entered the Offscreen tree.
      const shouldSkipUpdate = isHiddenUpdate
        ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
        : !isSubsetOfLanes(renderLanes, updateLane);

      if (shouldSkipUpdate) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: (null: any),
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        // Update the remaining priority in the queue.
        // TODO: Don't need to accumulate this. Instead, we can remove
        // renderLanes from the original lanes.
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
        // This update does have sufficient priority.

        if (newBaseQueueLast !== null) {
          const clone: Update<S, A> = {
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: (null: any),
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        // 【调用action】
        // Process this update.
        const action = update.action;
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          reducer(newState, action);
        }
        // 【如果是已经算过值的，直接用，如果还没就计算】
        if (update.hasEagerState) {
          // If this update is a state update (not a reducer) and was processed eagerly,
          // we can use the eagerly computed state
          newState = ((update.eagerState: any): S);
        } else {
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    } while (update !== null && update !== first);

    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }

    // Mark that the fiber performed work, but only if the new state is
    // different from the current state.
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    // 【更新hook上的state和queue相关】
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  // 【处理完优先级也设为NoLanes】
  if (baseQueue === null) {
    // `queue.lanes` is used for entangling transitions. We can set it back to
    // zero once the queue is empty.
    queue.lanes = NoLanes;
  }

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

---

# useReducer

## useReducer 入口
`useReducer`方法入口，后续可能会调用方法有`mountReducer` & `rerenderReducer` & `updateReducer`：
```ts
useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  currentHookNameInDev = 'useReducer';
  warnInvalidHookAccess();
  mountHookTypesDev();
  const prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
  try {
    return mountReducer(reducer, initialArg, init);
  } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
  }
}

useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  currentHookNameInDev = 'useReducer';
  updateHookTypesDev();
  const prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current =
    InvalidNestedHooksDispatcherOnUpdateInDEV;
  try {
    return updateReducer(reducer, initialArg, init);
  } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
  }
}

useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  currentHookNameInDev = 'useReducer';
  updateHookTypesDev();
  const prevDispatcher = ReactCurrentDispatcher.current;
  ReactCurrentDispatcher.current =
    InvalidNestedHooksDispatcherOnRerenderInDEV;
  try {
    return rerenderReducer(reducer, initialArg, init);
  } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
  }
}
```

## useReducer 原理
### `mountReducer`
创建一个对应的 `hook` ，如果有传 `init` 方法就调用 `init` 方法得到初始值，否者直接拿 `initialArg` 作为初始值，然后创建一个 UpdateQueue 挂到 hook 的 queue 属性上，最后返回 `[hook.memoizedState, dispatch]`， `dispatch` 就是返回给用户更新状态的方法，和 `useState` 非常类似：
```ts
function mountReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = mountWorkInProgressHook();
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = ((initialArg: any): S);
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue: UpdateQueue<S, A> = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  };
  hook.queue = queue;
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
```

### `updateReducer`
内容在上面的 useState ，用的是同样的方法 `updateReducer`。

### `rerenderReducer`
```ts
function rerenderReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  if (queue === null) {
    throw new Error(
      'Should have a queue. This is likely a bug in React. Please file an issue.',
    );
  }

  queue.lastRenderedReducer = reducer;

  // This is a re-render. Apply the new render phase updates to the previous
  // work-in-progress hook.
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  const lastRenderPhaseUpdate = queue.pending;
  let newState = hook.memoizedState;
  if (lastRenderPhaseUpdate !== null) {
    // The queue doesn't persist past this render pass.
    queue.pending = null;

    const firstRenderPhaseUpdate = lastRenderPhaseUpdate.next;
    let update = firstRenderPhaseUpdate;
    do {
      // Process this render phase update. We don't have to check the
      // priority because it will always be the same as the current
      // render's.
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== firstRenderPhaseUpdate);

    // Mark that the fiber performed work, but only if the new state is
    // different from the current state.
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = newState;
    // Don't persist the state accumulated from the render phase updates to
    // the base state unless the queue is empty.
    // TODO: Not sure if this is the desired semantics, but it's what we
    // do for gDSFP. I can't remember why.
    if (hook.baseQueue === null) {
      hook.baseState = newState;
    }

    queue.lastRenderedState = newState;
  }
  return [newState, dispatch];
}
```

---

# useRef

## useRef 入口
`useRef`方法入口，后续可能会调用方法有`mountRef` & `updateRef`：
```ts
useRef<T>(initialValue: T): {current: T} {
  currentHookNameInDev = 'useRef';
  warnInvalidHookAccess();
  mountHookTypesDev();
  return mountRef(initialValue);
},
useRef<T>(initialValue: T): {current: T} {
  currentHookNameInDev = 'useRef';
  updateHookTypesDev();
  return updateRef(initialValue);
},
```

## useRef 原理
### `mountRef`
`mountRef`除了创建对应的 `hook` ，还会初始化一个对象包含一个 `current` 属性，用户传入的初始值作为这个 `current` 属性的值，然后把这个初始对象存入 `hook` 的 `memoizedState` ：
```ts
function mountRef<T>(initialValue: T): {current: T} {
  const hook = mountWorkInProgressHook();
  if (enableUseRefAccessWarning) {
    if (__DEV__) {
      // Support lazy initialization pattern shown in docs.
      // We need to store the caller stack frame so that we don't warn on subsequent renders.
      let hasBeenInitialized = initialValue != null;
      let lazyInitGetterStack = null;
      let didCheckForLazyInit = false;

      // Only warn once per component+hook.
      let didWarnAboutRead = false;
      let didWarnAboutWrite = false;

      let current = initialValue;
      const ref = {
        get current() {
          if (!hasBeenInitialized) {
            didCheckForLazyInit = true;
            lazyInitGetterStack = getCallerStackFrame();
          } else if (currentlyRenderingFiber !== null && !didWarnAboutRead) {
            if (
              lazyInitGetterStack === null ||
              lazyInitGetterStack !== getCallerStackFrame()
            ) {
              didWarnAboutRead = true;
              console.warn(
                '%s: Unsafe read of a mutable value during render.\n\n' +
                  'Reading from a ref during render is only safe if:\n' +
                  '1. The ref value has not been updated, or\n' +
                  '2. The ref holds a lazily-initialized value that is only set once.\n',
                getComponentNameFromFiber(currentlyRenderingFiber) || 'Unknown',
              );
            }
          }
          return current;
        },
        set current(value: any) {
          if (currentlyRenderingFiber !== null && !didWarnAboutWrite) {
            if (hasBeenInitialized || !didCheckForLazyInit) {
              didWarnAboutWrite = true;
              console.warn(
                '%s: Unsafe write of a mutable value during render.\n\n' +
                  'Writing to a ref during render is only safe if the ref holds ' +
                  'a lazily-initialized value that is only set once.\n',
                getComponentNameFromFiber(currentlyRenderingFiber) || 'Unknown',
              );
            }
          }

          hasBeenInitialized = true;
          current = value;
        },
      };
      Object.seal(ref);
      hook.memoizedState = ref;
      return ref;
    } else {
      const ref = {current: initialValue};
      hook.memoizedState = ref;
      return ref;
    }
  } else {
    const ref = {current: initialValue};
    hook.memoizedState = ref;
    return ref;
  }
}
```

### `updateRef`
```ts
function updateRef<T>(initialValue: T): {current: T} {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```