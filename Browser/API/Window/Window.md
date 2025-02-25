# BOM（Browser Object Model）浏览器对象模型

The BOM (Browser Object Model) consists of the objects navigator, history, screen, location and document which are children of window.

`BOM` 为JavaScript提供了一种控制浏览器行为的"方法"。从根本上讲， `BOM` 只处理浏览器窗口和框架，但人们习惯上也把所有针对浏览器的 `JavaScript` 扩展算作 `BOM` 的一部分。

BOM（浏览器对象模型）是浏览器本身的一些信息的设置和获取，例如获取浏览器的宽度、高度，设置让浏览器跳转到哪个地址等等。

- window
- window.navigator
- window.screen
- window.location
- window.history

## window.navigator

获取浏览器特性（即俗称的 UA）然后识别客户端，例如判断是不是 Chrome 浏览器

```js
var ua = navigator.userAgent;
var isChrome = ua.indexOf("Chrome");
console.log(isChrome);
```

## window.screen

获取屏幕的宽度和高度

```js
console.log(screen.width);
console.log(screen.height);
```

常用宽度和高度：

- `document.documentElement.clientWidth`：元素内容区宽度加上左右内边距宽度，即clientWidth = content + padding
- `document.documentElement.clientHeight`：元素内容区高度加上上下内边距高度，即clientHeight = content + padding
- `window.innerHeight`：浏览器窗口的视口（viewport）高度（以像素为单位）；如果有水平滚动条，也包括滚动条高度。
- `window.innerWidth`：只读的 Window 属性，innerWidth 返回以像素为单位的窗口的内部宽度。如果垂直滚动条存在，则这个属性将包括它的宽度。

判断一个元素是否在可视区域，常用的有三种办法：

(1) `offsetTop`、`scrollTop`

`el.offsetTop - document.documentElement.scrollTop <= viewPortHeight`

```js
function isInViewPortOfOne (el) {
    // viewPortHeight 兼容所有浏览器写法
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    const offsetTop = el.offsetTop
    const scrollTop = document.documentElement.scrollTop
    const top = offsetTop - scrollTop
    return top <= viewPortHeight
}
```

(2) `Element.getBoundingClientRect()`提供了元素的大小及其相对于视口的位置。

该方法返回的 DOMRect 对象中的 `width` 和 `height` 属性是包含了 `padding` 和 `border-width` 的，而不仅仅是内容部分的宽度和高度。在标准盒子模型中，这两个属性值分别与元素的 `width/height + padding + border-width` 相等。而如果是 `box-sizing: border-box`，两个属性则直接与元素的 `width` 或 `height` 相等。

```js
const target = document.querySelector('.target');
const clientRect = target.getBoundingClientRect();
console.log(clientRect);
// {
//   bottom: 556.21875,
//   height: 393.59375,
//   left: 333,
//   right: 1017,
//   top: 162.625,
//   width: 684
// }
```

如果一个元素在视窗之内的话，那么它一定满足下面四个条件：top 大于等于 0，left 大于等于 0，bottom 小于等于视窗高度，right 小于等于视窗宽度

(3) `IntersectionObserver`

`IntersectionObserver` 接口提供了一种异步观察目标元素与其祖先元素或顶级文档视口（`viewport`）交叉状态的方法。其祖先元素或视口被称为根（`root`）。

通过`new IntersectionObserver`创建了观察者 `observer`，传入的参数 `callback` 在重叠比例超过 `threshold` 时会被执行。

```js
const options = {
  // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
  // 1 表示完全被包含
  threshold: 1.0, 
  root:document.querySelector('#scrollArea') // 必须是目标元素的父级元素
};
const callback = (entries, observer) => { ....}
const observer = new IntersectionObserver(callback, options);
```

## window.location

获取网址、协议、path、参数、hash 等

```js
// https://www.samanthaming.com:8080/tidbits/?filter=JS#2
window.location.origin   → 'https://www.samanthaming.com'
               .protocol → 'https:'
               .host     → 'www.samanthaming.com:8080'
               .hostname → 'www.samanthaming.com'
               .port     → ''
               .pathname → '/tidbits/'
               .search   → '?filter=JS'
               .hash     → '#2'
               .href     → 'https://www.samanthaming.com/tidbits/?filter=JS#2'

window.location.assign('url')
               .replace('url')
               .reload()
               .toString()
```

![BOM](./assets/BOM.png)

```js
// 例如当前网址是 https://leetcode-cn.com/problemset/all/?difficulty=%E7%AE%80%E5%8D%95#some
console.log(location.href); // https://leetcode-cn.com/problemset/all/?difficulty=%E7%AE%80%E5%8D%95#some
console.log(location.protocol); // https:
console.log(location.pathname); // /problemset/all
console.log(location.search); // ?difficulty=%E7%AE%80%E5%8D%95
console.log(location.hash); // #some
```

## window.history

调用浏览器的前进、后退功能等

```js
history.back();
history.forward();
```

## window.requestAnimationFrame()

`window.requestAnimationFrame()` 方法会告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。

`requestAnimationFrame` 的回调函数会在所有同步 JavaScript 代码执行完毕后、浏览器进行布局和绘制之前执行。

```js
requestAnimationFrame(callback)
```

## window.requestIdleCallback()

`window.requestIdleCallback()` 方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。

```js
requestIdleCallback(callback)
requestIdleCallback(callback, options)
```

## window

`window` 对象表示一个包含 `DOM` 文档的窗口，其 `document` 属性指向窗口中载入的 `DOM` 文档。代表了脚本正在运行的窗口的 `window` 全局变量，被暴露给 `Javascript` 代码。

本接口从 `EventTarget` 接口继承属性。

`window` => `Window` => `EventTarget`

## 参考资料

[window.location Cheatsheet](https://dev.to/samanthaming/window-location-cheatsheet-4edl)

[EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)

[Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)
