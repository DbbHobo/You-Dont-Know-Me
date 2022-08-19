## setTimeout、setInterval、requestAnimationFrame、防抖、节流

### setTimeout、setInterval

- setTimeout 含义是定时器，到达一定的时间触发一次
- setInterval 含义是计时器，到达一定时间触发一次，并且会持续触发

1. setTimeout()

`setTimeout()`的第二个参数告诉 JavaScript 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

调用`setTimeout()`之后，该方法会返回一个 ID，表示超时调用。这个超时调用 ID 是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用`clearTimeout()`方法并将相应的超时调用 ID 作为参数传递给它。

2. setInterval()

调用`setInterval()`方法同样也会返回一个 ID，该 ID 可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用`clearInterval()`方法并传入相应的间歇调用 ID。取消间歇调用的重要性要远远高于取消超时调用，因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载。

### 防抖

在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将**多次计算合并为一次计算**，只在一个精确点做操作。

```js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    let context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
```

### 节流

防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将**多次执行变成每隔一段时间执行**。

```js
function throttle(fn, interval) {
  let flag = true;
  return function (...args) {
    let context = this;
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(context, args);
      flag = true;
    }, interval);
  };
}
```

### requestAnimationFrame

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。

`requestAnimationFrame()`方法同样也会返回一个 ID，和`setTimeout()`、`setInterval()`一样可以用于在将来某个时刻取消间歇调用`cancelAnimationFrame()`。

[Using requestAnimationFrame](https://css-tricks.com/using-requestanimationframe/)
