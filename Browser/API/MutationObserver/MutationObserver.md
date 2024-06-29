# MutationObserver

`MutationObserver` 接口创建一个新的`MutationObserver`对象，并指定当DOM发生变化时要调用的回调函数。`MutationObserver()` 创建并返回一个新的 `MutationObserver` 它会在指定的 `DOM` 发生变化时被调用。

```js
const mutationObserver = new MutationObserver(callback[, options])

const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    // Do something with the mutationObserver mutation
  }
}

const target = document.querySelector('#target')

mutationObserver.observe(target, {
  childList: true,
  subtree: true,
})
```

## 实例方法

- `disconnect()`
- `observe()`
- `takeRecords()`

## 使用案例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MutationObserver Example</title>
  <style>
    #container,
    #log {
      height: 150px;
      overflow: scroll;
    }

    #container li {
      background-color: paleturquoise;
      margin: 0.5rem;
    }
  </style>
</head>
<body>
  <button id="add">Add child</button>
  <button id="remove">Remove child</button>
  <button id="reset">Reset example</button>

  <ul id="container"></ul>

  <pre id="log"></pre>

  <script src="script.js"></script>
</body>
</html>
```

```js
const add = document.querySelector("#add");
const remove = document.querySelector("#remove");
const reset = document.querySelector("#reset");
const container = document.querySelector("#container");
const log = document.querySelector("#log");

let namePrefix = 0;

add.addEventListener("click", () => {
  const newItem = document.createElement("li");
  newItem.textContent = `item ${namePrefix}`;
  container.appendChild(newItem);
  namePrefix++;
});

remove.addEventListener("click", () => {
  const itemToRemove = document.querySelector("li");
  if (itemToRemove) {
    itemToRemove.parentNode.removeChild(itemToRemove);
  }
});

reset.addEventListener("click", () => {
  document.location.reload();
});

function logChanges(records, observer) {
  for (const record of records) {
    for (const addedNode of record.addedNodes) {
      log.textContent = `Added: ${addedNode.textContent}\n${log.textContent}`;
    }
    for (const removedNode of record.removedNodes) {
      log.textContent = `Removed: ${removedNode.textContent}\n${log.textContent}`;
    }
    if (record.target.childNodes.length === 0) {
      log.textContent = `Disconnected\n${log.textContent}`;
      observer.disconnect();
    }
    console.log(record.target.childNodes.length);
  }
}

const observerOptions = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver(logChanges);
observer.observe(container, observerOptions);
```

可能可以使用的场景如下：

- 动态内容加载：监视和处理动态加载的内容，例如无限滚动或懒加载。
- 表单自动化：当表单元素被动态添加或更改时，自动触发某些行为，如验证或格式化。
- 用户界面更新：在单页面应用中监视和响应用户界面部分的动态更新。
- 监视第三方代码：跟踪和处理由第三方脚本或广告网络引起的DOM更改。
- 数据绑定：在数据绑定框架中实现双向数据绑定，自动更新DOM中的内容。
- 自定义组件库：开发自定义组件库时，确保组件可以响应外部DOM更改。

## 参考资料

[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

[MutationObserver](https://dev.to/hasantezcan/mutationobserver-3f0p)
