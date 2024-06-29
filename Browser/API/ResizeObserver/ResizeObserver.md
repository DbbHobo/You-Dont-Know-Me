# ResizeObserver

`ResizeObserver` 是一种用于监听元素尺寸变化的API。当元素的大小发生变化时，`ResizeObserver` 会触发回调函数。这在响应式设计、动态布局调整以及需要跟踪元素尺寸变化的场景中非常有用。

```js
const resizeObserver = new ResizeObserver(callback)

const callback = entries => {
  for (let entry of entries) {
    // Do something with the ResizeObserver entry
  }
}

const target = document.querySelector('#target')

resizeObserver.observe(target,{ 
  box: "border-box" 
})
```

## ResizeObserver 的实例方法

- `disconnect()`
- `observe()`
- `unobserve()`

## 使用案例

```js
const h1Elem = document.querySelector("h1");
const pElem = document.querySelector("p");
const divElem = document.querySelector("body > div");
const slider = document.querySelector('input[type="range"]');
const checkbox = document.querySelector('input[type="checkbox"]');

divElem.style.width = "600px";

slider.addEventListener("input", () => {
  divElem.style.width = `${slider.value}px`;
});

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.contentBoxSize) {
      // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      const contentBoxSize = Array.isArray(entry.contentBoxSize)
        ? entry.contentBoxSize[0]
        : entry.contentBoxSize;

      h1Elem.style.fontSize = `${Math.max(
        1.5,
        contentBoxSize.inlineSize / 200,
      )}rem`;
      pElem.style.fontSize = `${Math.max(
        1,
        contentBoxSize.inlineSize / 600,
      )}rem`;
    } else {
      h1Elem.style.fontSize = `${Math.max(
        1.5,
        entry.contentRect.width / 200,
      )}rem`;
      pElem.style.fontSize = `${Math.max(1, entry.contentRect.width / 600)}rem`;
    }
  }

  console.log("Size changed");
});

resizeObserver.observe(divElem);

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    resizeObserver.observe(divElem);
  } else {
    resizeObserver.unobserve(divElem);
  }
});
```

可能可以使用的场景如下：

- 响应式设计：在响应式设计中，自动调整元素的样式或内容以适应新的尺寸。
- 动态布局调整：在网格布局或复杂布局中，检测元素大小变化并相应地调整布局。
- 图表和可视化：当容器元素的尺寸发生变化时，重新绘制或调整图表和其他可视化内容。
- 用户界面调整：当用户调整窗口或面板大小时，实时调整用户界面元素的尺寸和位置。
- 文本区域自适应：在文本区域中，根据内容动态调整大小，以适应多行输入。
- 监控第三方组件：跟踪和响应第三方组件或广告的尺寸变化，确保布局一致性。

## 参考资料

[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

[Using the Resize Observer API with React](https://dev.to/darthknoppix/using-the-resize-observer-api-with-react-2f96)
