# WritableStream

Stream API 中的 `WritableStream` 接口负责接收数据块并执行底层写入操作。

- 顺序写入：确保数据按接收顺序处理。
- 生命周期管理：提供 `start`（准备）、`write`（处理数据）、`close`（收尾）和 `abort`（出错处理）钩子。

## WritableStream 的实例属性

- `WritableStream.locked` 只读

  一个布尔值，表示 WritableStream 是否锁定到一个 writer。

## WritableStream 的实例方法

- `abort()`
- `close()`
- `getWriter()`

## 使用案例

```js
const list = document.querySelector("ul")

function sendMessage(message, writableStream) {
  // defaultWriter is of type WritableStreamDefaultWriter
  const defaultWriter = writableStream.getWriter()
  const encoder = new TextEncoder()
  const encoded = encoder.encode(message, { stream: true })
  encoded.forEach((chunk) => {
    defaultWriter.ready
      .then(() => {
        return defaultWriter.write(chunk)
      })
      .then(() => {
        console.log("Chunk written to sink.")
      })
      .catch((err) => {
        console.log("Chunk error:", err)
      })
  })
  // Call ready again to ensure that all chunks are written
  //   before closing the writer.
  defaultWriter.ready
    .then(() => {
      defaultWriter.close()
    })
    .then(() => {
      console.log("All chunks written")
    })
    .catch((err) => {
      console.log("Stream error:", err)
    })
}

// 为创建计数策略而设置的 highWaterMark 属性，其用于设置 WritableStream 实例处理单个 write() 操作时可接受的最大数据量。在该示例中，它是可以传递给 defaultWriter.write() 的最大数据量
const decoder = new TextDecoder("utf-8")
const queuingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })
let result = ""
const writableStream = new WritableStream(
  {
    // Implement the sink
    write(chunk) {
      return new Promise((resolve, reject) => {
        var buffer = new ArrayBuffer(1)
        var view = new Uint8Array(buffer)
        view[0] = chunk
        var decoded = decoder.decode(view, { stream: true })
        var listItem = document.createElement("li")
        listItem.textContent = "Chunk decoded: " + decoded
        list.appendChild(listItem)
        result += decoded
        resolve()
      })
    },
    close() {
      var listItem = document.createElement("li")
      listItem.textContent = "[MESSAGE RECEIVED] " + result
      list.appendChild(listItem)
    },
    abort(err) {
      console.log("Sink error:", err)
    },
  },
  queuingStrategy,
)
sendMessage("Hello, world.", writableStream)
```

## 参考资料

[WritableStream - MDN](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)
