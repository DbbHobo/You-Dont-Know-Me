# setTimeout、setInterval、requestAnimationFrame、防抖、节流

## setTimeout、setInterval

- `setTimeout` 含义是定时器，到达一定的时间触发一次
- `setInterval` 含义是计时器，到达一定时间触发一次，并且会持续触发

### `setTimeout()` / `clearTimeout()`

`setTimeout()`的第二个参数告诉 `JavaScript` 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

调用`setTimeout()`之后，该方法会返回一个 ID，表示超时调用。这个超时调用 ID 是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用`clearTimeout()`方法并将相应的超时调用 ID 作为参数传递给它。

### `setInterval()` / `clearInterval()`

调用`setInterval()`方法同样也会返回一个 ID，该 ID 可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用`clearInterval()`方法并传入相应的间歇调用 ID。取消间歇调用的重要性要远远高于取消超时调用，因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载。

## 防抖 Debounce 和 节流 Throttle

`Debounce` 和 `Throttle` 是两种相似但不同的技术，用于控制函数在某段时间内执行的次数。

一个经过防抖或节流处理的函数在将该函数附加到 DOM 事件时特别有用。为什么呢？因为这样我们在事件和函数执行之间添加了一层控制。因为我们无法控制 DOM 事件的触发频率，它可能会变化。

### 防抖 debounce

在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将**多次计算合并为一次计算**，只在一个精确点做操作，也就是在最后一次触发事件后 n 秒再进行事件调用。

防抖就是延迟执行一个函数，直到用户在特定时间内停止执行某个特定动作。例如，如果你有一个搜索栏，根据用户输入从后端获取建议，你可以对执行 API 调用的函数进行防抖，以便只有在用户停止输入几秒钟后才运行该函数。通过这种方式，你可以避免进行过多的 API 调用，从而防止服务器过载或返回不相关的结果。

```js
// 简易实现-每次触发事件时都取消之前的延时调用方法
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

```js
// 简易实现-首次触发会执行，后续每次等到停止触发n秒后再触发
function debounce(func, wait, immediate) {
  var timeout, result

  return function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        result = func.apply(context, args)
      }, wait)
    }

    return result
  }
}
```

`Lodash`中实现的防抖功能如下：

- [func] (Function): 被防抖的函数.
- [wait=0] (number): 延迟时间.
- [options={}] (Object): 其他几个可配置参数.
- [options.leading=false] (boolean): 在这个延迟时间间隔的开头去触发函数.
- [options.maxWait] (number): 函数被执行的最大允许的延迟时间.
- [options.trailing=true] (boolean): 在这个延迟时间间隔的结尾去触发函数.

```ts
// lodash实现
import isObject from "./isObject.js"
import root from "./.internal/root.js"

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn. The debounced function
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * debounced function. Subsequent calls to the debounced function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', debounce(calculateLayout, 150))
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }))
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * jQuery(source).on('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * const status = debounced.pending() ? "Pending..." : "Ready"
 */
function debounce(func, wait, options) {
  let lastArgs
  let lastThis
  let maxWait
  let result
  let timerId
  let lastCallTime //上一次试图触发函数时间
  let lastInvokeTime = 0 //上一次调用时间
  let leading = false
  let maxing = false
  let trailing = true

  // 没传wait或者wait为0时用requestAnimationFrame方法代替setTimeout
  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === "function"

  if (typeof func !== "function") {
    throw new TypeError("Expected a function")
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = "maxWait" in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = "trailing" in options ? !!options.trailing : trailing
  }

  // 调用用户传入的函数
  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  // 设置定时器-返回定时器id
  function startTimer(pendingFunc, milliseconds) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId)
      return root.requestAnimationFrame(pendingFunc)
    }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return setTimeout(pendingFunc, milliseconds)
  }

  // 清除定时器
  function cancelTimer(id) {
    if (useRAF) {
      root.cancelAnimationFrame(id)
      return
    }
    clearTimeout(id)
  }

  // 是否在超时起始时调用
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  // 是否需要调用用户传入的函数
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    // 首次调用or上一次调用时间间隔超过wait时间or上次实施时间间隔大于最大等待时间等情况皆返回true
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  // 检验时间是否到期
  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
    return undefined
  }

  // 是否在超时结束时调用
  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  // 除了返回防抖后的函数以外还提供了cancel（）、flush函数
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
```

### 节流 throttle

防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，而节流是将**多次执行变成每隔一段时间执行**。

节流限制函数在指定时间间隔内只能执行一次。例如，如果你有一个调整页面布局的 resize 事件需要处理，你可以对更新布局的函数进行节流，使其每 100 毫秒只运行一次。这样，你可以避免代码过于频繁地运行，从而导致用户界面不流畅或过高 CPU 使用率。

```js
// 简易实现-每次触发事件时都判断当前是否有等待执行的延时函数
function throttle(fn, interval) {
    let timer = null
    return function (...args) {
    if (!timer) {
        timer = setTimeout(() => {
            fn.apply(this, args)
            timer = null
        }, interval)
    }
}
```

`Lodash`中实现的节流功能其实基于防抖`debounce`函数，配合`maxWait`参数，用户传入的`wait`时间就作为`debounce`函数的`maxWait`参数使用：

- [func] (Function): 被节流的函数.
- [wait=0] (number): 延迟时间.
- [options={}] (Object): 其他几个可配置参数.
- [options.leading=false] (boolean): 在这个延迟的开头去触发函数.
- [options.trailing=true] (boolean): 在这个延迟的结尾去触发函数.

```js
// lodash实现
import debounce from "./debounce.js"
import isObject from "./isObject.js"

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds (or once per browser frame). The throttled function
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `throttle` and `debounce`.
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0]
 *  The number of milliseconds to throttle invocations to; if omitted,
 *  `requestAnimationFrame` is used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', throttle(updatePosition, 100))
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * const throttled = throttle(renewToken, 300000, { 'trailing': false })
 * jQuery(element).on('click', throttled)
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel)
 */
function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== "function") {
    throw new TypeError("Expected a function")
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading
    trailing = "trailing" in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}

export default throttle
```

### 使用场景

防抖方法使用场景：

- 按钮点击多次
- input 输入 keydown

节流方法使用场景：

- window 滚动 scroll
- window 尺寸 resize

## requestAnimationFrame

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。

`requestAnimationFrame()`方法同样也会返回一个 ID，和`setTimeout()`、`setInterval()`一样可以用于在将来某个时刻取消间歇调用`cancelAnimationFrame(handlerId)`。

可以把`window.requestAnimationFrame()`方法看作一个节流函数`_.throttle(dosomething, 16)`，并且这个方法是高度精确的，因为它是一个原生 API。

## 总结

- `debounce`（防抖）：将突发事件（例如按键输入）分组为一个单一事件的过程。
- `throttle`（节流）：确保每隔 n 毫秒执行一次操作的过程，比如每 200 毫秒检查一次滚动位置以触发 CSS 动画。
- `requestAnimationFrame`（请求动画帧）：是一个节流的替代方法。当函数重新计算并渲染屏幕上的元素时，希望保证平滑的变化或动画时使用。注意：不支持 IE9。

## 参考资料

[Using requestAnimationFrame](https://css-tricks.com/using-requestanimationframe/)

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
