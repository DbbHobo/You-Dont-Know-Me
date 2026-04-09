# TransformStream

Stream API 中的 `TransformStream` 接口表示链式管道传输（pipe chain）转换流（transform stream）概念的具体实现。它可以传递给 `ReadableStream.pipeThrough()` 方法，以便将流数据从一种格式转换成另一种。例如，它可以用于解码（或者编码）视频帧，解压缩数据或者将流从 `XML` 转换到 `JSON`。

`TransformStream()` 构造函数创建一个新的 `TransformStream` 对象，该对象表示一对流：一个 `WritableStream` 表示可写端，和一个 `ReadableStream` 表示可读端。

```js
new TransformStream()
new TransformStream(transformer)
new TransformStream(transformer, writableStrategy)
new TransformStream(transformer, writableStrategy, readableStrategy)
```

## TransformStream 的实例属性

- `readable`
- `writable`

## 使用案例

```js
// 1. 创建一个可读流 (ReadableStream) —— 模拟服务器不停发货
const rs = new ReadableStream({
  start(controller) {
    const encoder = new TextEncoder()
    const chunks = ["这里有", "机密插件", "，请注意", "保护机密", "内容。"]

    // 模拟每隔 500ms 发送一个片段
    let i = 0
    const timer = setInterval(() => {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i]))
        i++
      } else {
        clearInterval(timer)
        controller.close()
      }
    }, 500)
  },
})

// 2. 创建一个转换流 (TransformStream) —— “滤芯”逻辑
const ts = new TransformStream({
  async transform(chunk, controller) {
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    // 解码拿到的二进制块
    let text = decoder.decode(chunk)
    console.log(`[滤芯收到]: ${text}`)

    // 执行替换逻辑（把“机密”替换成“***”）
    const filteredText = text.replace(/机密/g, "***")

    // 把加工后的数据传给下游
    controller.enqueue(encoder.encode(filteredText))
  },
})

// 3. 创建一个可写流 (WritableStream) —— “水桶”逻辑（渲染到页面）
const ws = new WritableStream({
  write(chunk) {
    const decoder = new TextDecoder()
    const text = decoder.decode(chunk)

    // 模拟 UI 渲染
    const el = document.getElementById("output")
    if (el) el.innerHTML += text
    console.log(`[最终渲染]: ${text}`)
  },
  close() {
    console.log("全部处理完成！")
  },
})

// 4. 管道连接 (The Magic of Pipe)
// 数据流向：rs -> ts -> ws
rs.pipeThrough(ts).pipeTo(ws)
```

## 参考资料

[TransformStream - MDN](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
