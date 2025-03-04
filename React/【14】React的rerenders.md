# React 中的 rerender 优化

<!-- TODO -->

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

## memo

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

## 提取组件

在用例中和 `color` 有关的其实只有，所以可以将这部分内容单独提取为一个`Form`组件：

```html
<input value={color} onChange={(e) => setColor(e.target.value)} />
<p style="{{" color }}>Hello, world!</p>
```

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

## 将子组件当做 props 传入

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

如果用例中的 color 用在外层组件上，那之前的方法就不成立的，这个时候考虑把无关的`ExpensiveTree`子组件当做 `props` 传入：

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

## 源码角度分析

根据前文我们知道在`beginWork`阶段有个`bailoutOnAlreadyFinishedWork`方法，就是用于在`props`等没有变化时提前用之前的节点从而避免`rerender`。

那我们就来看一下走`bailoutOnAlreadyFinishedWork`这个分支的前提条件：

1. `current!==null`旧节点存在；
2. `oldProps === newProps` && `hasContextChanged() == false` && `workInProgress.type === current.type`新旧节点的类型`type`和`props`没有改变且上下文没有更新;
3. `checkScheduledUpdateOrContext()`未检测到当前节点上有 `Update` 任务；
4. `(workInProgress.flags & DidCapture) === NoFlags`当前节点没有捕获错误；

以上条件都符合的情况下那就可以走入`bailoutOnAlreadyFinishedWork`这个分支复用已有节点不需要 rerender 了。

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

所以在前面的案例中，后面两种优化方式都是将与变化的部分隔离开，因此优化前 `ExpensiveTree` 组件对应的`oldProps`和`newProps`虽然都是一个空对象，但是并不是同一个对象，所以无法进入`bailoutOnAlreadyFinishedWork`分支，而优化之后，要么`ExpensiveTree`组件和`Form`组件隔离开，要么`ExpensiveTree`组件被`Fragment`组件包裹，使得`Fragment`组件没有变化所以进入`bailoutOnAlreadyFinishedWork`分支从而不需要 rerender。

至于 `memo` 这个 API 是如何做到减少 rerender 的可以参考后文`《useMemo&useCallback》`。

## 参考资料

[One simple trick to optimize React re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)

[Before You memo()](https://overreacted.io/before-you-memo/)

[How React Compiler Performs on Real Code](https://www.developerway.com/posts/how-react-compiler-performs-on-real-code)
