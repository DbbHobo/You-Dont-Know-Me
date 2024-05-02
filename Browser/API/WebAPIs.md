# Web APIs

<!-- 【TODO】 -->
## IntersectionObserver API

### 构造函数

`IntersectionObserver()`

### 实例属性

`root`

`rootMargin`

`thresholds`

### 实例方法

`disconnect()`

`observe()`

`takeRecords()`

`unobserve()`

```js
const intersectionObserver = new IntersectionObserver((entries) => {
  // 如果 intersectionRatio 为 0，则目标在视野外，
  // 我们不需要做任何事情。
  if (entries[0].intersectionRatio <= 0) return;

  loadItems(10);
  console.log("Loaded new items");
});

// 开始监听
intersectionObserver.observe(document.querySelector(".scrollerFooter"));
```

## Fetch API

## Timers API

## Console API

## Geolocation API

## Web Storage API

## File API

## Performance API

## URL API

## HTML DOM

## 参考资料

[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
