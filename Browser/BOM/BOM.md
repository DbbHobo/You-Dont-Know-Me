# BOM（Browser Object Model）浏览器对象模型

The BOM (Browser Object Model) consists of the objects navigator, history, screen, location and document which are children of window.

`BOM` 为JavaScript提供了一种控制浏览器行为的"方法"。从根本上讲， `BOM` 只处理浏览器窗口和框架；但人们习惯上也把所有针对浏览器的 `JavaScript` 扩展算作 `BOM` 的一部分。

BOM（浏览器对象模型）是浏览器本身的一些信息的设置和获取，例如获取浏览器的宽度、高度，设置让浏览器跳转到哪个地址等等。

- window
- navigator
- screen
- location
- history

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

(2) `getBoundingClientRect`

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

(3) Intersection Observer

通过`new IntersectionObserver`创建了观察者 `observer`，传入的参数 `callback` 在重叠比例超过 `threshold` 时会被执行

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

![BOM](../assets/BOM.png)

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

## 参考资料

[window.location Cheatsheet](https://dev.to/samanthaming/window-location-cheatsheet-4edl)
