# Web Workers

`Web Workers API` 使得在一个独立于 Web 应用程序主执行线程的后台线程中运行脚本操作成为可能。这样做的好处是可以在独立线程中执行费时的处理任务，使主线程的运行不会被阻塞/放慢。`Web Workers API` 被设计用于执行不需要直接访问用户界面的任务，比如数据处理、图像操作或计算。`Web Workers API` 被设计为在沙盒环境中运行，独立于主线程运行，这意味着它们对系统资源的访问有限，无法访问某些 API，比如 `localStorage` 或 `sessionStorage`。不过，它们可以通过消息传递系统与主线程进行通信，从而在两个线程之间交换数据。

`Web Worker`的分类有如下几种：

- `Dedicated Worker` 是由单个脚本使用的 `worker`。该上下文由 `DedicatedWorkerGlobalScope` 对象表示。

```js
const worker = new Worker("task.js")
```

- `Shared worker` 是可以由在不同窗口、Iframe 等中运行的多个脚本使用的 `worker`，只要它们与 `worker` 在同一域中。它们比专用的 `worker` 稍微复杂一点——脚本必须通过活动端口进行通信。

```js
const sharedWorker = new SharedWorker("shared.js")
```

- `Service Worker` 基本上是作为代理服务器，位于 web 应用程序、浏览器和网络（如果可用）之间。它们的目的是（除开其他方面）创建有效的离线体验、拦截网络请求，以及根据网络是否可用采取合适的行动并更新驻留在服务器上的资源。它们还将允许访问推送通知和后台同步 API。

```js
navigator.serviceWorker.register("sw.js")
```

`worker` 在一个与当前 `window` 不同的全局上下文中运行。在 `worker` 的上下文中，全局对象是 `WorkerGlobalScope`，你可以通过 `self` 或者直接调用全局对象的方法来访问。虽然 `window` 不能直接用于 `worker`，但许多相同的方法被定义在一个共享的混入（`WindowOrWorkerGlobalScope`）中，并通过 `worker` 自己的 `WorkerGlobalScope` 衍生的上下文提供给它们：

`WorkerGlobalScope` 是所有 `worker` 类型（`DedicatedWorker`、`SharedWorker`、`ServiceWorker`）的基类接口，具体实现为：

- `DedicatedWorkerGlobalScope` - 专用 worker 的全局作用域
- `SharedWorkerGlobalScope` - Shared worker 的全局作用域
- `ServiceWorkerGlobalScope` - Service Worker 的全局作用域

1. `WorkerGlobalScope` 与 `window` 的区别

- 没有 DOM 访问权限：worker 不能直接操作 DOM
- 没有 document 对象
- 地理位置不同：window.location 对应 self.location
- 全局 this 指向不同：在 worker 中 this 指向 WorkerGlobalScope 实例

2. `WorkerGlobalScope` 可用 API

```js
// 定时器
self.setTimeout()
self.setInterval()
self.clearTimeout()
self.clearInterval()

// 网络请求
self.fetch()

// 存储
self.indexedDB
self.caches // 仅限 Service Worker

// 其他
self.console
self.performance
self.atob() / self.btoa()
self.URL
```

## Worker

`Worker` 接口是 `Web Workers API` 的一部分，指的是一种可由脚本创建的后台任务，任务执行中可以向其创建者收发信息。要创建一个 `Worker`，只须调用 `Worker(URL)` 构造函数，函数参数 URL 为指定的脚本。并且 `Worker` 对象继承自 `EventTarget` 对象，因此可以对 `Worker` 对象调用 `addEventListener()` 方法。

![browser](../../assets/Worker.png)

- 适用于将耗时的计算任务从主线程分离出去，避免阻塞 UI 渲染
- 每个 `Worker` 是独立的，不能与其他 `Worker` 共享状态
- 主线程和 `Worker` 通过消息传递（`postMessage` 和 `onmessage`）进行通信

使用场景：复杂的计算任务，如数据处理、图像处理、大量的 DOM 操作等

```js
const worker = new Worker("worker.js")
```

### Worker 的实例方法

- `postMessage()`
- `terminate()`

### Worker 使用案例

```js
// worker.js

// 监听主线程的消息
self.onmessage = function (event) {
  const number = event.data // 获取传递过来的数据
  const result = fibonacci(number) // 计算斐波那契数
  postMessage(result) // 将结果发送回主线程
}

// 斐波那契数列计算函数
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Worker Example</title>
  </head>
  <body>
    <h1>Web Worker Example</h1>
    <p>Enter a number to calculate the Fibonacci number:</p>
    <input type="number" id="numberInput" />
    <button onclick="calculateFibonacci()">Calculate</button>

    <h3>Result:</h3>
    <p id="result"></p>

    <script>
      let worker

      // 初始化 Worker
      if (window.Worker) {
        worker = new Worker("worker.js")

        // 监听 Worker 的消息
        worker.onmessage = function (event) {
          document.getElementById("result").textContent = event.data
        }
      } else {
        console.log("Your browser does not support Web Workers.")
      }

      // 发送任务给 Worker 进行计算
      function calculateFibonacci() {
        const number = document.getElementById("numberInput").value
        if (worker) {
          worker.postMessage(number) // 向 worker 发送消息
        }
      }
    </script>
  </body>
</html>
```

## ServiceWorker

`ServiceWorker` 接口提供了对 `service worker` 的引用。各个浏览上下文（例如页面、worker 等）可以与相同的 `service worker` 相关联，每个浏览上下文都可以通过唯一的 `ServiceWorker` 对象访问。

![browser](../../assets/ServiceWorker.png)

- 专门用于处理网络请求和资源缓存
- 独立于主线程，生命周期比网页长，可以在页面关闭后继续运行
- 主要用于离线支持、推送通知、后台同步等
- 不直接与 DOM 交互，通常用于拦截和缓存 HTTP 请求

使用场景:

- 离线网页访问（PWA，渐进式 Web 应用程序）
- 缓存管理（资源请求缓存，提升加载性能）
- 后台同步、推送通知

```js
// 注册 Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope)
    })
    .catch((error) => {
      console.log("Service Worker registration failed:", error)
    })
}

// 在 service-worker.js 中
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.")
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
```

### ServiceWorker 的实例属性

- `scriptURL`
- `state`

### ServiceWorker 的实例方法

- `postMessage()`

## SharedWorker

`SharedWorker` 接口代表一种特定类型的 `worker`，可以从几个浏览上下文中访问，例如几个窗口、iframe 或其他 worker。它们实现一个不同于普通 `worker` 的接口，具有不同的全局作用域 `SharedWorkerGlobalScope` 。

- 允许多个浏览器上下文（如多个标签页、iframe）共享同一个 Worker 实例
- 适合需要跨多个页面共享状态或数据的情况
- 和 Worker 一样，使用消息传递进行通信

使用场景:需要在多个页面之间共享数据或状态的应用场景，例如聊天应用中的实时连接管理，跨标签页的数据同步

![browser](../../assets/SharedWorker.png)

```js
// 在多个页面中创建并共享 SharedWorker
const sharedWorker = new SharedWorker("shared-worker.js")

// 与 SharedWorker 通信
sharedWorker.port.postMessage("Hello, Shared Worker!")

sharedWorker.port.onmessage = function (event) {
  console.log("Message from Shared Worker:", event.data)
}

// 在 shared-worker.js 中
self.onconnect = function (event) {
  const port = event.ports[0]
  port.onmessage = function (event) {
    console.log("Message from main thread:", event.data)
    port.postMessage("Hello, Main thread!")
  }
}
```

### SharedWorker 的实例属性

- `port`

## 参考资料

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

[Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)

[ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker)

[SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)

[Exploring The Potential Of Web Workers For Multithreading On The Web](https://www.smashingmagazine.com/2023/04/potential-web-workers-multithreading-web/)

[What is Web Worker?🧐 Which type of Worker to use?](https://medium.com/@amey0x/what-is-web-worker-which-type-of-worker-to-use-4026de8b3cfa)

[Multithreading in JavaScript with Web Workers](https://www.honeybadger.io/blog/javascript-web-workers-multithreading/)
