# JSBridge

`JSBridge` 是一种用于在 `JavaScript` 和 `Native`（原生）代码之间进行双向通信的桥接机制，广泛应用于 `WebView` 中，以便在移动应用或桌面应用中嵌入网页，同时允许网页与原生代码进行交互。

在前端开发中，`JSBridge` 经常用在移动应用开发场景中，比如在安卓和 iOS App 内嵌的 `WebView` 中。它能使前端代码（`JavaScript`）和原生代码（如 Android 的 Java 或 iOS 的 Swift/Objective-C）进行调用，便于利用原生功能（如相机、定位、存储等），而无需离开 `WebView`。

`JSBridge` 通常由三部分构成：

1. `JavaScript` 代码：在前端运行，通过 `JSBridge` 发起请求。
2. `Native` 代码：在移动操作系统中运行，处理来自 JS 的请求并响应。
3. 通信通道：在 `JavaScript` 和 `Native` 代码之间传递消息的“桥梁”。

通过`JSBridge`可以**实现H5和原生之间的双向通信**，主要是给H5提供调用原生（`Native`）功能的接口，让混合开发中的H5可以方便地使用地址位置、摄像头甚至支付等原生功能。

## WebView

`WebView` 是一种在移动应用（如 Android、iOS）或桌面应用中嵌入网页内容的技术组件。它允许在应用内部嵌入一个小型浏览器，使应用可以直接加载并显示网页，通常用于展示 H5 页面、混合应用（hybrid app）开发等场景。

WebView 本质上是一个包含浏览器内核的组件，作为应用中的一个视图（View）来显示网页内容。不同平台的 WebView 的工作机制基本一致，主要流程如下：

1. 加载网页：
  - 应用通过 URL 或 HTML 字符串将网页内容加载到 WebView 中，例如 webView.loadUrl("https://www.example.com")。

2. 渲染内容：
  - WebView 渲染 HTML、CSS 和 JavaScript，将页面内容显示在 WebView 中的视图。

3. 交互与通信：
  - 使用 JSBridge 等机制，WebView 中的 JavaScript 和应用的原生代码可以互相调用。

## JSBridge 的通信原理

- 注入对象

原生应用将一个对象注入到 `WebView` 中，使得 `JavaScript` 可以直接调用该对象的属性和方法。

- 事件监听与回调

原生应用与 `WebView` 中的 `JavaScript` 之间可以通过**注册事件**和**回调函数**来相互调用，`JavaScript` 调用时触发事件，原生代码监听事件并响应，或反之。可以通过 `postMessage` API 发送消息，适合与 `WebView` 有深度交互的场景。

- `URL Scheme` 拦截

`URL Scheme`是一种类似于URL的链接，是为了方便app直接互相调用设计的，形式和普通的URL近似，主要区别是 `protocol` 和 `host` 一般是自定义的。
例如打开微信扫码的SCHEME：`weixin://scanqrcode`，`protocol` 是 `weixin`，`host` 则是 `scanqrcode`。

拦截 `URL Scheme` 的主要流程：Web 端通过某种方式（例如 iframe.src）发送 `URL Scheme` 请求，之后 `Native` 拦截到请求，并根据 `URL Scheme`（包括所带的参数）进行相关操作（类似JSONP的方式）。

`URL Scheme`的缺陷：

1. 使用 iframe.src 发送 `URL Scheme` 会有 url 长度的隐患
2. 创建请求，需要一定的耗时，比注入对象的方式调用同样的功能，耗时会较长
