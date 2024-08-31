# Web APIs

客户端JavaScript，特别是在浏览器端的 JavaScript，有许多可用的 API —— 这些 API 不是 JavaScript 语言本身的一部分，而是构建在核心 JavaScript 语言之上的，为你的 JavaScript 代码提供额外的强大功能。

- 图形和媒体 API：图形 API（如 Canvas 和 WebGL）允许渲染 2D 和 3D 图形。媒体 API 使得播放和操作音频和视频内容成为可能，例如 HTMLMediaElement 接口和 Web Audio API。

- 通信 API：促进 Web 应用程序不同部分之间或应用程序之间的通信。例如 WebSockets 和 Fetch API。

- 设备 API：提供对用户设备功能的访问，如相机、麦克风、GPS。示例包括 Geolocation API、Media Capture and Streams API 和 Battery Status API。

- 存储 API：允许 Web 应用程序在用户设备上本地存储数据。示例包括 Local Storage API 和 IndexedDB。

- Service Workers 和离线 API：使应用程序可以离线工作，并通过缓存资源提高性能。Service Workers 可以拦截网络请求并传递推送消息。

- 性能 API：帮助测量和优化 Web 应用程序的性能。示例包括 Navigation Timing API 和 Performance Observer API。

我们的看看去提供了很多的对象和接口如下：

1. `window`

- 定时器和延时器
  - setTimeout()：延迟执行代码。
  - setInterval()：定时循环执行代码。
  - clearTimeout()：清除延时器。
  - clearInterval()：清除定时器。

- 文档对象模型（DOM）操作
  - document：代表整个 HTML 或 XML 文档。
  - location：获取或设置当前页面的 URL。
  - history：操作浏览器的历史记录。

- 控制台
  - console.log()：在控制台输出信息。
  - console.error()：在控制台输出错误信息。
  - console.warn()：在控制台输出警告信息。

- 存储
  - localStorage：持久化存储键值对数据。
  - sessionStorage：会话存储键值对数据。

- 对话框
  - alert()：显示一个警告对话框。
  - confirm()：显示一个确认对话框。
  - prompt()：显示一个输入对话框。

- 其他
  - navigator：提供关于浏览器和操作系统的信息。
  - screen：提供关于用户屏幕的信息。

2. `Worker`

Worker：用于在后台线程中运行 JavaScript 代码。

3. `fetch()`

fetch()：用于执行网络请求。

4. `WebSocket`

WebSocket：用于创建和管理 WebSocket 连接，实现双向通信。

5. `URL`

URL：用于解析和处理 URL。

6. `ServiceWorker`

ServiceWorker：用于在后台管理网络请求和缓存资源。

7. `IndexedDB`

indexedDB：用于存储和检索大量结构化数据。

8. `FileReader`

FileReader：用于读取文件内容。

9. `Performance`

performance：用于测量和分析网页的性能。

10.  `Notification`

Notification：用于显示浏览器通知。

## 参考资料

[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

[The Web Platform: Browser technologies](https://html-now.github.io/)
