## React Hooks

### Hook使用的注意事项
1. Hook不能在class组件中使用
2. 只能在函数最外层调用Hook，不要在循环、条件判断或者子函数中使用
3. 只能在函数组件中调用Hook，不要在其他JavaScript函数中调用

### useState
```js
// initialState: 状态初始值
// init: 状态初始化函数
const [state, setState] = useState(initialState);

let init = () => {
  const initialState = someExpensiveComputation(props);
  return initialState;
}
const [state, setState] = useState(init);
```
- `useState` 返回一个 `state`，以及更新 `state` 的函数；
- 在**初始渲染**期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同；
- `initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 `state` 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 `state`，此函数只在初始渲染时被调用；
- 在后续的**重新渲染**中，`useState` 返回的第一个值将始终是更新后最新的 `state`；
- `setState` 函数用于更新 `state`，它接收一个新的 `state` 值并将组件的一次**重新渲染**加入队列；
- 如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 `state`，并返回一个更新后的值；

### useReducer
```js
// reducer: 处理状态更新的reducer
// initialArg: 状态初始值
// init: 状态初始化函数
const [state, dispatch] = useReducer(reducer, initialArg, init);

const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
);
```
- `useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法；
- 可以选择惰性地创建初始 `state`。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`；
- 如果 `Reducer Hook` 的返回值与当前 `state` 相同，`React` 将跳过子组件的渲染及副作用的执行，`React` 使用 `Object.is` 比较算法 来比较 `state`；

### useContext
```js
const ThemeContext = React.createContext(themes);
const theme = useContext(ThemeContext);
```
- 接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中**距离当前组件最近**的 `<MyContext.Provider>` 的 `value prop` 决定；
- `useContext` 的参数必须是 `context` 对象本身

### useRef

### useEffect
```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  };
});
```
- 该 `Hook` 接收一个包含命令式、且可能有副作用代码的函数；
- 使用 `useEffect` 完成副作用操作，值给 `useEffect` 的函数会在组件渲染到屏幕之后执行；
- 默认情况下，`effect` 将在每轮渲染结束后执行，但你可以选择让它 在只有某些值改变的时候 才执行；
- 组件卸载时需要清除 `effect` 创建的诸如订阅或计时器 ID 等资源，要实现这一点，`useEffect` 函数需返回一个清除函数；

### useMemo
```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
- 返回一个 `memoized` 值；
- 把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算；
- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值；
- 第一个传入的函数必须要有返回值
- `useMemo`只能声明在函数式组件内部

### useCallback
```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b]
);
```
- 返回一个 `memoized` 回调函数；
- 把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized` 版本，该回调函数仅在某个依赖项改变时才会更新；
- 在函数式组件中，定义在组件内的函数会随着状态值的更新而重新渲染，内部定义的函数会被频繁定义，如果传给子组件还会引起子组件的更新，使用useCallback结合memo可以有效减少子组件更新频率；