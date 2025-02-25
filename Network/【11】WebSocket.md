# WebSocket

## WebSocket 定义

早期，很多网站为了实现推送技术，所用的技术都是轮询。轮询是指由浏览器每隔一段时间（如每秒）向服务器发出HTTP请求，然后服务器返回最新的数据给客户端。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求与回复可能会包含较长的头部，其中真正有效的数据可能只是很小的一部分，所以这样会消耗很多带宽资源。在这种情况下，HTML5定义了WebSocket协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

`WebSocket`是一种网络传输协议，可在单个`TCP`连接上进行**全双工通信**，位于OSI模型的**应用层**。`WebSocket`是一种与`HTTP`不同的协议。两者都位于OSI模型的应用层，并且都依赖于传输层的`TCP`协议。`WebSocket`协议支持Web浏览器（或其他客户端应用程序）与Web服务器之间的交互，具有较低的开销，便于实现客户端与服务器的实时数据传输。服务器可以通过标准化的方式来实现，而无需客户端首先请求内容，并允许消息在保持连接打开的同时来回传递。通过这种方式，可以在客户端和服务器之间进行双向持续对话。 通信通过`TCP`端口`80`或`443`完成，这在防火墙阻止非Web网络连接的环境下是有益的。

`WebSocket`协议规范将`ws`（WebSocket）和`wss`（WebSocket Secure）定义为两个新的统一资源标识符（URI）方案，分别对应明文和加密连接。除了方案名称和片段ID（不支持#）之外，其余的URI组件都被定义为此URI的通用语法。

## WebSocket 优点

- 较少的控制开销。在连接建立后，服务器和客户端之间交换数据时，**用于协议控制的数据包头部相对较小**。在不包含扩展的情况下，对于服务器到客户端的内容，此头部大小只有2至10字节（和数据包长度有关）；对于客户端到服务器的内容，此头部还需要加上额外的4字节的掩码。相对于`HTTP`请求每次都要携带完整的头部，此项开销显著减少了。
- 更强的实时性。由于协议是**全双工**的，所以服务器可以随时主动给客户端下发数据。相对于`HTTP`请求需要等待客户端发起请求服务端才能响应，延迟明显更少；即使是和`Comet`等类似的长轮询比较，其也能在短时间内更多次地传递数据。
- 保持连接状态。与`HTTP`不同的是，`Websocket`需要先建立连接，这就使得其成为一种**有状态**的协议，之后通信时可以省略部分状态信息。而`HTTP`请求可能需要在每个请求都携带状态信息（如身份认证等）。
- 更好的二进制支持。`Websocket`定义了**二进制帧**，相对`HTTP`，可以更轻松地处理二进制内容。
- 可以支持扩展。`Websocket`定义了扩展，用户可以扩展协议、实现部分自定义的子协议。如部分浏览器支持压缩等。
- 更好的压缩效果。相对于`HTTP`压缩，`Websocket`在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率。
- 与 `HTTP` 协议有着良好的兼容性。默认端口也是`80`和`443`，并且**握手阶段采用 `HTTP` 协议**，因此握手时不容易屏蔽，能通过各种 `HTTP` 代理服务器。

## WebSocket 的静态方法

- `close()`
- `error()`
- `message()`
- `open()`

## WebSocket的实例属性

- `binaryType`
- `bufferedAmount`
- `extensions`
- `protocol`
- `readyState`
- `url`

## WebSocket的实例方法

- `onclose()`
- `onerror()`
- `onmessage()`
- `onopen()`

## WebSocket实践

```js
const socket = new WebSocket('wss://xxx.com/ticket-updates');
socket.onmessage = (event) => {
  const { remainingTickets } = JSON.parse(event.data);
  document.getElementById('remaining-tickets').innerText = `剩余票数: ${remainingTickets}`;
};
```

## 参考资料

[WebSocket](https://zh.m.wikipedia.org/zh-hans/WebSocket)
