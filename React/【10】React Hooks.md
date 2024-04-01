# React Hooks

## Hook一览

```ts
const HooksDispatcherOnRerender: Dispatcher = {
  readContext,

  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
};
```

## Hook使用的注意事项

1. `Hook` 不能在 `Class` 组件中使用，而是在 `Function Component` 中使用
2. 只能在函数顶层调用 `Hook`，不要在循环、条件判断或者子函数中使用
3. 只能在函数组件中调用 `Hook`，不要在其他JS函数中调用

### useState

State lets a component “remember” information like user input. For example, a form component can use state to store the input value, while an image gallery component can use state to store the selected image index.

```js
// initialState: 状态初始值
// init: 状态初始化函数
const [state, setState] = useState(initialState);

let init = () => {
  const initialState = someExpensiveComputation(props);
  return initialState;
}
const [state, setState] = useState(init);

import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

- `useState` 返回一个 `state`，以及更新 `state` 的函数；
- 在**初始渲染**期间，返回的状态 `state` 与传入的第一个参数 `initialState` 值相同；
- `initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 `state` 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 `state`，此函数只在初始渲染时被调用；
- 在后续的**重新渲染**中，`useState` 返回的第一个值将始终是更新后最新的 `state`；
- `setState` 函数用于更新 `state`，它接收一个新的 `state` 值并将组件的一次**重新渲染**加入队列；
- 如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 `state`，并返回一个更新后的值；

### useReducer

```js
// reducer: 处理状态更新的reducer
// initialArg: 状态初始值
// init: 状态初始化函数
const [state, dispatch] = useReducer(reducer, initialArg, init?);
const [state, dispatch] = useReducer(reducer,{count: initialCount});

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, initialState);
```

- `useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法；
- 可以选择惰性地创建初始 `state`。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`；
- 如果 `Reducer Hook` 的返回值与当前 `state` 相同，`React` 将跳过子组件的渲染及副作用的执行，`React` 使用 `Object.is` 来比较 `state`；

### useEffect

Effects let a component connect to and synchronize with external systems. This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and other non-React code.

```js
import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 数据获取操作
    fetchData()
      .then(response => setData(response))
      .catch(error => console.error(error));
  }, []); // 空数组表示仅在组件挂载时运行一次

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

- 该 `Hook` 接收一个包含命令式、且可能有副作用代码的函数；
- 使用 `useEffect` 完成副作用操作，值给 `useEffect` 的函数会在组件渲染到屏幕之后执行；
- 默认情况下，`effect` 将在每轮渲染结束后执行，但你可以选择让它在只有某些值改变的时候才执行；
- 组件卸载时需要清除 `effect` 创建的诸如订阅或计时器 ID 等资源，要实现这一点，`useEffect` 函数需返回一个清除函数；

### useContext

Context lets a component receive information from distant parents without passing it as props. For example, your app’s top-level component can pass the current UI theme to all components below, no matter how deep.

```js
import React, { useContext } from 'react';
import MyContext from './MyContext';

function MyComponent() {
  const contextValue = useContext(MyContext);

  return <p>{contextValue}</p>;
}
```

- 接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中**距离当前组件最近**的 `<MyContext.Provider>` 的 `value prop` 决定；
- `useContext` 的参数必须是 `context` 对象本身；

### useRef

Refs let a component hold some information that isn’t used for rendering, like a DOM node or a timeout ID. Unlike with state, updating a ref does not re-render your component. Refs are an “escape hatch” from the React paradigm. They are useful when you need to work with non-React systems, such as the built-in browser APIs.

- You can store information between re-renders (unlike regular variables, which reset on every render).
- Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
- The information is local to each copy of your component (unlike the variables outside, which are shared).

```js
export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

- 用于返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数；
- `useRef` 创建的 `ref` 对象同时可以用于绑定任何可变值，通过手动给该对象的 `.current` 属性设置对应的值即可

### useMemo

A common way to optimize re-rendering performance is to skip unnecessary work. For example, you can tell React to reuse a cached calculation or to skip a re-render if the data has not changed since the previous render.

```js
function memoExample() {
  const [btn, setBtn] = React.useState(1);
  const changeBtn = React.useMemo(() => {
    return <button>btn</button>
  },[btn]);

  return (
    <>
      <div onClick={()=>setBtn(0)}>memoExample</div>
      { changeBtn }
    </>
  );
}
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 返回一个 `memoized` 值；
- 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才调用用户传入的函数重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算；
- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值；
- 第一个传入的函数必须要有返回值；
- `useMemo` 只能声明在函数式组件内部；
- `useMemo` 可以减少不必要的循环，减少不必要的渲染，减少子组件的渲染次数；

### useCallback

```js
const CallbackChildren = React.memo((props)=>{
  console.log('子组件更新')
  React.useEffect(()=>{
      props.getInfo('子组件')
  },[])
  return <div>子组件</div>
})

function CallbackParent ({ id }){
  const [number, setNumber] = React.useState(1)
  const getInfo  = React.useCallback((sonName)=>{
        console.log(sonName)
  },[id])
  return <div>
      <button onClick={ () => setNumber(number+1) } >增加</button>
      <CallbackChildren getInfo={getInfo} />
  </div>
}

const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b]
);
```

- 返回一个 `memoized` 回调函数；
- 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized` 版本，该回调函数仅在某个依赖项改变时才会更新；
- 在函数式组件中，定义在组件内的函数会随着状态值的更新而重新渲染，内部定义的函数会被频繁定义，如果传给子组件还会引起子组件的更新，使用 `useCallback` 结合 `react.memo` 可以有效减少子组件更新频率；
- `useCallback` 必须配合 `react.memo` 使用

---

## hook 调用时机

`render`阶段在`mountIndeterminateComponent`或`updateFunctionComponent`方法中会调用`renderWithHooks`再带着`renderWithHooks`的返回内容也就是函数组件JSX对应的`React-element`进入`reconcileChildren`过程，因为`renderWithHooks`会调用该 `Fuction Component` 组件的 `function`，调用过程中就会调用用户写的 `useEffect`等 `hook`：

```ts
// 【packages/react-reconciler/src/ReactFiberBeginWork.js】
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
  renderLanes = nextRenderLanes;
  currentlyRenderingFiber = workInProgress;

  // 【省略代码...】

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.lanes = NoLanes;

  // The following should have already been reset
  // currentHook = null;
  // workInProgressHook = null;

  // didScheduleRenderPhaseUpdate = false;
  // localIdCounter = 0;
  // thenableIndexCounter = 0;
  // thenableState = null;

  // TODO Warn if no hooks are used at all during mount, then some are used during update.
  // Currently we will identify the update render as a mount because memoizedState === null.
  // This is tricky because it's valid for certain types of components (e.g. React.lazy)

  // 【可以看到最终有几种不同情况的dispatcher例如HooksDispatcherOnMount、HooksDispatcherOnUpdate、HooksDispatcherOnMountWithHookTypesInDEV、HooksDispatcherOnMountInDEV】
  // 【current.memoizedState是否存在判断是首次调用hook还是非首次】
  // Using memoizedState to differentiate between mount/update only works if at least one stateful hook is used.
  // Non-stateful hooks (e.g. context) don't get added to memoizedState,
  // so memoizedState would be null during updates and mounts.
  if (__DEV__) {
    if (current !== null && current.memoizedState !== null) {
      ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV;
    } else if (hookTypesDev !== null) {
      // This dispatcher handles an edge case where a component is updating,
      // but no stateful hooks have been used.
      // We want to match the production code behavior (which will use HooksDispatcherOnMount),
      // but with the extra DEV validation to ensure hooks ordering hasn't changed.
      // This dispatcher does that.
      ReactCurrentDispatcher.current = HooksDispatcherOnMountWithHookTypesInDEV;
    } else {
      ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
    }
  } else {
    ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;
  }

  // In Strict Mode, during development, user functions are double invoked to
  // help detect side effects. The logic for how this is implemented for in
  // hook components is a bit complex so let's break it down.
  //
  // We will invoke the entire component function twice. However, during the
  // second invocation of the component, the hook state from the first
  // invocation will be reused. That means things like `useMemo` functions won't
  // run again, because the deps will match and the memoized result will
  // be reused.
  //
  // We want memoized functions to run twice, too, so account for this, user
  // functions are double invoked during the *first* invocation of the component
  // function, and are *not* double invoked during the second incovation:
  //
  // - First execution of component function: user functions are double invoked
  // - Second execution of component function (in Strict Mode, during
  //   development): user functions are not double invoked.
  //
  // This is intentional for a few reasons; most importantly, it's because of
  // how `use` works when something suspends: it reuses the promise that was
  // passed during the first attempt. This is itself a form of memoization.
  // We need to be able to memoize the reactive inputs to the `use` call using
  // a hook (i.e. `useMemo`), which means, the reactive inputs to `use` must
  // come from the same component invocation as the output.
  //
  // There are plenty of tests to ensure this behavior is correct.
  
  const shouldDoubleRenderDEV =
    __DEV__ &&
    debugRenderPhaseSideEffectsForStrictMode &&
    (workInProgress.mode & StrictLegacyMode) !== NoMode;

  shouldDoubleInvokeUserFnsInHooksDEV = shouldDoubleRenderDEV;

  // 【调用当前函数组件的function】
  let children = Component(props, secondArg);
  shouldDoubleInvokeUserFnsInHooksDEV = false;

  // Check if there was a render phase update
  if (didScheduleRenderPhaseUpdateDuringThisPass) {
    // Keep rendering until the component stabilizes (there are no more render
    // phase updates).
    children = renderWithHooksAgain(
      workInProgress,
      Component,
      props,
      secondArg,
    );
  }

  if (shouldDoubleRenderDEV) {
    // In development, components are invoked twice to help detect side effects.
    setIsStrictModeForDevtools(true);
    try {
      children = renderWithHooksAgain(
        workInProgress,
        Component,
        props,
        secondArg,
      );
    } finally {
      setIsStrictModeForDevtools(false);
    }
  }

  finishRenderingHooks(current, workInProgress);

  return children;
}
```

举例如 `useEffect` 方法，最终其实调用了 `ReactCurrentDispatcher.current` 也就是 `HooksDispatcherOnMount.useEffect` 方法：

```ts
// 【ReactCurrentDispatcher.current在renderWithHooks方法中确定，然后根据具体不同的hook调用不同的方法】
export function useEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  // 【省略代码...】
  // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.
  return ((dispatcher: any): Dispatcher);
}
```

然后对于不同的情况比如不同环境、初始化还是更新等分为好几个模块的方法去调用：

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
const HooksDispatcherOnMount = {
  readContext,

  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useInsertionEffect: mountInsertionEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useMutableSource: mountMutableSource,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
};

const HooksDispatcherOnUpdate = {
  readContext,

  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
};

const HooksDispatcherOnRerender: Dispatcher = {
  readContext,

  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: rerenderReducer,
  useRef: updateRef,
  useState: rerenderState,
  useDebugValue: updateDebugValue,
  useDeferredValue: rerenderDeferredValue,
  useTransition: rerenderTransition,
  useMutableSource: updateMutableSource,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
};
```

---

## Hook 相关的数据结构

`fiber`节点上有两个和`Hook`相关的属性：

- `memoizedState`：存储`fiber`节点对应的`Hook List`，可以理解为`hook`链表，所有`hook`用`next`连接
- `updateQueue`：存储`fiber`节点对应的变动事件，例如`state`改变引起的视图改变、`effect`实例等

```ts
// 【使用hook时生成】
export type Hook = {
  memoizedState: any,//缓存的状态值，根据不同hook不一样
  baseState: any,//最新状态
  baseQueue: Update<any, any> | null,//由于优先级被打断尚未处理的update
  queue: any,//UpdateQueue对象，存储一个update单向循环链表
  next: Hook | null,//链接的下一个hook
};

// 【调用useEffect时生成，加入Fiber的updateQueue】
export   type Effect = {
  tag: HookFlags,//effect类型-HookHasEffect/HookPassive/HookLayout
  create: () => (() => void) | void,//用户传入hook的回调函数
  destroy: (() => void) | void,//用户传入hook的return的回调函数
  deps: Array<mixed> | void | null,//用户传入hook的依赖数据
  next: Effect,//链接的下一个effect实例
};

// 【由Update组成的队列】
export type UpdateQueue<S, A> = {
  pending: Update<S, A> | null,
  lanes: Lanes,//优先级
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
};

// 【调用useState时生成】
export type Update<S, A> = {
  lane: Lane,
  action: A,
  hasEagerState: boolean,
  eagerState: S | null,
  next: Update<S, A>,
};

// 【reconcile阶段生成】
export type Fiber = {
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  tag: WorkTag,

  // Unique identifier of this child.
  key: null | string,

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  type: any,

  // The local state associated with this fiber.
  stateNode: any,

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber | null,

  // Singly Linked List Tree Structure.
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,

  refCleanup: null | (() => void),

  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any, // This type will be more specific once we overload the tag.
  memoizedProps: any, // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: mixed,

  // The state used to create the output
  memoizedState: any,

  // Dependencies (contexts, events) for this fiber, if it has any
  dependencies: Dependencies | null,

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  mode: TypeOfMode,

  // Effect
  flags: Flags,
  subtreeFlags: Flags,
  deletions: Array<Fiber> | null,

  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: Fiber | null,

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  lanes: Lanes,
  childLanes: Lanes,

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null,

  // Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only

  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
  _debugNeedsRemount?: boolean,

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null,
};
```

### fiber.memoizedState

存储的是`fiber`保存的`hooks`链表。

### fiber.updateQueue

存储的是`fiber`后续需要“触发更新”的事件，更新事件直接通过`next`链接，`useEffect`创建的`effect`实例也会存储在这个属性。

### hook.memoizedState

存储的是该`hook`对应的状态值，不同类型 `hook` 的 `memoizedState` 保存不同类型数据，具体如下：

- `useState`：对于`const [state, updateState] = useState(initialState)`，`memoizedState` 保存 `state` 的值。
- `useEffect`：对于`useEffect(()=>{...})`，`memoizedState` 保存包含 `useEffect` 回调函数、依赖项等的链表数据结构 `effect`。`effect` 链表同时会保存在 `fiber.updateQueue` 中。
- `useRef`：对于 `useRef(1)`，`memoizedState`保存一个对象包含一个`current`属性`{current: 1}`。
- `useMemo`：对于 `useMemo(callback, [depA])`，`memoizedState` 保存 `[callback返回结果, depA]`。
- `useCallback`：对于 `useCallback(callback, [depA])`，`memoizedState` 保存 `[callback, depA]`。与 `useMemo` 的区别是，`useCallback` 保存的是`callback` 函数本身，而 `useMemo` 保存的是 `callback` 函数的执行结果。

---

## Hook 通用方法

每一个`hook`在`mount`和`rerender`过程中都会经历两个方法，`mountWorkInProgressHook`和`updateWorkInProgressHook`，前者用于创建`hook`，后者用于找到对应`hook`。

### mountWorkInProgressHook

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
function mountWorkInProgressHook(): Hook {
  // memoizedState： useState中 保存 state 信息 ｜ useEffect 中 保存着 effect 对象 ｜ useMemo 中 保存的是缓存的值和 deps ｜ useRef 中保存的是 ref 对象。
  // baseState ： usestate和useReducer中，一次更新中 ，产生的最新state值。
  // baseQueue : usestate和useReducer中 保存最新的更新队列。
  // queue ： 保存待更新队列 pendingQueue ，更新函数 dispatch 等信息。
  // next: 指向下一个 hooks对象。
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  // 【hook用next链接起来】
  if (workInProgressHook === null) {
    // 【当前这个hook是首个hook对象】
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 【当前hook链接到之前的hook list上】
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

### updateWorkInProgressHook

```ts
// 【packages/react-reconciler/src/ReactFiberHooks.js】
// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let currentHook: Hook | null = null;
let workInProgressHook: Hook | null = null;
// The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.
let currentlyRenderingFiber: Fiber = (null: any);

function updateWorkInProgressHook(): Hook {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base.
  // 【current hook list】
  // 【workInProgress hook list】

  // 【currentHook为null去current fiber上找第一个hook就是currentHook，并赋给nextCurrentHook，说明当前这个hook是第一个】
  // 【currentHook存在，直接取currentHook的next为nextCurrentHook，说明当前要处理的这个hook并非第一个】
  let nextCurrentHook: null | Hook;
  if (currentHook === null) {
    // 【第一个hook】
    // 【获取workInProgressFiber对应的currentFiber】
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  // 【workInProgressHook为null去workInProgress fiber上找第一个hook就是workInProgressHook，并赋给nextWorkInProgressHook】
  // 【workInProgressHook存在，直接取workInProgressHook的next为nextWorkInProgressHook】
  let nextWorkInProgressHook: null | Hook;
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  // 【分支1：复用上一次执行函数组件的hook】
  if (nextWorkInProgressHook !== null) {
    // 【执行了多次函数组件的情况，nextWorkInProgressHook复用上一次执行的hook】
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;

    currentHook = nextCurrentHook;
  } else {
    // 【分支2：复用对应currentFiber的hook】
    // Clone from the current hook.
    // 【报错的情况】
    if (nextCurrentHook === null) {
      const currentFiber = currentlyRenderingFiber.alternate;
      if (currentFiber === null) {
        // This is the initial render. This branch is reached when the component
        // suspends, resumes, then renders an additional hook.
        // Should never be reached because we should switch to the mount dispatcher first.
        throw new Error(
          'Update hook called on initial render. This is likely a bug in React. Please file an issue.',
        );
      } else {
        // This is an update. We should always have a current hook.
        throw new Error('Rendered more hooks than during the previous render.');
      }
    }

    currentHook = nextCurrentHook;
    // 【复用current fiber上的hook】
    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,

      next: null,
    };


    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  // 【返回当前需要处理的hook】
  return workInProgressHook;
}
```

## 自定义Hook

```js
// useCounter.js
import { useState } from 'react';

function useCounter(initialValue, step) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(count + step);
  };

  const decrement = () => {
    setCount(count - step);
  };

  return { count, increment, decrement };
}

export default useCounter;
```

```js
// MyComponent.js
import React from 'react';
import useCounter from './useCounter';

function MyComponent() {
  // 使用自定义 Hook
  const { count, increment, decrement } = useCounter(0, 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default MyComponent;
```

## 参考资料

[Built-in React Hooks](https://react.dev/reference/react/hooks)
