# Schedule

## 优先级Lane

在`Concurrency`模式下，不同的任务有不同的优先级，例如：

- 过期任务或者同步任务使用同步优先级
- 用户交互产生的更新（比如点击事件）使用高优先级
- 网络请求产生的更新使用一般优先级
- Suspense使用低优先级

```ts
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;
```

React中用用31位的二进制来标志优先级的高低：

```ts
export const TotalLanes = 31;

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncHydrationLane: Lane = /*               */ 0b0000000000000000000000000000001;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000010;

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000100;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000001000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000010000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000100000;

export const SyncUpdateLanes: Lane = /*                */ 0b0000000000000000000000000101010;
// ...
```

## Scheduler  

`scheduleLegacySyncCallback`

`scheduleCallback` 方法由 `Scheduler` 模块提供，用于以某个优先级异步调度一个回调函数。

在 `React` 中，有如下方法可以触发状态更新和渲染：

- `ReactDOM.render` —— HostRoot
- `this.setState` —— ClassComponent
- `this.forceUpdate` —— ClassComponent
- `useState` —— FunctionComponent
- `useReducer` —— FunctionComponent

1. `scheduleUpdateOnFiber` => `ensureRootIsScheduled` => `performSyncWorkOnRoot` => `flushPassiveEffects`
2. `commitRootImpl`中的四个重要步骤如下：
    - `scheduleCallback(NormalSchedulerPriority, () => {flushPassiveEffects(); return null;})` => `flushPassiveEffects`
    - `commitBeforeMutationEffects`
    - `commitMutationEffects`
    - `commitLayoutEffects`

在`scheduleCallback`方法中会给`flushPassiveEffects`根据优先级安排新建一个 `newTask` 任务并入堆，过程如下：

```ts
var taskQueue: Array<Task> = [];
var timerQueue: Array<Task> = [];

function unstable_scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options?: {delay: number},
): Task {
  var currentTime = getCurrentTime();

  var startTime;
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  var expirationTime = startTime + timeout;

  var newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
```

`React` 通过 `new MessageChannel()` 创建了消息通道，当发现 JS 线程空闲时，通过 `postMessage` 通知 `scheduler` 开始调度。然后 `React` 接收到调度开始的通知时，就通过 `performWorkUntilDeadline` 函数去更新当前帧的结束时间，以及执行任务。从而实现了帧空闲时间的任务调度。

可中断模式下的 `workLoop`，每次遍历执行 `performUnitOfWork` 前会先判断 `shouYield` 的值：

```ts
export function unstable_shouldYield() {
  return getCurrentTime() >= deadline;
}
```

`getCurrentTime` 获取的是当前的时间戳，`deadline` 上面讲到了是浏览器每一帧结束的时间戳。也就是说 `concurrent` 模式下，`react` 会将这些非同步任务放到浏览器每一帧空闲时间段去执行，若每一帧结束未执行完，则中断当前任务，待到浏览器下一帧的空闲再继续执行。

## Update

## flushPassiveEffects

`flushPassiveEffects`

```ts
export function flushPassiveEffects(): boolean {
  // Returns whether passive effects were flushed.
  // TODO: Combine this check with the one in flushPassiveEFfectsImpl. We should
  // probably just combine the two functions. I believe they were only separate
  // in the first place because we used to wrap it with
  // `Scheduler.runWithPriority`, which accepts a function. But now we track the
  // priority within React itself, so we can mutate the variable directly.
  if (rootWithPendingPassiveEffects !== null) {
    // Cache the root since rootWithPendingPassiveEffects is cleared in
    // flushPassiveEffectsImpl
    const root = rootWithPendingPassiveEffects;
    // Cache and clear the remaining lanes flag; it must be reset since this
    // method can be called from various places, not always from commitRoot
    // where the remaining lanes are known
    const remainingLanes = pendingPassiveEffectsRemainingLanes;
    pendingPassiveEffectsRemainingLanes = NoLanes;

    const renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    const priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    const prevTransition = ReactCurrentBatchConfig.transition;
    const previousPriority = getCurrentUpdatePriority();

    try {
      ReactCurrentBatchConfig.transition = null;
      setCurrentUpdatePriority(priority);
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig.transition = prevTransition;

      // Once passive effects have run for the tree - giving components a
      // chance to retain cache instances they use - release the pooled
      // cache at the root (if there is one)
      releaseRootPooledCache(root, remainingLanes);
    }
  }
  return false;
}
```

`flushPassiveEffectsImpl`

```ts
function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }

  // Cache and clear the transitions flag
  const transitions = pendingPassiveTransitions;
  pendingPassiveTransitions = null;

  const root = rootWithPendingPassiveEffects;
  const lanes = pendingPassiveEffectsLanes;
  rootWithPendingPassiveEffects = null;
  // TODO: This is sometimes out of sync with rootWithPendingPassiveEffects.
  // Figure out why and fix it. It's not causing any known issues (probably
  // because it's only used for profiling), but it's a refactor hazard.
  pendingPassiveEffectsLanes = NoLanes;

  // 【省略代码...】

  if (enableSchedulingProfiler) {
    markPassiveEffectsStarted(lanes);
  }

  const prevExecutionContext = executionContext;
  executionContext |= CommitContext;

  commitPassiveUnmountEffects(root.current);
  commitPassiveMountEffects(root, root.current, lanes, transitions);

  // TODO: Move to commitPassiveMountEffects
  if (enableProfilerTimer && enableProfilerCommitHooks) {
    const profilerEffects = pendingPassiveProfilerEffects;
    pendingPassiveProfilerEffects = [];
    for (let i = 0; i < profilerEffects.length; i++) {
      const fiber = ((profilerEffects[i]: any): Fiber);
      commitPassiveEffectDurations(root, fiber);
    }
  }

  // 【省略代码...】

  if (enableSchedulingProfiler) {
    markPassiveEffectsStopped();
  }

  // 【省略代码...】

  executionContext = prevExecutionContext;

  flushSyncCallbacks();

  if (enableTransitionTracing) {
    const prevPendingTransitionCallbacks = currentPendingTransitionCallbacks;
    const prevRootTransitionCallbacks = root.transitionCallbacks;
    const prevEndTime = currentEndTime;
    if (
      prevPendingTransitionCallbacks !== null &&
      prevRootTransitionCallbacks !== null &&
      prevEndTime !== null
    ) {
      currentPendingTransitionCallbacks = null;
      currentEndTime = null;
      scheduleCallback(IdleSchedulerPriority, () => {
        processTransitionCallbacks(
          prevPendingTransitionCallbacks,
          prevEndTime,
          prevRootTransitionCallbacks,
        );
      });
    }
  }

  // 【省略代码...】

  // TODO: Move to commitPassiveMountEffects
  onPostCommitRootDevTools(root);
  if (enableProfilerTimer && enableProfilerCommitHooks) {
    const stateNode = root.current.stateNode;
    stateNode.effectDuration = 0;
    stateNode.passiveEffectDuration = 0;
  }

  return true;
}
```

`flushSyncCallbacks`

```ts
export function flushSyncCallbacks(): null {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrance.
    isFlushingSyncQueue = true;

    // Set the event priority to discrete
    // TODO: Is this necessary anymore? The only user code that runs in this
    // queue is in the render or commit phases, which already set the
    // event priority. Should be able to remove.
    const previousUpdatePriority = getCurrentUpdatePriority();
    setCurrentUpdatePriority(DiscreteEventPriority);

    let errors: Array<mixed> | null = null;

    const queue = syncQueue;
    // $FlowFixMe[incompatible-use] found when upgrading Flow
    for (let i = 0; i < queue.length; i++) {
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      let callback: SchedulerCallback = queue[i];
      try {
        do {
          const isSync = true;
          // $FlowFixMe[incompatible-type] we bail out when we get a null
          callback = callback(isSync);
        } while (callback !== null);
      } catch (error) {
        // Collect errors so we can rethrow them at the end
        if (errors === null) {
          errors = [error];
        } else {
          errors.push(error);
        }
      }
    }

    syncQueue = null;
    includesLegacySyncCallbacks = false;
    setCurrentUpdatePriority(previousUpdatePriority);
    isFlushingSyncQueue = false;

    if (errors !== null) {
      if (errors.length > 1) {
        if (typeof AggregateError === 'function') {
          // eslint-disable-next-line no-undef
          throw new AggregateError(errors);
        } else {
          for (let i = 1; i < errors.length; i++) {
            scheduleCallback(
              ImmediatePriority,
              throwError.bind(null, errors[i]),
            );
          }
          const firstError = errors[0];
          throw firstError;
        }
      } else {
        const error = errors[0];
        throw error;
      }
    }
  }

  return null;
}
```

## 参考资料

[How React Scheduler works internally?](https://jser.dev/react/2022/03/16/how-react-scheduler-works/)
