# React 简介

One of the core innovations of React was that they made the View a function of your application’s State.

**v = f(s)** <=> **view = function(state)**

Props are to components what arguments are to functions.

目前看的源码基于`18.2.0`版本：

```text
react-main
├── fixtures        # 测试项目
├── scripts         # 各种工具链的脚本，比如git、jest、eslint等
├── pacakages       # 核心代码
    ├── react                  # 核心API等，React Hooks等
    ├── react-dom              # DOM和服务器端SSR渲染方法入口
    ├── react-reconciler       # 协调器Reconciler的实现
    ├── scheduler              # 调度器Scheduler的实现
    ├── shared                 # 公共方法等
```

## react

`React` 的核心，包含所有全局 `React API` 如：

- `React.createElement`
- `React.Component`
- `React.Children`
- `Hooks`

这些 API 是全平台通用的，它不包含`ReactDOM`、`ReactNative`等平台特定的代码，在 `npm` 上作为单独的一个包发布。

## react-dom

`DOM` 、 `SSR` 渲染等方法的入口：

- `react-dom` # 注意这同时是 DOM 和 SSR 的入口

## react-reconciler

协调器，实现了 `render` 、`commit` 两个过程

- `react-reconciler` # 协调器的实现，你可以用它构建自己的 Renderer

## scheduler

`Scheduler` 调度器的实现。

- `scheduler` # 调度器的实现

## shared

其他模块公用的方法和全局变量等，比如在`shared/ReactSymbols.js`中保存`React`不同组件类型的定义：

```js
// ...
export const REACT_ELEMENT_TYPE: symbol = Symbol.for("react.element")
export const REACT_PORTAL_TYPE: symbol = Symbol.for("react.portal")
export const REACT_FRAGMENT_TYPE: symbol = Symbol.for("react.fragment")
export const REACT_STRICT_MODE_TYPE: symbol = Symbol.for("react.strict_mode")
export const REACT_PROFILER_TYPE: symbol = Symbol.for("react.profiler")
export const REACT_PROVIDER_TYPE: symbol = Symbol.for("react.provider")
export const REACT_CONTEXT_TYPE: symbol = Symbol.for("react.context")
// ...
```

## 试验性包的文件夹

`React`将自己流程中的一部分抽离出来，形成可以独立使用的包，由于他们是试验性质的，所以不被建议在生产环境使用。包括如下内容等：

- `react-server` # 创建自定义 SSR 流
- `react-client` # 创建自定义的流
- `react-fetch` # 用于数据请求
- `react-interactions` # 用于测试交互相关的内部特性，比如 React 的事件模型

## 其他

- `react-art` # canvas、svg 等内容的渲染
- `react-native-renderer` # native 入口
- `react-noop-renderer` # 用于 debug fiber

## React 渲染流程概览

`React` 是通过 `jsx` 描述页面结构的，经过 `babel` 等的编译会变成 `render function`，`render function` 执行结果就是 `React Element` 的实例。`React` 会把 `React Element` 转换成 `fiber`，然后再渲染。

当前屏幕上显示内容对应的 `Fiber` 树称为 `current Fiber` 树，正在内存中构建的 `Fiber` 树称为 `workInProgress Fiber` 树。`React` 应用的根节点通过使 `current` 指针在不同 `Fiber` 树的 `rootFiber` 间切换来完成 `current Fiber` 树指向的切换。

首次执行 `ReactDOM.render` 会创建 `fiberRoot` 和 `rootFiber`。其中 `fiberRoot` 是整个应用的根节点，`rootFiber` 是 `current Fiber` 或 `workInProgress Fiber` 所在组件树的根节点。

整体渲染流程分成了四个大的阶段：

1. **`trigger`** 阶段：无论是首次渲染还是 rerender 过程，在这个阶段进行任务的触发`scheduleUpdateOnFiber`，当任务安排完成就会调用`scheduleCallback()`/`scheduleSyncCallback`进入下一个阶段调度阶段；

2. **`scheduler`** 阶段：调度阶段，不同任务的优先级不同，`workLoop`会遍历所有任务并执行；

3. **`render`** 阶段：从 `React Element` 转换成 `fiber`，并且对需要操作的节点打上 `flags` 的标记，这个过程是可以打断的，最后形成完整的 `fiber tree`；

4. **`commit`** 阶段：对有 `flags` 标记的 `fiber` 节点进行 `DOM` 操作，并执行所有的 `effect` 副作用函数，这个过程是不能打断的；

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child),
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)

  return dom
}

const isEvent = (key) => key.startsWith("on")
const isProperty = (key) => key !== "children" && !isEvent(key)
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach((action) => {
    hook.state = action(hook.state)
  })

  const setState = (action) => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (index < elements.length || oldFiber != null) {
    const element = elements[index]
    let newFiber = null

    const sameType = oldFiber && element && element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

const Didact = {
  createElement,
  render,
  useState,
}

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1)
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>
}
const element = <Counter />
const container = document.getElementById("root")
Didact.render(element, container)
```

## 关键词

- `fiberRootNode`：全局唯一根节点
- `rootFiber`：`fiber`树的根节点
- `fiberNode`：用来表示 `React-Element` 的数据结构
- `Reconciler`：协调器，构建 `fiber` 数据结构相关，根据最新状态构建新的 `fiber` 树，与之前的 `fiber` 树进行 `diff` 对比，对 `fiber` 节点标记不同的副作用
- `Scheduler`：调度器，用来调度任务执行顺序，让浏览器的每一帧优先执行高优先级的任务
- `effect`：渲染、更新过程中的副作用

## 拉取源码

```bash
# 全量拉取
git clone https://github.com/facebook/react.git

# 只拉最新一次 commit，不关心历史
git clone --depth=1 https://github.com/facebook/react.git

# 后续如果真需要历史
git fetch --unshallow

# 看任意版本
git fetch --depth=1 origin v18.2.0
git checkout v18.2.0

git fetch --depth=1 origin v17.0.2
git checkout v17.0.2
```

## 直接用 React 源码中的示例调试

```bash
# 运行fixtures应用
cd fixtures
cd fiber-debugger  # 或其他fixture目录

# 安装依赖并启动
yarn install
yarn start
```

## 创建 React 项目中调试本地源码（link）

1. 首先 `clone` 最新版本的 `React` 项目并构建

```bash
git clone https://github.com/facebook/react.git

cd react
# 下载依赖
yarn install
# build
yarn build react/index,react/jsx,react/compiler-runtime,react-dom/index,react-dom/client,scheduler --type=NODE
```

其中`build`过程中可能会有报错，尤其是在`scripts/rollup/build.js`中打开`sourcemap`，如果报错的话寻找`getPlugins`方法，这个方法中的某些插件会影响`sourcemap`的生成，把影响的几个插件注释掉即可。

2. 使用 `create-react-app` 去创建一个新的 `React` 项目

```bash
npx create-react-app your-project-name
# 下载依赖
yarn install
```

3. 移除原项目中的 `React` 和 `React-DOM` 包

```bash
cd your-project-name
# 移除原有的react包
npm remove react react-dom
```

4. 把打包好的 `React` 和 `React-DOM` 链接到全局

```bash
# build好的react链接到全局
cd path/to/react/build/node_modules/react
yarn link

# build好的react-dom链接到全局
cd path/to/react/build/node_modules/react-dom
yarn link

# 把全局中的react和react-dom链接到项目中来
cd path/to/your-project-name
yarn link react react-dom
```

## 创建 React 项目中调试本地源码（script引入，直接调试build前的源码）

1. 首先 `clone` 源码 `React` 项目并构建

```bash
# 以18.3.1版本源码为例
git clone https://github.com/facebook/react.git

cd react
# 下载依赖
yarn install
# build
# UMD打包的是ESM版本的源码就可以直接为我们在浏览器中所用
yarn build react/index,react-dom/index,scheduler --type=UMD
```

其中 `build` 过程中可能会有报错，尤其是在 `build.js` 中打开了 `sourcemap`，如果报错的话寻找 `getPlugins` 方法，这个方法中的某些插件会影响 `sourcemap` 的生成，把影响的几个插件注释掉即可。

2. 使用 `create-react-app` 去创建一个新的 `React` 项目

```bash
npx create-react-app react-debug
# 下载依赖
yarn install
```

```html
<!-- 在项目index.html中引入自己手动build的开启了sourcemap的源码 -->
<script src="./react.development.js"></script>
<script src="./react-dom.development.js"></script>
```

3. 解决项目报错，修改`webpack`配置

`npm run eject` 是 `Create React App (CRA)` 中的一个命令，它会将项目的配置从 `CRA` 的封装中"弹出"，让开发者获得对构建配置（如 `Webpack`、`Babel` 等）的完全控制权。

```zsh
# 先接管webpack配置，单向操作，一旦执行，无法撤销
npm run eject
```

```js
// 添加externals配置，这样webpack就不会打包npm下载的react/react-dom包了
// 这样 Webpack 看到 import React from 'react' 时，就会直接去引用 window.React，也就是我们script引入的代码
externals: {
  react: "React",
  "react-dom": "ReactDOM",
  // 针对 React 18 的 client 引用
  "react-dom/client": "ReactDOM",
  // 关键：防止 Webpack 去打包 node_modules 里的 runtime
  "react/jsx-dev-runtime": "React",
  "react/jsx-runtime": "React",
}
```

```js
// 解决babel报错需要修改这个runtime配置，runtime 改回 classic，这样它会使用 React.createElement
// runtime: hasJsxRuntime ? "automatic" : "classic"  => runtime: "classic",
presets: [
  [
    require.resolve("babel-preset-react-app"),
    {
      runtime: "classic",
    },
  ],
]
```

4. 解决所有报错之后，在 `Chrome` 中调试的就是非build后的 `React` 源码了

## React 版本更新

[React v19](https://react.dev/blog/2024/12/05/react-19?ck_subscriber_id=2869254244&utm_source=convertkit&utm_medium=email&utm_campaign=%E2%9A%9B%EF%B8%8F%20This%20Week%20In%20React%20#whats-new-in-react-19)

## 总结

![react](./assets/react_flow.png)

## 参考资料

[build-your-own-react](https://pomb.us/build-your-own-react/)

[React 技术揭秘](https://react.iamkasong.com/preparation/file.html#%E9%A1%B6%E5%B1%82%E7%9B%AE%E5%BD%95)

[React 应用的宏观包结构(web 开发)](https://7km.top/main/macro-structure#%E5%AE%8F%E8%A7%82%E6%80%BB%E8%A7%88)

[A look inside React Fiber](https://makersden.io/blog/look-inside-fiber)

[React-Fiber-Architecture](https://github.com/SaeedMalikx/React-Fiber-Architecture)

[How to Contribute](https://legacy.reactjs.org/docs/how-to-contribute.html)

[overreacted by Dan Abramov](https://overreacted.io/)

[The State of React and the Community in 2025](https://blog.isquaredsoftware.com/2025/06/react-community-2025/)

[A visual exploration of core React concepts](https://react.gg/visualized)

[The History of React Through Code](https://playfulprogramming.com/posts/react-history-through-code)

[React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)

[Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs)
