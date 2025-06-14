# this

## 背景

JavaScript 允许在函数体内部，引用当前环境的其他变量。

```js
let f = function () {
  console.log(x)
  console.log(this.x)
}
```

上面代码中，函数体里面使用了变量 x，该变量由运行环境提供，函数体里面的 `this.x` 就是指当前运行环境的 x。

现在问题就来了，由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（`context`）。所以，`this` 就出现了，它的设计目的就是**在函数体内部，指代函数当前的运行环境**。

决定 `this` 值的关键并非代码书写方式，而是**函数的调用方式**——这意味着函数内部的 `this` 在每次调用时都可能不同。要真正理解这一点，我们必须从 JavaScript 执行函数的视角（而非开发者在键盘前编写函数的视角）来思考。

## 理解 this 指向

要理解 JavaScript 中的 `this` 其实也很简单，按接下来几种方式去解析理解会发现 `this` 其实很简单。`new` 的方式优先级最高，接下来是 `call`/`apply`/`bind` 这些函数，然后是 `obj.foo()` 这种对象的方法调用方式，最后是 `foo` 这种直接函数调用方式，同时，箭头函数的 `this` 一旦被绑定，就不会再被任何方式所改变。

`this` 是在**运行时**进行绑定的，并不是在编写时绑定，它的上下文取决于**函数调用**时的各种条件。`this` 的绑定和函数声明的位置没有任何关系， 取决于函数的调用方式。分析 `this` 指向最重要的是要分析调用栈（就是为了到达当前执行位置所调用的所有函数）。

### new 绑定

```js
function foo(a) {
  this.a = a
}
var bar = new foo(2)
console.log(bar.a) // 2
// 使用 new 来调用 foo(..) 时， 我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。
```

### 独立函数调用

直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。

```js
function foo() {
  console.log(this.a)
}
var a = 2
foo() // 2
```

### 隐式绑定

隐式绑定需要观察调用位置是否有上下文对象， 或者说是否被某个对象拥有或者包含。

```js
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo,
}
obj.foo() // 2

// 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。
function foo() {
  console.log(this.a)
}
var obj2 = {
  a: 42,
  foo: foo,
}
var obj1 = {
  a: 2,
  obj2: obj2,
}
obj1.obj2.foo() // 42

// 虽然 bar 是 obj.foo 的一个引用， 但是实际上， 它引用的是 foo 函数本身， 因此此时的
// bar() 其实是一个不带任何修饰的函数调用， 因此应用了默认绑定。
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
  foo: foo,
}
var bar = obj.foo // 函数别名！
var a = "oops, global" // a 是全局对象的属性
bar() // "oops, global"

// 参数传递其实就是一种隐式赋值， 因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。
function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  // fn 其实引用的是 foo
  fn() // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo,
}
var a = "oops, global" // a 是全局对象的属性
doFoo(obj.foo) // "oops, global"

var i = 0
const o = {
  i: 1,
  fn: function () {
    console.log(this.i)
  },
}
setTimeout(o.fn, 1000) // 0
```

### 显式绑定

`call`/`apply`/`bind`

```js
function foo() {
  console.log(this.a)
}
var obj = {
  a: 2,
}
var bar = function () {
  foo.call(obj)
}
bar() // 2
setTimeout(bar, 100) // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window) // 2

function foo(el) {
  console.log(el, this.id)
}
var obj = {
  id: "awesome",
}
// 调用 foo(..) 时把 this 绑定到 obj,forEach第二个参数指定this的指向
;[1, 2, 3].forEach(foo, obj)
// 1 awesome 2 awesome 3 awesome
```

### 箭头函数

箭头函数不使用 `this` 的四种标准规则，而是根据外层(函数或者全局)作用域来决定 `this`。箭头函数的绑定无法被修改。`new` 也不行！箭头函数没有自己的 `this`，它会捕获定义时所在外层（非箭头）函数或全局作用域的 `this` 值，并固定不变。

```js
function Outer() {
  this.name = "outer"

  return {
    name: "inner",
    normalFunc: function () {
      console.log(this.name)
    },
    arrowFunc: () => {
      console.log(this.name)
    },
  }
}

const obj = Outer()
obj.normalFunc() // 'inner' normalFunc 的 this 是谁调用它就是谁，这里是 obj，所以是 inner。
obj.arrowFunc() // 'outer'  arrowFunc 的 this 在 Outer 中定义时就绑定为 Outer 中的 this，即 outer。

class Timer {
  constructor() {
    this.seconds = 0
  }
  start() {
    setInterval(() => {
      this.seconds++
      console.log(this.seconds) // this 是 Timer 实例
    }, 1000)
  }
}
```

### 事件回调函数

在事件处理器的回调函数内部（非箭头函数），`this` 引用的是与该处理器关联的元素。

```js
document.querySelector("button").addEventListener("click", function (event) {
  console.log(this)
  // result: <button class="btn">
})

// 此例是改变实践回调函数this指向的例子
const button = document.querySelector("button")

const theObject = {
  theValue: true,
}

function handleClick() {
  console.log(this)
}

button.addEventListener("click", handleClick.bind(theObject))
// result: Object { theValue: true }

// 事件回调函数如果是箭头函数
let button = document.querySelector("button")

button.addEventListener("click", (event) => {
  console.log(this)
})
// result: Window { … }
```

### 基本的判断流程

1. 函数是否在 `new` 中调用 ？ 如果是的话 `this` 绑定的是新创建的对象。
2. 函数是否通过 `call`、 `apply`（显式绑定）或者硬绑定`bind`调用 ？ 如果是的话，`this` 绑定的是指定的对象。
3. 函数是否在某个上下文对象中调用（隐式绑定） ？ 如果是的话，`this` 绑定的是那个上下文对象。
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 `undefined`，否则绑定到全局对象。

```js
function foo() {
  return (a) => {
    //this 继承自 foo()
    console.log(this.a)
  }
}
let obj1 = {
  a: 2,
}
let obj2 = {
  a: 3,
}
let bar = foo.call(obj1)
bar.call(obj2) // 2, 不是 3 ！因为箭头函数的绑定无法被修改
```

## call apply bind

### `Function.prototype.call`

本质 `Function.prototype.call`。`call()` 提供新的 `this` 值给当前调用的函数/方法。你可以使用 `call` 来实现继承：写一个方法，然后让另外一个新的对象来继承它，而不是在新对象中再写一次这个方法。

```js
var employee1 = { firstName: "John", lastName: "Rodson" }
var employee2 = { firstName: "Jimmy", lastName: "Baily" }

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  )
}

invite.call(employee1, "Hello", "How are you?") // Hello John Rodson, How are you?
invite.call(employee2, "Hello", "How are you?") // Hello Jimmy Baily, How are you?
```

### `Function.prototype.apply`

本质 `Function.prototype.apply`。`apply()` 与 `call()` 非常相似，不同之处在于提供参数的方式。`apply()` 使用参数**数组**而不是一组参数列表。

```js
var employee1 = { firstName: "John", lastName: "Rodson" }
var employee2 = { firstName: "Jimmy", lastName: "Baily" }

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  )
}

invite.apply(employee1, ["Hello", "How are you?"]) // Hello John Rodson, How are you?
invite.apply(employee2, ["Hello", "How are you?"]) // Hello Jimmy Baily, How are you?
```

### `Function.prototype.bind`

本质 `Function.prototype.bind`。`bind()` 可以创建一个函数，不论怎么调用，这个函数都有同样的 `this` 值。

```js
var employee1 = { firstName: "John", lastName: "Rodson" }
var employee2 = { firstName: "Jimmy", lastName: "Baily" }

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  )
}

var inviteEmployee1 = invite.bind(employee1)
var inviteEmployee2 = invite.bind(employee2)
inviteEmployee1("Hello", "How are you?") // Hello John Rodson, How are you?
inviteEmployee2("Hello", "How are you?") // Hello Jimmy Baily, How are you?
```

### 模拟 call、apply、bind 实现

```js
Function.prototype.fakeCall = function (context = window, ...args) {
  context.fn = this
  console.log(context)
  let res = context.fn(...args)
  delete context.fn
  return res
}

Function.prototype.fakeApply = function (context = window, args) {
  context.fn = this
  console.log(context)
  let res = context.fn(...args)
  delete context.fn
  return res
}

Function.prototype.fakeBind = function (context, ...args1) {
  let originalFn = this // 原函数

  let fn = function (...args2) {
    let finalArgs = args1.concat(args2) // 合并参数

    // 判断是否通过 new 调用
    if (this instanceof fn) {
      // 创建新实例，其原型指向原函数的原型
      let instance = Object.create(originalFn.prototype)
      // 调用原函数，this 指向新实例
      let result = originalFn.apply(instance, finalArgs)
      // 返回对象或函数则直接返回，否则返回新实例
      return (typeof result === "object" && result !== null) ||
        typeof result === "function"
        ? result
        : instance
    } else {
      // 普通调用，使用绑定的 context
      return originalFn.apply(context, finalArgs)
    }
  }

  return fn
}

let callText = "Im from global!"
let callTestObj1 = {
  callText: "Im from call111!",
}
let callTestObj2 = {
  callText: "Im from call222!",
}
let callTestObj3 = {
  callText: "Im from call333!",
}
const callTestFn = function (...args) {
  console.log(this.callText, ...args)
}
callTestFn.fakeCall(callTestObj1, "next1", "next2")
callTestFn.fakeApply(callTestObj2, ["next3", "next4"])
let bindFn = callTestFn.fakeBind(callTestObj3, ["next5", "next6"])
bindFn()

// {callText: "Im from call111!", fn: ƒ}
// Im from call111! next1 next2
// {callText: "Im from call222!", fn: ƒ}
// Im from call222! next3 next4
// Im from call333!["next5", "next6"]
```

## 参考资料

[JavaScript 的 this 原理](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)

[this-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

[Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

[Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

[深度解析 call 和 apply 原理、使用场景及实现](https://github.com/yygmind/blog/issues/22)

[深度解析 bind 原理、使用场景及模拟实现](https://github.com/yygmind/blog/issues/23)

[You Don't Know JS Yet](https://github.com/getify/You-Dont-Know-JS)

[JavaScript, when is this?](https://piccalil.li/blog/javascript-when-is-this/)

[JavaScript, what is this?](https://piccalil.li/blog/javascript-what-is-this/)
