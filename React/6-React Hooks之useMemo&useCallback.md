# useMemo

## useMemo 入口
`useMemo`方法入口，后续可能会调用方法有`mountMemo` | `updateMemo`：
```ts
useMemo<T>(create: () => T, deps: Array<mixed> | void | null): T {
    currentHookNameInDev = 'useMemo';
    mountHookTypesDev();
    checkDepsAreArrayDev(deps);
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
    try {
    return mountMemo(create, deps);
    } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
    }
},
useMemo<T>(create: () => T, deps: Array<mixed> | void | null): T {
    currentHookNameInDev = 'useMemo';
    updateHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current =
    InvalidNestedHooksDispatcherOnUpdateInDEV;
    try {
    return updateMemo(create, deps);
    } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
    }
},
```

## useMemo 原理
### `mountMemo`
`mountMemo` 方法首先调用 `mountWorkInProgressHook` 生成对应的 `hook` ，然后调用用户传入的方法得到缓存值 `nextValue` 并将缓存值 `nextValue` 和依赖对象`nextDeps` 以数组形式存入 `hook` 的 `memoizedState` 属性`[nextValue, nextDeps]`，最后返回缓存值 `nextValue`：
```ts
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  if (shouldDoubleInvokeUserFnsInHooksDEV) {
    nextCreate();
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

### `updateMemo`
`updateMemo` 方法首先调用 `updateWorkInProgressHook` 更新对应的 `hook`，然后对比依赖的 `deps` 是否相等，如果相等直接返回之前缓存的值，如果不相等就重新调用用户传入的函数计算：
```ts
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  // Assume these are defined. If they're not, areHookInputsEqual will warn.
  if (nextDeps !== null) {
    const prevDeps: Array<mixed> | null = prevState[1];
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }
  if (shouldDoubleInvokeUserFnsInHooksDEV) {
    nextCreate();
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
): boolean {
  // 【省略代码...】
  // 【循环遍历deps用Object.is对比新旧dep是否相同】
  // $FlowFixMe[incompatible-use] found when upgrading Flow
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    // $FlowFixMe[incompatible-use] found when upgrading Flow
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

---

# useCallback

## useCallback 入口
`useCallback`方法入口，后续可能会调用方法有`mountCallback` | `updateCallback`：
```ts
useCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
    currentHookNameInDev = 'useCallback';
    mountHookTypesDev();
    checkDepsAreArrayDev(deps);
    return mountCallback(callback, deps);
},
useCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
    currentHookNameInDev = 'useCallback';
    updateHookTypesDev();
    return updateCallback(callback, deps);
},
```

## useCallback 原理
### `mountCallback`
`mountCallback` 方法首先调用 `mountWorkInProgressHook` 生成对应的 `hook` ，然后将缓存内容 `callback` 和依赖对象 `nextDeps` 以数组形式存入 `hook` 的 `memoizedState` 属性`[callback, nextDeps]`，最后返回缓存内容 `callback`：
```ts
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```

### `updateCallback`
`updateCallback` 方法首先调用 `updateWorkInProgressHook` 更新对应的 `hook`，然后对比依赖的 `deps` 是否相等，如果相等直接返回之前缓存的内容，如果不相等就重新缓存用户传入的 `callback`：
```ts
function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (nextDeps !== null) {
    const prevDeps: Array<mixed> | null = prevState[1];
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      return prevState[0];
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```