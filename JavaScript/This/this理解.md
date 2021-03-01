## this

### 背景

JavaScript 允许在函数体内部，引用当前环境的其他变量。

```js
var f = function () {
  console.log(x);
};
```

上面代码中，函数体里面使用了变量 x。该变量由运行环境提供。

现在问题就来了，由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。所以，this 就出现了，它的设计目的就是**在函数体内部，指代函数当前的运行环境**。

上面代码中，函数体里面的 this.x 就是指当前运行环境的 x。

### 理解 this

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
```

- 独立函数调用

时刻记住，引用数据类型的值是按引用访问的。

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

var i = 0;
const o = {
  i: 1,
  fn: function () {
    console.log(this.i);
  },
};
setTimeout(o.fn, 1000); // 0
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

基本的判断流程

1. 函数是否在 new 中调用（new 绑定） ？ 如果是的话 this 绑定的是新创建的对象。
2. 函数是否通过 call、 apply（显式绑定） 或者硬绑定调用？ 如果是的话， this 绑定的是指定的对象。
3. 函数是否在某个上下文对象中调用（隐式绑定） ？ 如果是的话， this 绑定的是那个上下文对象。
4. 如果都不是的话， 使用默认绑定。 如果在严格模式下， 就绑定到 undefined， 否则绑定到全局对象。

### call apply bind

- Function.prototype.call

本质 Function.prototype.call。call() 提供新的 this 值给当前调用的函数/方法。你可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承它，而不是在新对象中再写一次这个方法。

- Function.prototype.apply

本质 Function.prototype.apply。apply() 与 call() 非常相似，不同之处在于提供参数的方式。apply 使用参数**数组**而不是一组参数列表。

- Function.prototype.bind

本质 Function.prototype.bind。bind() 可以创建一个函数，不论怎么调用，这个函数都有同样的 this 值。

[JavaScript 的 this 原理](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)

[this-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

[Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

[Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

[Function.prototype.bind()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
