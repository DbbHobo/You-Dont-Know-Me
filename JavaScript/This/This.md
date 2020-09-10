## this

- 背景

JavaScript 允许在函数体内部，引用当前环境的其他变量。

```js
var f = function () {
  console.log(x);
};
```

上面代码中，函数体里面使用了变量 x。该变量由运行环境提供。

现在问题就来了，由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。所以，this 就出现了，它的设计目的就是**在函数体内部，指代函数当前的运行环境**。

```
var f = function () {
  console.log(this.x);
}
```

上面代码中，函数体里面的 this.x 就是指当前运行环境的 x。

- 理解 this

JavaScript 中有个神秘的 this，要理解 this 其实也很简单，按接下来几种方式去解析理解会发现 this 其实很简单。new 的方式优先级最高，接下来是 call/apply/bind 这些函数，然后是 obj.foo() 这种对象的方法调用方式，最后是 foo 这种直接函数调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。

this 是在**运行时**进行绑定的， 并不是在编写时绑定， 它的上下文取决于**函数调用**时的各种条件。 this 的绑定和函数声明的位置没有任何关系， 取决于函数的调用方式。

- new 绑定

```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 2
// 使用 new 来调用 foo(..) 时， 我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。

var i = 0;
const o = {
  i: 1,
  fn: function () {
    console.log(this.i);
  },
};
setTimeout(o.fn, 1000); // 0
```

- 独立函数调用

```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

- 隐式绑定

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
obj.foo(); // 2

// 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo,
};
var obj1 = {
  a: 2,
  obj2: obj2,
};
obj1.obj2.foo(); // 42

// 虽然 bar 是 obj.foo 的一个引用， 但是实际上， 它引用的是 foo 函数本身， 因此此时的
// bar() 其实是一个不带任何修饰的函数调用， 因此应用了默认绑定。
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo,
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"

// 参数传递其实就是一种隐式赋值， 因此我们传入函数时也会被隐式赋值， 所以结果和上一个例子一样。
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  // fn 其实引用的是 foo
  fn(); // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo,
};
var a = "oops, global"; // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"
```

- 显式绑定

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
};
var bar = function () {
  foo.call(obj);
};
bar(); // 2
setTimeout(bar, 100); // 2
// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2

function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome",
};
// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach(foo, obj);
// 1 awesome 2 awesome 3 awesome
```

## call apply bind

- Function.prototype.call

本质 Function.prototype.call

- Function.prototype.apply

本质 Function.prototype.apply

- Function.prototype.bind

[JavaScript 的 this 原理](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)

[this-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
