# DataTransfer

`DataTransfer` 对象用于保存上下文间的数据传输，如在拖放操作、剪切板读写中的那些数据。它可以保存一项或多项，每项都可以是同一种或多种数据类型的数据。

`DataTransfer` 主要旨在服务 HTML 拖放 API（用于 `DragEvent.dataTransfer` 属性，还有 `ClipboardEvent.clipboardData` 和 `InputEvent.dataTransfer`）。但是，其他 API 只使用该接口的其中一部分，忽略了部分属性（如 dropEffect）。

## DataTransfer的实例属性

- `DataTransfer.dropEffect`

  获取当前选定的拖放操作类型或者设置的为一个新的类型。值必须是 `none`、`copy`、`link` 或 `move` 之一。

- `DataTransfer.effectAllowed`

  提供所有可用的操作类型。值必须是 `none`、`copy`、`copyLink`、`copyMove`、`link`、`linkMove`、`move`、`all` 或 `uninitialized` 之一。

- `DataTransfer.files` 只读

  包含数据传输中可用的所有本地文件的列表。如果拖拽操作不涉及拖拽文件，则该属性为空列表。

- `DataTransfer.items` 只读

  提供包含所有拖拽数据列表的 `DataTransferItemList` 对象。

- `DataTransfer.types` 只读

  提供 `dragstart` 事件中设置的格式的字符串数组。

## DataTransfer的实例方法

- `DataTransfer.clearData()`

  删除与给定类型关联的数据。类型参数是可选的。如果类型为空或未指定，则删除与所有类型关联的数据。如果指定类型的数据不存在，或者 DataTransfer 中不包含任何数据，则该方法不会产生任何效果。

- `DataTransfer.getData()`

  获取给定类型的数据，如果该类型的数据不存在或 DataTransfer 不包含数据，则返回空字符串。

- `DataTransfer.setData()`

  设置给定类型的数据。如果该类型的数据不存在，则将其添加到末尾，以便类型列表中的最后一项将是新的格式。如果该类型的数据已经存在，则在相同位置替换现有数据。

- `DataTransfer.setDragImage()`

  用于设置自定义的拖拽图像。

## 使用案例

```html
<form>
  <fieldset>
    <legend>&lt;input /></legend>
    <input type="text" />
    <table class="center">
      <tbody>
        <tr>
          <th scope="row">操作类型</th>
          <td></td>
        </tr>
        <tr>
          <th scope="row">内容类型</th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </fieldset>
  <fieldset>
    <legend>&lt;textarea /></legend>
    <textarea></textarea>
    <table class="center">
      <tbody>
        <tr>
          <th scope="row">操作类型</th>
          <td></td>
        </tr>
        <tr>
          <th scope="row">内容类型</th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </fieldset>
  <fieldset>
    <legend>&lt;div contenteditable /></legend>
    <div contenteditable></div>
    <table class="center">
      <tbody>
        <tr>
          <th scope="row">操作类型</th>
          <td></td>
        </tr>
        <tr>
          <th scope="row">内容类型</th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </fieldset>
  <p class="center">
    <input type="reset" />
  </p>
</form>
```

```js
const form = document.querySelector("form")

function displayData(event) {
  if (event.type === "drop") event.preventDefault()

  const cells = event.target.nextElementSibling.querySelectorAll("td")
  cells[0].textContent = event.type
  const transfer = event.clipboardData || event.dataTransfer
  const ol = document.createElement("ol")
  cells[1].textContent = ""
  cells[1].appendChild(ol)
  for (const item of transfer.items) {
    const li = document.createElement("li")
    li.textContent = `${item.kind} ${item.type}`
    ol.appendChild(li)
  }
}

form.addEventListener("paste", displayData)
form.addEventListener("drop", displayData)
form.addEventListener("reset", () => {
  for (const cell of form.querySelectorAll("[contenteditable], td")) {
    cell.textContent = ""
  }
})
```

## 参考资料

[DataTransfer - MDN](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)
