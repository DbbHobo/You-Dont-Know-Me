## 函数式编程
函数式编程是一种编程范式，主要是利用函数把运算过程包装起来，我们想实现一个复杂的功能时，可以通过组合各种函数来计算结果。

### 纯函数
纯函数他有三个特点，一是没有副作用，二是引用透明，三是数据不可变。
- 没有副作用就是指函数本身不依赖于且不会修改外部的数据。
- 引用透明就是指输入相同的参数永远会得到相同的输出，简单的说函数的返回值只受输入的影响。
- 数据不可变主要是针对类型引用数据类型的入参，如果以一定要修改，最好的方式就是重新去生成一份数据。

```js
const add = (a,b) => a + b;
```

### 函数的合成
如果一个值要经过多个函数，才能变成另外一个值，就可以把所有中间步骤合并成一个函数，这叫做"函数的合成"（compose）。
- compose 的参数是函数，返回的也是一个函数。
- 除了初始函数（最右侧的一个）外，其他函数的接收参数都是一个函数的返回值，所以初始函数的参数可以是多元的，而其他函数的接收值是一元的。
- compose 函数可以接收任意的参数，所有的参数都是函数，且执行方向为自右向左。初始函数一定要放到参数的最右侧。
```js
const compose = function (f, g) {
  return function (x) {
    return f(g(x));
  };
}
```

### 函数柯里化
函数柯里化就是将 f(a,b,c) 调用形式转化为 f(a)(b)(c) 调用形式的一种转化方法。

```js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```

### 高阶函数
高阶函数是对其他函数进行操作的函数，操作可以是将它们作为参数，或者是返回它们。 简单来说，高阶函数是一个接收**函数作为参数**或将**函数作为输出**返回的函数。

例如，`Array.prototype.map`，`Array.prototype.filter` 和 `Array.prototype.reduce` 是语言中内置的一些高阶函数。


[学习JavaScript函数式编程](https://www.youtube.com/watch?v=e-5obm1G_FY)