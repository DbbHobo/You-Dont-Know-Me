# React 中的 rerender 优化

测试用例如下，每次`color`的改变都会引起`ExpensiveTree`子组件的`rerender`：

```js
import { useState } from "react"

function ExpensiveTree() {
  let now = performance.now()
  console.log("🥒 --- App.js:5 --- ExpensiveTree --- now:", now)
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>
}
export default function App() {
  let [color, setColor] = useState("red")

  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </div>
  )
}
```

## React 减少 rerender

### memo

```js
import { useState, memo } from "react"

const ExpensiveTree = memo(() => {
  let now = performance.now()
  console.log("🥒 --- App.js:5 --- ExpensiveTree --- now:", now)

  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>
})

export default function App() {
  let [color, setColor] = useState("red")
  return (
    <div>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </div>
  )
}
```

### 提取组件

在用例中和 `color` 有关的其实只有 `input` 和 `p` 元素，所以可以将这部分内容单独提取为一个`Form`组件：

```js
import { useState, memo } from "react"

const ExpensiveTree = memo(() => {
  let now = performance.now()
  console.log("🥒 --- App.js:5 --- ExpensiveTree --- now:", now)

  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>
})

// color相关内容提取到Form组件中
function Form() {
  let [color, setColor] = useState("red")
  return (
    <>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
    </>
  )
}

export default function App() {
  return (
    <>
      <Form />
      <ExpensiveTree />
    </>
  )
}
```

### 将子组件当做 props 传入

```js
export default function App() {
  let [color, setColor] = useState("red")
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p>Hello, world!</p>
      <ExpensiveTree />
    </div>
  )
}
```

如果用例中的 `color` 用在外层组件上，那之前的方法就不成立的，这个时候考虑把无关的 `ExpensiveTree` 子组件当做 `props` 传入：

```js
import { useState } from "react"

const ExpensiveTree = () => {
  let now = performance.now()
  console.log("🥒 --- App.js:5 --- ExpensiveTree --- now:", now)

  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>
}

function ColorPicker({ children }) {
  let [color, setColor] = useState("red")
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  )
}
```

### 源码角度分析

根据前文我们知道在`beginWork`阶段有个`bailoutOnAlreadyFinishedWork`方法，就是用于在`props`等没有变化时提前复用之前的节点从而避免`rerender`。

那我们就来看一下走`bailoutOnAlreadyFinishedWork`这个分支的前提条件：

1. `current!==null` 旧节点存在；
2. `oldProps === newProps` && `hasContextChanged() == false` && `workInProgress.type === current.type` 新旧节点的类型`type`和`props`没有改变且上下文没有更新;
3. `checkScheduledUpdateOrContext()` 未检测到当前节点上有 `Update` 任务；
4. `(workInProgress.flags & DidCapture) === NoFlags`当前节点没有捕获错误；

以上条件都符合的情况下那就可以走入`bailoutOnAlreadyFinishedWork`这个分支复用已有节点不需要`rerender`了。

```ts
function beginWork(current, workInProgress, renderLanes) {
  // 【...】

  if (current !== null) {
    var oldProps = current.memoizedProps
    var newProps = workInProgress.pendingProps

    if (
      oldProps !== newProps ||
      hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
      workInProgress.type !== current.type
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true
    } else {
      // Neither props nor legacy context changes. Check if there's a pending
      // update or context change.
      var hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
        current,
        renderLanes
      )

      if (
        !hasScheduledUpdateOrContext && // If this is the second pass of an error or suspense boundary, there
        // may not be work scheduled on `current`, so we check for this flag.
        (workInProgress.flags & DidCapture) === NoFlags
      ) {
        // No pending updates or context. Bail out now.
        didReceiveUpdate = false
        return attemptEarlyBailoutIfNoScheduledUpdate(
          current,
          workInProgress,
          renderLanes
        )
      }

      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false
      }
    }
  } else {
    didReceiveUpdate = false

    // 【...】
  } // Before entering the begin phase, clear pending update priority.
  // TODO: This assumes that we're about to evaluate the component and process
  // the update queue. However, there's an exception: SimpleMemoComponent
  // sometimes bails out later in the begin phase. This indicates that we should
  // move this assignment out of the common path and into each branch.

  workInProgress.lanes = NoLanes

  switch (
    workInProgress.tag
    // 【...】
  ) {
  }

  // 【...】
}

function checkScheduledUpdateOrContext(current, renderLanes) {
  // Before performing an early bailout, we must check if there are pending
  // updates or context.
  var updateLanes = current.lanes

  if (includesSomeLane(updateLanes, renderLanes)) {
    return true
  } // No pending update, but because context is propagated lazily, we need

  return false
}

function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (current !== null) {
    // Reuse previous dependencies
    workInProgress.dependencies = current.dependencies
  }

  {
    // Don't update "base" render times for bailouts.
    stopProfilerTimerIfRunning()
  }

  markSkippedUpdateLanes(workInProgress.lanes) // Check if the children have any pending work.

  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // The children don't have any work either. We can skip them.
    // TODO: Once we add back resuming, we should check if the children are
    // a work-in-progress set. If so, we need to transfer their effects.
    {
      return null
    }
  } // This fiber doesn't have work, but its subtree does. Clone the child
  // fibers and continue.

  cloneChildFibers(current, workInProgress)
  return workInProgress.child
}
```

所以在前面的案例中，后面两种优化方式都是将与变化的部分隔离开，因此优化前 `ExpensiveTree` 组件对应的`oldProps`和`newProps`虽然都是一个空对象，但是并不是同一个对象，所以无法进入`bailoutOnAlreadyFinishedWork`分支，而优化之后，要么`ExpensiveTree`组件和`Form`组件隔离开，要么`ExpensiveTree`组件被`Fragment`组件包裹，使得`Fragment`组件没有变化所以进入`bailoutOnAlreadyFinishedWork`分支从而不需要`rerender`。

至于 `memo` 这个 API 是如何做到减少 `rerender` 的可以参考前文 `《useMemo&useCallback》`。

## React 中的闭包内存泄露

React 存在一个隐蔽的闭包问题，举例如下：

`handleClickA`/`handleClickB`/`handleClickBoth` 三个函数都对 App 内的数据形成引用进而形成了闭包，其中`handleClickA`/`handleClickB`使用了 `useCallback` 进行优化减少 `rerender`，将函数缓存在了 `fiber` 上，一旦多次调用会出现一个问题，那就是 `bigData` 这个数据较大，即使`handleClickA`/`handleClickB`未直接对其引用，但是由于闭包的特殊性能访问 App 这个 `scope` 作用域，在多次调用之后会形成多个对 App 这个 `scope` 作用域的引用，而这个作用域中有一个非常大的数据 `bigData`，就可能会导致内存爆炸。

```js
class BigObject {
  data = new Uint8Array(1024 * 1024 * 10)
}

function App() {
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)
  const bigData = new BigObject() // 10MB of data

  const handleClickA = useCallback(() => {
    setCountA(countA + 1)
  }, [countA])

  const handleClickB = useCallback(() => {
    setCountB(countB + 1)
  }, [countB])

  // This only exists to demonstrate the problem
  const handleClickBoth = () => {
    handleClickA()
    handleClickB()
    console.log(bigData.data.length)
  }

  return (
    <div>
      <button onClick={handleClickA}>Increment A</button>
      <button onClick={handleClickB}>Increment B</button>
      <button onClick={handleClickBoth}>Increment Both</button>
      <p>
        A: {countA}, B: {countB}
      </p>
    </div>
  )
}
```

![closure](./assets/bigobject-leak-useCallback.png)

### 保持闭包作用域最小化

JavaScript 难以直观展示闭包捕获的所有变量。控制变量捕获数量的最佳方式是缩小闭包的函数作用域，具体做法包括：

- 编写小型组件：这会减少创建新闭包时作用域中的变量数量
- 使用自定义 Hook：此时回调函数只能捕获 Hook 函数的局部作用域（通常仅包含函数参数）

### 避免捕获其他闭包（尤其是被记忆的闭包）

虽然这看似显而易见，但 React 中很容易掉入这个陷阱。当编写相互调用的小型函数时，一旦使用第一个 `useCallback`，组件作用域内所有被调用函数都会产生连锁记忆化反应。

### 避免不必要的记忆

`useCallback` 和 `useMemo` 是防止无效渲染的优秀工具，但需付出代价。建议仅在发现渲染导致性能问题时使用。

### 对大的对象使用 useRef

这需要手动管理对象的生命周期并正确清理。虽非最优方案，但优于内存泄漏问题。

## 参考资料

[One simple trick to optimize React re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)

[Before You memo()](https://overreacted.io/before-you-memo/)

[How React Compiler Performs on Real Code](https://www.developerway.com/posts/how-react-compiler-performs-on-real-code)

[Sneaky React Memory Leaks: How `useCallback` and closures can bite you](https://www.schiener.io/2024-03-03/react-closures)

[How I Have Mastered Closures in React 🚀](https://medium.com/@techsuneel99/how-i-have-mastered-closures-in-react-a6b121095a92)

[Fantastic closures and how to find them in React](https://www.developerway.com/posts/fantastic-closures)
