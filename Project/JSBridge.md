# JSBridge

通过JSBridge可以实现H5和原生之间的双向通信，主要是给H5提供调用原生（Native）功能的接口，让混合开发中的H5可以方便地使用地址位置、摄像头甚至支付等原生功能。

## JSBridge 的通信原理

- 注入API

注入 API 方式是最常用的方式，主要原理是通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的。

- 拦截 url scheme

url scheme是一种类似于url的链接，是为了方便app直接互相调用设计的，形式和普通的 url 近似，主要区别是 `protocol` 和 `host` 一般是自定义的。
例如打开微信扫码的SCHEME：`weixin://scanqrcode`，`protocol` 是 `weixin`，`host` 则是 `scanqrcode`。

拦截 url scheme 的主要流程：Web 端通过某种方式（例如 iframe.src）发送 url scheme 请求，之后 Native 拦截到请求，并根据 url scheme（包括所带的参数）进行相关操作（类似JSONP的方式）

url scheme的缺陷
1）使用 iframe.src 发送 url scheme 会有 url 长度的隐患
2）创建请求，需要一定的耗时，比注入 API 的方式调用同样的功能，耗时会较长
