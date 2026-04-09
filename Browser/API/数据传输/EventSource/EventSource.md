# EventSource

`EventSource` 接口是 web 内容与服务器发送事件通信的接口。

一个 `EventSource` 实例会对 `HTTP` 服务器开启一个持久化的连接，以 `text/event-stream` 格式发送事件，此连接会一直保持开启直到通过调用 `EventSource.close()` 关闭。

```js
const evtSource = new EventSource("sse.php")
const eventList = document.querySelector("ul")

evtSource.onmessage = (e) => {
  const newElement = document.createElement("li")

  newElement.textContent = `message: ${e.data}`
  eventList.appendChild(newElement)
}
```

![browser](../../assets/EventSource.png)

## EventSource 的实例属性

- `readyState`

  用一个只读的数字表示链接情况

- `url`

  用一个只读的字符串表示链接

- `withCredentials`

  一个只读属性 `withCredentials` 返回一个布尔值，用于表示该 `EventSource` 对象在实例化时是否启用了 `CORS` 凭证。

## EventSource 的实例方法

- `close()`

## 使用案例

- AI 流式输出（如 ChatGPT、Claude 的打字机效果）
- 实时通知（新邮件、订单状态）
- 股票/数据看板实时更新
- 进度条推送（文件处理进度）

```js
res.setHeader("Content-Type", "text/event-stream")
res.setHeader("Cache-Control", "no-cache")

setInterval(() => {
  res.write(`data: ${new Date().toISOString()}\n\n`)
}, 1000)
```

```js
const es = new EventSource("/stream")
es.onmessage = (e) => console.log(e.data)
```

## 参考资料

[EventSource - MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
