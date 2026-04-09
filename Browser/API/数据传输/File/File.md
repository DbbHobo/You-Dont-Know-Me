# File

`File` 对象通常从用户使用 `<input>` 元素选择文件返回的 `FileList` 对象中检索，或者从拖放操作返回的 `DataTransfer` 对象中检索。出于安全考虑，不能通过 `File` API 直接修改文件内容，只能读取。

`File` 对象是一种特定类型的 `Blob`，并且可以在 `Blob` 可以使用的任何上下文中使用。特别地，以下 API 都接受 `Blob` 对象和 `File` 对象：

- `FileReader`
- `URL.createObjectURL()`
- `Window.createImageBitmap()` 和 `WorkerGlobalScope.createImageBitmap()`
- `fetch()` 方法的 `body` 选项
- `XMLHttpRequest.send()`

![browser](../../../assets/file.png)

## File 的实例属性

- `lastModified` 只读

  返回文件的最后修改时间，单位为自 1970 年 1 月 1 日午夜以来的毫秒数。

- `name` 只读

  返回文件名。

- `webkitRelativePath` 只读

  返回文件相对于上传目录的路径（通常用于目录上传时）。

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

[File - MDN](https://developer.mozilla.org/en-US/docs/Web/API/File)
