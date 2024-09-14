# ReadableStream

Stream API 中的 `ReadableStream` 接口表示可读的字节数据流。`Fetch API` 通过 `Response` 的属性 `body` 提供了一个具体的 `ReadableStream` 对象。

- 视频/音频流传输：逐步处理和播放音视频数据，避免一次性加载整个文件。
- 大文件下载：在数据下载过程中逐步处理，而不是等所有数据下载完。
- WebSocket 数据处理：处理实时数据流。
- 读取文件内容：结合 File 和 ReadableStream，逐步读取用户上传的大文件。

在`fetch API`中，`fetch`方法返回的`Response`实例对象的`body`属性就是响应体内容的 `ReadableStream`。`Response`实例对象也可以调用`json()`方法将响应中的 JSON 格式的文本数据解析为 JavaScript 对象。

```js
// 获取原始图像
fetch("png-logo.png")
  // 取回响应的 body 属性，该属性继承 ReadableStream
  .then((response) => response.body)
  .then((body) => body.pipeThrough(new PNGTransformStream()))
  .then((rs) => rs.pipeTo(new FinalDestinationStream()));
```

## ReadableStream 的实例属性

- `locked`

表示可读流是否已锁定。

## ReadableStream 的静态方法

- `from()`

## ReadableStream 的实例方法

- `cancel()`
- `getReader()`
- `pipeThrough()`
- `pipeTo()`
- `tee()`

## 使用案例

- `fetchAndDisplayStream(url)`：通过 `fetch` 获取流式文本数据
  - 使用 `response.body.getReader()` 获取响应的可读流
  - 通过 `reader.read()` 不断获取新的数据块
  - 使用 `TextDecoder` 将获取到的字节流解码为字符串
- 模拟chatgpt的逐字显示效果：
  - `displayCharacter(char, container)`：该函数模拟逐字显示，通过 `setTimeout` 来控制每个字符显示的速度
  - 将解码后的每个字符逐步添加到网页的显示区域 `container` 中

```js
async function fetchAndDisplayStream(url) {
  const response = await fetch(url);

  // 获取响应体的可读流
  const reader = response.body.getReader();

  const decoder = new TextDecoder();  // 解码器，将字节转为字符串
  let resultContainer = document.getElementById('output');  // 显示内容的 DOM 元素

  // 不断读取流中的数据
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      console.log('Stream finished');
      break;
    }

    // 解码字节数据
    let chunk = decoder.decode(value, { stream: true });
    
    // 逐字显示
    for (let char of chunk) {
      await displayCharacter(char, resultContainer);
    }
  }
}

// 模拟逐字显示
function displayCharacter(char, container) {
  return new Promise(resolve => {
    setTimeout(() => {
      container.textContent += char;  // 将字母添加到页面上
      resolve();
    }, 100);  // 设置逐字显示的速度
  });
}

fetchAndDisplayStream('https://example.com/streaming-text-endpoint');
```

## 参考资料

[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

[Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
