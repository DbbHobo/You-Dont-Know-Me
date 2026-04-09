# File

`FileReader` 接口允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 `File` 或 `Blob` 对象指定要读取的文件或数据。

文件对象可以从用户使用 `<input type="file">` 元素选择文件而返回的 `FileList` 对象中获取，或者从拖放操作的 `DataTransfer` 对象中获取。`FileReader` 只能访问用户明确选择的文件内容，它不能用于从用户的文件系统中按路径名读取文件。要按路径名读取客户端文件系统上的文件，请使用文件系统访问 API。要读取服务器端文件，使用 `fetch()`，如果跨源读取，则需要 CORS 权限。

![browser](../../../assets/fileReader.png)

## FileReader 的实例属性

- `FileReader.error` 只读

  一个表示在读取文件时发生的错误的 DOMException。

- `FileReader.readyState` 只读
  - EMPTY `0` 还没有加载任何数据
  - LOADING `1` 数据正在被加载
  - DONE `2` 已完成全部的读取请求

    表示 FileReader 状态的数字。

- `FileReader.result` 只读

  文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

## FileReader 的实例方法

- `FileReader.abort()`

  中止读取操作。在返回时，`readyState` 属性为 DONE。

- `FileReader.readAsArrayBuffer()`

  开始读取指定的 `Blob` 中的内容，一旦完成，result 属性中将包含一个表示文件数据的 `ArrayBuffer` 对象。

- `FileReader.readAsDataURL()`

  开始读取指定的 `Blob` 中的内容。一旦完成，result 属性中将包含一个表示文件数据的 `data: URL`。

- `FileReader.readAsText()`

  开始读取指定的 `Blob` 中的内容。一旦完成，result 属性中将包含一个表示所读取的文件内容的字符串。可以指定可选的编码名称。

## 使用案例

```js
// 1. 获取文件输入框
const input = document.querySelector('input[type="file"]')

input.addEventListener("change", (e) => {
  const file = e.target.files[0] // 获取第一个 File 对象

  if (file) {
    // 2. 实例化 FileReader
    const reader = new FileReader()

    // 3. 定义读取完成后的回调
    reader.onload = (event) => {
      const imageUrl = event.target.result // 这就是 base64 字符串
      document.querySelector("#preview").src = imageUrl
    }

    // 4. 开始读取文件
    reader.readAsDataURL(file)
  }
})
```

## 参考资料

[FileReader - MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
