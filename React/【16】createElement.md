# React 细节

<!-- TODO -->

## createElement 原理

`createElement`入口在`packages/react/index.js`，在`React`中我们知道`JSX`会通过`Babel`转译为
`React.createElement`从而生成`ReactElement`对象，可以看到最后返回的是`React.createElement`方法生成的`ReactElement`对象：

```ts
// 【packages/react/src/jsx/ReactJSXElement.js】
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement(type, config, children) {
  if (__DEV__) {
    if (!enableOwnerStacks && !isValidElementType(type)) {
      // This is just an optimistic check that provides a better stack trace before
      // owner stacks. It's really up to the renderer if it's a valid element type.
      // When owner stacks are enabled, we instead warn in the renderer and it'll
      // have the stack trace of the JSX element anyway.
      //
      // This is an invalid element type.
      //
      // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.
      let info = ""
      if (
        type === undefined ||
        (typeof type === "object" && type !== null && Object.keys(type).length === 0)
      ) {
        info +=
          " You likely forgot to export your component from the file " +
          "it's defined in, or you might have mixed up default and named imports."
      }

      let typeString
      if (type === null) {
        typeString = "null"
      } else if (isArray(type)) {
        typeString = "array"
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = `<${getComponentNameFromType(type.type) || "Unknown"} />`
        info = " Did you accidentally export a JSX literal instead of a component?"
      } else {
        typeString = typeof type
      }

      console.error(
        "React.createElement: type is invalid -- expected a string (for " +
          "built-in components) or a class/function (for composite " +
          "components) but got: %s.%s",
        typeString,
        info,
      )
    } else {
      // This is a valid element type.

      // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing
      // errors. We don't want exception behavior to differ between dev and
      // prod. (Rendering will throw with a helpful message and as soon as the
      // type is fixed, the key warnings will appear.)
      for (let i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type)
      }
    }

    // Unlike the jsx() runtime, createElement() doesn't warn about key spread.
  }

  let propName

  // Reserved names are extracted
  const props = {}

  let key = null
  let ref = null

  if (config != null) {
    if (__DEV__) {
      if (
        !didWarnAboutOldJSXRuntime &&
        "__self" in config &&
        // Do not assume this is the result of an oudated JSX transform if key
        // is present, because the modern JSX transform sometimes outputs
        // createElement to preserve precedence between a static key and a
        // spread key. To avoid false positive warnings, we never warn if
        // there's a key.
        !("key" in config)
      ) {
        didWarnAboutOldJSXRuntime = true
        console.warn(
          "Your app (or one of its dependencies) is using an outdated JSX " +
            "transform. Update to the modern JSX transform for " +
            "faster performance: https://react.dev/link/new-jsx-transform",
        )
      }
    }

    if (hasValidRef(config)) {
      if (!enableRefAsProp) {
        ref = config.ref
        if (!disableStringRefs) {
          ref = coerceStringRef(ref, getOwner(), type)
        }
      }

      if (__DEV__ && !disableStringRefs) {
        warnIfStringRefCannotBeAutoConverted(config, config.__self)
      }
    }
    if (hasValidKey(config)) {
      if (__DEV__) {
        checkKeyStringCoercion(config.key)
      }
      key = "" + config.key
    }

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        // Skip over reserved prop names
        propName !== "key" &&
        (enableRefAsProp || propName !== "ref") &&
        // Even though we don't use these anymore in the runtime, we don't want
        // them to appear as props, so in createElement we filter them out.
        // We don't have to do this in the jsx() runtime because the jsx()
        // transform never passed these as props; it used separate arguments.
        propName !== "__self" &&
        propName !== "__source"
      ) {
        if (enableRefAsProp && !disableStringRefs && propName === "ref") {
          props.ref = coerceStringRef(config[propName], getOwner(), type)
        } else {
          props[propName] = config[propName]
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2
  if (childrenLength === 1) {
    props.children = children
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength)
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2]
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray)
      }
    }
    props.children = childArray
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName]
      }
    }
  }
  if (__DEV__) {
    if (key || (!enableRefAsProp && ref)) {
      const displayName =
        typeof type === "function" ? type.displayName || type.name || "Unknown" : type
      if (key) {
        defineKeyPropWarningGetter(props, displayName)
      }
      if (!enableRefAsProp && ref) {
        defineRefPropWarningGetter(props, displayName)
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    undefined,
    undefined,
    getOwner(),
    props,
    __DEV__ && enableOwnerStacks ? Error("react-stack-top-frame") : undefined,
    __DEV__ && enableOwnerStacks ? createTask(getTaskName(type)) : undefined,
  )
}
```

工厂函数`ReactElement`用于构造`ReactElement`对象，后续生成`VNode`都是通过这些`ReactElement`对象：

```ts
// 【packages/react/src/jsx/ReactJSXElement.js】
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.transitional.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
function ReactElement(type, key, _ref, self, source, owner, props, debugStack, debugTask) {
  let ref
  if (enableRefAsProp) {
    // When enableRefAsProp is on, ignore whatever was passed as the ref
    // argument and treat `props.ref` as the source of truth. The only thing we
    // use this for is `element.ref`, which will log a deprecation warning on
    // access. In the next release, we can remove `element.ref` as well as the
    // `ref` argument.
    const refProp = props.ref

    // An undefined `element.ref` is coerced to `null` for
    // backwards compatibility.
    ref = refProp !== undefined ? refProp : null
  } else {
    ref = _ref
  }

  let element
  if (__DEV__ && enableRefAsProp) {
    // In dev, make `ref` a non-enumerable property with a warning. It's non-
    // enumerable so that test matchers and serializers don't access it and
    // trigger the warning.
    //
    // `ref` will be removed from the element completely in a future release.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,

      props,

      // Record the component responsible for creating this element.
      _owner: owner,
    }
    if (ref !== null) {
      Object.defineProperty(element, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning,
      })
    } else {
      // Don't warn on access if a ref is not given. This reduces false
      // positives in cases where a test serializer uses
      // getOwnPropertyDescriptors to compare objects, like Jest does, which is
      // a problem because it bypasses non-enumerability.
      //
      // So unfortunately this will trigger a false positive warning in Jest
      // when the diff is printed:
      //
      //   expect(<div ref={ref} />).toEqual(<span ref={ref} />);
      //
      // A bit sketchy, but this is what we've done for the `props.key` and
      // `props.ref` accessors for years, which implies it will be good enough
      // for `element.ref`, too. Let's see if anyone complains.
      Object.defineProperty(element, "ref", {
        enumerable: false,
        value: null,
      })
    }
  } else if (!__DEV__ && disableStringRefs) {
    // In prod, `ref` is a regular property and _owner doesn't exist.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,
    }
  } else {
    // In prod, `ref` is a regular property. It will be removed in a
    // future release.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,

      // Record the component responsible for creating this element.
      _owner: owner,
    }
  }

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, "validated", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: 0,
    })
    // debugInfo contains Server Component debug information.
    Object.defineProperty(element, "_debugInfo", {
      configurable: false,
      enumerable: false,
      writable: true,
      value: null,
    })
    if (enableOwnerStacks) {
      Object.defineProperty(element, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack,
      })
      Object.defineProperty(element, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask,
      })
    }
    if (Object.freeze) {
      Object.freeze(element.props)
      Object.freeze(element)
    }
  }

  return element
}
```

## update 系统原理

### update 预处理

- `enqueueUpdate`
- `enqueueConcurrentHookUpdate`
- `enqueueConcurrentHookUpdateAndEagerlyBailout`
- `enqueueConcurrentClassUpdate`
- `enqueueConcurrentRenderForLane`

```ts
// 【packages/react-reconciler/src/ReactFiberConcurrentUpdates.js】
function enqueueUpdate(
  fiber: Fiber,
  queue: ConcurrentQueue | null,
  update: ConcurrentUpdate | null,
  lane: Lane,
) {
  // Don't update the `childLanes` on the return path yet. If we already in
  // the middle of rendering, wait until after it has completed.
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
  concurrentQueues[concurrentQueuesIndex++] = lane;

  concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);

  // The fiber's `lane` field is used in some places to check if any work is
  // scheduled, to perform an eager bailout, so we need to update it immediately.
  // TODO: We should probably move this to the "shared" queue instead.
  fiber.lanes = mergeLanes(fiber.lanes, lane);
  const alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
}

export function enqueueConcurrentHookUpdate<S, A>(
  fiber: Fiber,
  queue: HookQueue<S, A>,
  update: HookUpdate<S, A>,
  lane: Lane,
): FiberRoot | null {
  const concurrentQueue: ConcurrentQueue = (queue: any);
  const concurrentUpdate: ConcurrentUpdate = (update: any);
  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);
  return getRootForUpdatedFiber(fiber);
}

export function enqueueConcurrentHookUpdateAndEagerlyBailout<S, A>(
  fiber: Fiber,
  queue: HookQueue<S, A>,
  update: HookUpdate<S, A>,
): void {
  // This function is used to queue an update that doesn't need a rerender. The
  // only reason we queue it is in case there's a subsequent higher priority
  // update that causes it to be rebased.
  const lane = NoLane;
  const concurrentQueue: ConcurrentQueue = (queue: any);
  const concurrentUpdate: ConcurrentUpdate = (update: any);
  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);

  // Usually we can rely on the upcoming render phase to process the concurrent
  // queue. However, since this is a bail out, we're not scheduling any work
  // here. So the update we just queued will leak until something else happens
  // to schedule work (if ever).
  //
  // Check if we're currently in the middle of rendering a tree, and if not,
  // process the queue immediately to prevent a leak.
  const isConcurrentlyRendering = getWorkInProgressRoot() !== null;
  if (!isConcurrentlyRendering) {
    finishQueueingConcurrentUpdates();
  }
}

export function enqueueConcurrentClassUpdate<State>(
  fiber: Fiber,
  queue: ClassQueue<State>,
  update: ClassUpdate<State>,
  lane: Lane,
): FiberRoot | null {
  const concurrentQueue: ConcurrentQueue = (queue: any);
  const concurrentUpdate: ConcurrentUpdate = (update: any);
  enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);
  return getRootForUpdatedFiber(fiber);
}

export function enqueueConcurrentRenderForLane(
  fiber: Fiber,
  lane: Lane,
): FiberRoot | null {
  enqueueUpdate(fiber, null, null, lane);
  return getRootForUpdatedFiber(fiber);
}

function getRootForUpdatedFiber(sourceFiber: Fiber): FiberRoot | null {
  // TODO: We will detect and infinite update loop and throw even if this fiber
  // has already unmounted. This isn't really necessary but it happens to be the
  // current behavior we've used for several release cycles. Consider not
  // performing this check if the updated fiber already unmounted, since it's
  // not possible for that to cause an infinite update loop.
  throwIfInfiniteUpdateLoopDetected();

  // When a setState happens, we must ensure the root is scheduled. Because
  // update queues do not have a backpointer to the root, the only way to do
  // this currently is to walk up the return path. This used to not be a big
  // deal because we would have to walk up the return path to set
  // the `childLanes`, anyway, but now those two traversals happen at
  // different times.
  // TODO: Consider adding a `root` backpointer on the update queue.
  detectUpdateOnUnmountedFiber(sourceFiber, sourceFiber);
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    detectUpdateOnUnmountedFiber(sourceFiber, node);
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? (node.stateNode: FiberRoot) : null;
}
```

- `markUpdateLaneFromFiberToRoot`

```ts
// 【packages/react-reconciler/src/ReactFiberConcurrentUpdates.js】
function markUpdateLaneFromFiberToRoot(
  sourceFiber: Fiber,
  update: ConcurrentUpdate | null,
  lane: Lane,
): null | FiberRoot {
  // Update the source fiber's lanes
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane)
  let alternate = sourceFiber.alternate
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane)
  }
  // Walk the parent path to the root and update the child lanes.
  let isHidden = false
  let parent = sourceFiber.return
  let node = sourceFiber
  while (parent !== null) {
    parent.childLanes = mergeLanes(parent.childLanes, lane)
    alternate = parent.alternate
    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane)
    }

    if (parent.tag === OffscreenComponent) {
      // Check if this offscreen boundary is currently hidden.
      //
      // The instance may be null if the Offscreen parent was unmounted. Usually
      // the parent wouldn't be reachable in that case because we disconnect
      // fibers from the tree when they are deleted. However, there's a weird
      // edge case where setState is called on a fiber that was interrupted
      // before it ever mounted. Because it never mounts, it also never gets
      // deleted. Because it never gets deleted, its return pointer never gets
      // disconnected. Which means it may be attached to a deleted Offscreen
      // parent node. (This discovery suggests it may be better for memory usage
      // if we don't attach the `return` pointer until the commit phase, though
      // in order to do that we'd need some other way to track the return
      // pointer during the initial render, like on the stack.)
      //
      // This case is always accompanied by a warning, but we still need to
      // account for it. (There may be other cases that we haven't discovered,
      // too.)
      const offscreenInstance: OffscreenInstance | null = parent.stateNode
      if (offscreenInstance !== null && !(offscreenInstance._visibility & OffscreenVisible)) {
        isHidden = true
      }
    }

    node = parent
    parent = parent.return
  }

  if (node.tag === HostRoot) {
    const root: FiberRoot = node.stateNode
    if (isHidden && update !== null) {
      markHiddenUpdate(root, update, lane)
    }
    return root
  }
  return null
}
```

### update 任务调度

- `scheduleUpdateOnFiber`：主要是在 `root` 节点上确保 `update` 和 `lane` 已挂载，然后调用 `ensureRootIsScheduled`
- `ensureRootIsScheduled`：主要是根据目前最高优先级的任务，将任务进行安排，可能是同步也可能是异步，然后调用 `scheduleSyncCallback`/`scheduleCallback` 安排任务
- `scheduleCallback`：主要是根据任务优先级设置超时时间，然后组装成一个完整的任务对象，并把这个任务对象加入已就绪队列或者未就绪队列，最后调用 `requestHostCallback(flushWork)` 开始任务的执行流程
- `flushWork`：主要是执行各个任务
- `performConcurrentWorkOnRoot`：视图更新任务

```ts
export function scheduleUpdateOnFiber(root: FiberRoot, fiber: Fiber, lane: Lane) {
  if (__DEV__) {
    if (isRunningInsertionEffect) {
      console.error("useInsertionEffect must not schedule updates.")
    }
  }

  if (__DEV__) {
    if (isFlushingPassiveEffects) {
      didScheduleUpdateDuringPassiveEffects = true
    }
  }

  // Check if the work loop is currently suspended and waiting for data to
  // finish loading.
  if (
    // Suspended render phase
    (root === workInProgressRoot &&
      (workInProgressSuspendedReason === SuspendedOnData ||
        workInProgressSuspendedReason === SuspendedOnAction)) ||
    // Suspended commit phase
    root.cancelPendingCommit !== null
  ) {
    // The incoming update might unblock the current render. Interrupt the
    // current attempt and restart from the top.
    prepareFreshStack(root, NoLanes)
    const didAttemptEntireTree = false
    markRootSuspended(
      root,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
      didAttemptEntireTree,
    )
  }

  // Mark that the root has a pending update.
  markRootUpdated(root, lane)

  if ((executionContext & RenderContext) !== NoLanes && root === workInProgressRoot) {
    // This update was dispatched during the render phase. This is a mistake
    // if the update originates from user space (with the exception of local
    // hook updates, which are handled differently and don't reach this
    // function), but there are some internal React features that use this as
    // an implementation detail, like selective hydration.
    warnAboutRenderPhaseUpdatesInDEV(fiber)

    // Track lanes that were updated during the render phase
    workInProgressRootRenderPhaseUpdatedLanes = mergeLanes(
      workInProgressRootRenderPhaseUpdatedLanes,
      lane,
    )
  } else {
    // This is a normal update, scheduled from outside the render phase. For
    // example, during an input event.
    if (enableUpdaterTracking) {
      if (isDevToolsPresent) {
        addFiberToLanesMap(root, fiber, lane)
      }
    }

    warnIfUpdatesNotWrappedWithActDEV(fiber)

    if (enableTransitionTracing) {
      const transition = ReactSharedInternals.T
      if (transition !== null && transition.name != null) {
        if (transition.startTime === -1) {
          transition.startTime = now()
        }

        // $FlowFixMe[prop-missing]: The BatchConfigTransition and Transition types are incompatible but was previously untyped and thus uncaught
        // $FlowFixMe[incompatible-call]: "
        addTransitionToLanesMap(root, transition, lane)
      }
    }

    if (root === workInProgressRoot) {
      // Received an update to a tree that's in the middle of rendering. Mark
      // that there was an interleaved update work on this root.
      if ((executionContext & RenderContext) === NoContext) {
        workInProgressRootInterleavedUpdatedLanes = mergeLanes(
          workInProgressRootInterleavedUpdatedLanes,
          lane,
        )
      }
      if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        // The root already suspended with a delay, which means this render
        // definitely won't finish. Since we have a new update, let's mark it as
        // suspended now, right before marking the incoming update. This has the
        // effect of interrupting the current render and switching to the update.
        // TODO: Make sure this doesn't override pings that happen while we've
        // already started rendering.
        const didAttemptEntireTree = false
        markRootSuspended(
          root,
          workInProgressRootRenderLanes,
          workInProgressDeferredLane,
          didAttemptEntireTree,
        )
      }
    }

    ensureRootIsScheduled(root)
    if (
      lane === SyncLane &&
      executionContext === NoContext &&
      !disableLegacyMode &&
      (fiber.mode & ConcurrentMode) === NoMode
    ) {
      if (__DEV__ && ReactSharedInternals.isBatchingLegacy) {
        // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      } else {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        resetRenderTimer()
        flushSyncWorkOnLegacyRootsOnly()
      }
    }
  }
}

export function ensureRootIsScheduled(root: FiberRoot): void {
  // This function is called whenever a root receives an update. It does two
  // things 1) it ensures the root is in the root schedule, and 2) it ensures
  // there's a pending microtask to process the root schedule.
  //
  // Most of the actual scheduling logic does not happen until
  // `scheduleTaskForRootDuringMicrotask` runs.

  // Add the root to the schedule
  if (root === lastScheduledRoot || root.next !== null) {
    // Fast path. This root is already scheduled.
  } else {
    if (lastScheduledRoot === null) {
      firstScheduledRoot = lastScheduledRoot = root
    } else {
      lastScheduledRoot.next = root
      lastScheduledRoot = root
    }
  }

  // Any time a root received an update, we set this to true until the next time
  // we process the schedule. If it's false, then we can quickly exit flushSync
  // without consulting the schedule.
  mightHavePendingSyncWork = true

  // At the end of the current event, go through each of the roots and ensure
  // there's a task scheduled for each one at the correct priority.
  if (__DEV__ && ReactSharedInternals.actQueue !== null) {
    // We're inside an `act` scope.
    if (!didScheduleMicrotask_act) {
      didScheduleMicrotask_act = true
      scheduleImmediateRootScheduleTask()
    }
  } else {
    if (!didScheduleMicrotask) {
      didScheduleMicrotask = true
      scheduleImmediateRootScheduleTask()
    }
  }

  if (
    __DEV__ &&
    !disableLegacyMode &&
    ReactSharedInternals.isBatchingLegacy &&
    root.tag === LegacyRoot
  ) {
    // Special `act` case: Record whenever a legacy update is scheduled.
    ReactSharedInternals.didScheduleLegacyUpdate = true
  }
}

function scheduleImmediateRootScheduleTask() {
  if (__DEV__ && ReactSharedInternals.actQueue !== null) {
    // Special case: Inside an `act` scope, we push microtasks to the fake `act`
    // callback queue. This is because we currently support calling `act`
    // without awaiting the result. The plan is to deprecate that, and require
    // that you always await the result so that the microtasks have a chance to
    // run. But it hasn't happened yet.
    ReactSharedInternals.actQueue.push(() => {
      processRootScheduleInMicrotask()
      return null
    })
  }

  // TODO: Can we land supportsMicrotasks? Which environments don't support it?
  // Alternatively, can we move this check to the host config?
  if (supportsMicrotasks) {
    scheduleMicrotask(() => {
      // In Safari, appending an iframe forces microtasks to run.
      // https://github.com/facebook/react/issues/22459
      // We don't support running callbacks in the middle of render
      // or commit so we need to check against that.
      const executionContext = getExecutionContext()
      if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
        // Note that this would still prematurely flush the callbacks
        // if this happens outside render or commit phase (e.g. in an event).

        // Intentionally using a macrotask instead of a microtask here. This is
        // wrong semantically but it prevents an infinite loop. The bug is
        // Safari's, not ours, so we just do our best to not crash even though
        // the behavior isn't completely correct.
        Scheduler_scheduleCallback(ImmediateSchedulerPriority, processRootScheduleInImmediateTask)
        return
      }
      processRootScheduleInMicrotask()
    })
  } else {
    // If microtasks are not supported, use Scheduler.
    Scheduler_scheduleCallback(ImmediateSchedulerPriority, processRootScheduleInImmediateTask)
  }
}

function unstable_scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options?: { delay: number },
): Task {
  var currentTime = getCurrentTime()

  var startTime
  if (typeof options === "object" && options !== null) {
    var delay = options.delay
    if (typeof delay === "number" && delay > 0) {
      startTime = currentTime + delay
    } else {
      startTime = currentTime
    }
  } else {
    startTime = currentTime
  }

  var timeout
  switch (priorityLevel) {
    case ImmediatePriority:
      // Times out immediately
      timeout = -1
      break
    case UserBlockingPriority:
      // Eventually times out
      timeout = userBlockingPriorityTimeout
      break
    case IdlePriority:
      // Never times out
      timeout = maxSigned31BitInt
      break
    case LowPriority:
      // Eventually times out
      timeout = lowPriorityTimeout
      break
    case NormalPriority:
    default:
      // Eventually times out
      timeout = normalPriorityTimeout
      break
  }

  var expirationTime = startTime + timeout

  var newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  }
  if (enableProfiling) {
    newTask.isQueued = false
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime
    push(timerQueue, newTask)
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout()
      } else {
        isHostTimeoutScheduled = true
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime)
    }
  } else {
    newTask.sortIndex = expirationTime
    push(taskQueue, newTask)
    if (enableProfiling) {
      markTaskStart(newTask, currentTime)
      newTask.isQueued = true
    }
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true
      requestHostCallback()
    }
  }

  return newTask
}
```

## 元素和组件

## 总结

## 参考资料
