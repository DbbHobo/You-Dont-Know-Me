# 函数式编程

函数式编程是一种编程范式，主要是利用函数把运算过程包装起来，我们想实现一个复杂的功能时，可以通过组合各种函数来计算结果。

## 纯函数

纯函数他有三个特点，一是没有副作用，二是引用透明，三是数据不可变。相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

- 没有副作用就是指函数本身不依赖于且不会修改外部的数据。
- 引用透明就是指输入相同的参数永远会得到相同的输出，简单的说函数的返回值只受输入的影响。
- 数据不可变主要是针对类型引用数据类型的入参，如果以一定要修改，最好的方式就是重新去生成一份数据。

纯函数的意义在于：

- 便于测试和优化：这个意义在实际项目开发中意义非常大，由于纯函数对于相同的输入永远会返回相同的结果，因此我们可以轻松断言函数的执行结果，同时也可以保证函数的优化不会影响其他代码的执行。这十分符合测试驱动开发 TDD（Test-Driven Development） 的思想，这样产生的代码往往健壮性更强。
- 可缓存性：因为相同的输入总是可以返回相同的输出，因此，我们可以提前缓存函数的执行结果。
- 更少的 Bug：使用纯函数意味着你的函数中不存在指向不明的 this，不存在对全局变量的引用，不存在对参数的修改，这些共享状态往往是绝大多数 bug 的源头。

```js
const add = (a, b) => a + b
```

## 函数缓存

函数缓存，就是将函数运算过的结果进行缓存，本质上就是用空间（缓存存储）换时间（计算过程），常用于缓存数据计算结果和缓存对象。

- 对于昂贵的函数调用，执行复杂计算的函数
- 对于具有有限且高度重复输入范围的函数
- 对于具有重复输入值的递归函数
- 对于纯函数，即每次使用特定输入调用时返回相同输出的函数

```js
const memoize = function (func, content) {
  let cache = Object.create(null)
  content = content || this
  return (...key) => {
    if (!cache[key]) {
      cache[key] = func.apply(content, key)
    }
    return cache[key]
  }
}

const calc = memoize(add)
const num1 = calc(100, 200)
const num2 = calc(100, 200) // 缓存得到的结果
```

## 函数的合成

如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（`compose`）。

- `compose` 的参数是函数，返回的也是一个函数。
- 除了初始函数（最右侧的一个）外，其他函数的接收参数都是一个函数的返回值，所以初始函数的参数可以是多元的，而其他函数的接收值是一元的。
- `compose` 函数可以接收任意的参数，所有的参数都是函数，且执行方向为自右向左。初始函数一定要放到参数的最右侧。

```js
// 几种进行函数合成的方式如下：
const compose = function (f, g) {
  return function (x) {
    return f(g(x))
  }
}

const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((val, fn) => fn.apply(null, [].concat(val)), args)

const compose =
  (...fns) =>
  (x0) =>
    fns.reduceRight((x, f) => f(x), x0)

// We call this function 'flow' as the values flow,
// from left to right.
const flow =
  (...fns) =>
  (x0) =>
    fns.reduce((x, f) => f(x), x0)

const pipe = (x0, ...fns) => fns.reduce((x, f) => f(x), x0)
```

```js
// 函数合成使用实例如下：
const pipe =
  (...fns) =>
  (x0) =>
    fns.reduce((x, f) => f(x), x0)

const trace = (msg) => (x) => {
  console.log(msg, x)
  return x
}

const increment = (n) => n + 1
const double = (n) => n * 2
const square = (n) => n * n

const incDoubleSquare = pipe(
  increment,
  trace("before double"),
  double,
  trace("after double"),
  square
)
incDoubleSquare(3) // 64
// Also logs out:
// before double 4
// after double 8
```

## 函数柯里化

函数柯里化就是将 `f(a,b,c)` 调用形式转化为 `f(a)(b)(c)` 调用形式的一种转化方法。柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

1. 提前固定部分参数，生成一个更具体的新函数，避免重复传递相同参数。
2. 根据参数组合生成不同的函数逻辑，增强代码复用性。

```js
// 通用日志函数
const log = (level, message) => console.log(`[${level}] ${message}`)

// 柯里化后生成特定级别的日志函数
const curryLog = curry((level, message) => log(level, message))
const logError = curryLog("ERROR")
const logInfo = curryLog("INFO")

logError("Connection failed") // [ERROR] Connection failed
logInfo("User logged in") // [INFO] User logged in

// 动态生成折扣计算函数
const applyDiscount = curry((discount, price) => price * (1 - discount))
const summerSale = applyDiscount(0.2) // 打8折
const blackFriday = applyDiscount(0.3) // 打7折

console.log(summerSale(100)) // 80
```

### 柯里化转化方法

柯里化的核心其实就是把用来的多个参数通过返回一个函数来接受原来的参数来达到减少入参的目的，一个简易版柯里化转化方法如下：

```js
function curry(fn) {
  return function curried(...args1) {
    if (args1.length >= fn.length) {
      return fn.apply(this, args1)
    } else {
      return function (...args2) {
        return curried.apply(this, args1.concat(args2))
      }
    }
  }
}

const curry = (fn, ...args1) => {
  if (args1.length >= fn.length) {
    return fn(...args1)
  } else {
    return (...args2) => curry(fn, ...args1, ...args2)
  }
}
```

### 柯里化的应用

Vue3 源码中关于生命周期的逻辑中有对于函数柯里化的应用，`createHook` 方法最终实际上调用了 `injectHook` 方法，但是为了固定参数避免每次都传用户回调函数和组件实例，用了函数柯里化的技巧将参数固定，只需传入生命周期名字即可。然后这些生命周期函数作为对外的 API 供开发者调用：

```ts
export const createHook =
  <T extends Function = () => any>(lifecycle: LifecycleHooks) =>
  (hook: T, target: ComponentInternalInstance | null = currentInstance) =>
    // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
    (!isInSSRComponentSetup || lifecycle === LifecycleHooks.SERVER_PREFETCH) &&
    injectHook(lifecycle, (...args: unknown[]) => hook(...args), target)

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
export const onMounted = createHook(LifecycleHooks.MOUNTED)
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE)
export const onUpdated = createHook(LifecycleHooks.UPDATED)
export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT)
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED)
export const onServerPrefetch = createHook(LifecycleHooks.SERVER_PREFETCH)
```

## 高阶函数

高阶函数是对其他函数进行操作的函数，操作可以是将它们作为参数，或者是返回它们。 简单来说，高阶函数是一个接收**函数作为参数**或将**函数作为输出**返回的函数。

例如，`Array.prototype.map()`，`Array.prototype.filter()`，`Array.prototype.sort()` 和 `Array.prototype.reduce()` 是语言中内置的一些高阶函数。

```js
const mozart = (numbers) =>
  numbers
    .filter((n) => n % 2 === 0)
    .map((n) => n * 2)
    .reduce((a, b) => a + b, 0)

mozart([1, 2, 3, 4, 5]) // 12
```

## 参考资料

[学习 JavaScript 函数式编程](https://www.youtube.com/watch?v=e-5obm1G_FY)

[An introduction to functional programming](https://codewords.recurse.com/issues/one/an-introduction-to-functional-programming)

[JAVASCRIPT FUNCTION COMPOSITION: WHAT’S THE BIG DEAL?](https://jrsinclair.com/articles/2022/javascript-function-composition-whats-the-big-deal/)

[HOW TO COMPOSE JAVASCRIPT FUNCTIONS THAT TAKE MULTIPLE PARAMETERS (THE EPIC GUIDE)](https://jrsinclair.com/articles/2024/how-to-compose-functions-that-take-multiple-parameters-epic-guide/)

[unleash-javascripts-potential-with-functional-programming](https://janhesters.com/blog/unleash-javascripts-potential-with-functional-programming)

[JavaScript 专题之函数记忆](https://juejin.cn/post/6844903494256705543)

[JavaScript 专题之函数组合](https://juejin.cn/post/6844903493740789774)

[JavaScript 专题之函数柯里化](https://juejin.cn/post/6844903490771222542)
