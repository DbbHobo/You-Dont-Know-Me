# Blob

`Blob` 对象，Binary Large Object（二进制大对象），表示一个不可变、原始数据的类文件对象。它的数据可以按**文本**或**二进制的格式**进行读取，也可以转换成 `ReadableStream` 来用于数据操作。

`Blob` 表示的不一定是 JavaScript 原生格式的数据，JS 原生的数据格式是 `String`、`Array` 或 `Object`。而 `Blob` 可能存储的是一张图片、一段音频，甚至是压缩包的二进制码。JS 引擎并不直接“认识”这些数据的含义，它只是把它们当成一串 0 和 1 暂存在内存里。`File` 接口基于 `Blob`，继承了 blob 的功能并将其扩展以支持用户系统上的文件。

```js
const obj = { hello: "world" }
const blob = new Blob([JSON.stringify(obj, null, 2)], {
  type: "application/json",
})
```

## Blob的实例属性

- `Blob.size` 只读

  `Blob` 对象中所包含数据的大小（字节）。

- `Blob.type` 只读

  一个字符串，表明该 `Blob` 对象所包含数据的 `MIME` 类型。如果类型未知，则该值为空字符串。

## Blob的实例方法

- `Blob.arrayBuffer()`

  返回一个 promise，其会兑现一个包含 `Blob` 所有内容的二进制格式的 `ArrayBuffer`。

- `Blob.bytes()`

  返回一个 promise，其会兑现一个包含 `Blob` 内容的 `Uint8Array`。

- `Blob.slice()`

  返回一个新的 `Blob` 对象，其中包含调用它的 `blob` 的指定字节范围内的数据。

- `Blob.stream()`

  返回一个能读取 `Blob` 内容的 `ReadableStream`。

- `Blob.text()`

  返回一个 promise，其会兑现一个包含 `Blob` 所有内容的 UTF-8 格式的字符串。

## 使用案例

```js
function createChunks(file, chunkSize = 1024 * 1024 * 2) {
  // 默认每片 2MB
  const chunks = []
  let cur = 0

  while (cur < file.size) {
    // 利用 Blob 的 slice 方法进行物理切片
    const chunk = file.slice(cur, cur + chunkSize)

    chunks.push({
      index: chunks.length,
      data: chunk, // 这里的 chunk 就是一个小的 Blob 对象
      fileName: file.name,
    })

    cur += chunkSize
  }

  return chunks
}

// 使用场景
const fileInput = document.querySelector("input")
fileInput.onchange = (e) => {
  const file = e.target.files[0]
  const chunkList = createChunks(file)

  console.log(`文件被切成了 ${chunkList.length} 份`)
  console.log("第一片的大小:", chunkList[0].data.size) // 恰好是 2MB (2097152 字节)
}
```

## 参考资料

[Blob - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
