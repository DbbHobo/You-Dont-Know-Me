# Number

## JavaScript中的数字

`JavaScript` 中的数字类型是基于 `IEEE 754` 标准来实现的，该标准通常也被称为“浮点数”。 `JavaScript` 使用的是“双精度”格式（即 **64 位二进制**）。

`JavaScript` 中的数字常量一般用十进制表示。例如：

```js
var a = 42;
var b = 42.3;
```

数字前面的 0 可以省略：

```js
var a = 0.42;
var b = .42;
```

小数点后小数部分最后面的 0 也可以省略：

```js
var a = 42.0;
var b = 42.;
```

默认情况下大部分数字都以十进制显示，小数部分最后面的 0 被省略，如：

```js
var a = 42.300;
var b = 42.0;
a; // 42.3
b; // 42
```

特别大和特别小的数字默认用指数格式显示，与 `toExponential()` 函数的输出结果相同。例如：

```js
var a = 5E10;
a; // 50000000000
a.toExponential(); // "5e+10"
var b = a * a;
b; // 2.5e+21
var c = 1 / a;
c; // 2e-11
```

数字常量还可以用其他格式来表示，如二进制、八进制和十六进制：

```js
0o363; // 243的八进制
0O363; // 同上
0b11110011; // 243的二进制
0B11110011; // 同上
// 考虑到代码的易读性，不推荐使用 0O363 格式，因为 0 和大写字母 O 在一起容易混淆。建议尽量使用小写的 0x、 0b 和 0o
```

## 浮点数会出现的精度问题

二进制浮点数最大的问题（不仅 JavaScript，所有遵循 IEEE 754 规范的语言都是如此），是会出现如下情况：

```js
0.1 + 0.2 === 0.3; // false
```

### IEEE754

在 IEEE754 中，规定了四种表示浮点数值的方式：单精确度（32位）、双精确度（64位）、延伸单精确度、与延伸双精确度。像 ECMAScript 采用的就是双精确度，也就是说，会用 64 位来储存一个浮点数。

这个标准认为，一个浮点数 (Value) 可以这样表示：

`Value = sign * exponent * fraction`

比如 -1020，用科学计数法表示就是:

`-1 * 10^3 * 1.02`

比如 0.1 的二进制 0.00011001100110011…… 这个数来说可以表示为：

`1 * 2^-4 * 1.1001100110011……`

其中 `sign` 就是 1，`exponent` 就是 2^-4，`fraction` 就是 1.1001100110011……

而当只做二进制科学计数法的表示时，这个 Value 的表示可以再具体一点变成：

`V = (-1)^S * (1 + Fraction) * 2^E`

如果所有的浮点数都可以这样表示，那么我们存储的时候就把这其中会变化的一些值存储起来就好了。在 IEEE 754 标准下我们这样存储：

- 用 1 位存储 S，0 表示正数，1 表示负数
- 用 11 位存储 E + bias，对于 11 位来说，bias 的值是 2^(11-1) - 1，也就是 1023
- 用 52 位存储 Fraction

所以当 0.1 存下来的时候，就已经发生了精度丢失，当我们用浮点数进行运算的时候，使用的其实是精度丢失后的数。0.1 对应 64 位的完整表示就是：

0 01111111011 1001100110011001100110011001100110011001100110011010

### 精度处理方法

问题是，如果一些数字无法做到完全精确，是否意味着数字类型毫无用处呢？答案当然是否定的。在处理带有小数的数字时需要特别注意。很多（也许是绝大多数）程序只需要处理整数，最大不超过百万或者万亿，此时使用 `JavaScript` 的数字类型是绝对安全的。那么应该怎样来判断 0.1 + 0.2 和 0.3 是否相等呢？

最常见的方法是设置一个误差范围值，通常称为“机器精度”（machine epsilon），对 `JavaScript` 的数字来说，这个值通常是 **2^-52 (2.220446049250313e-16)**。从 ES6 开始，该值定义在 `Number.EPSILON` 中，我们可以直接拿来用，也可以为 ES6 之前的版本写 polyfill：

```js
if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2,-52);
}
```

可以使用 `Number.EPSILON` 来比较两个数字是否相等（在指定的误差范围内）：

```js
function numbersCloseEnoughToEqual(n1,n2) {
return Math.abs( n1 - n2 ) < Number.EPSILON;
}
var a = 0.1 + 0.2;
var b = 0.3;
numbersCloseEnoughToEqual( a, b ); // true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 ); // false
```

能够呈现的最大浮点数大约是 **1.798e+308**（这是一个相当大的数字），它定义在 `Number.MAX_VALUE` 中。最小浮点数定义在 `Number.MIN_VALUE` 中，大约是 **5e-324**，它不是负数，但无限接近于 0。

## Number的静态属性和方法

### Number.EPSILON

两个可表示 (representable) 数之间的最小间隔。

### Number.MAX_SAFE_INTEGER

JavaScript 中最大的安全整数 (2^53 - 1)。

### Number.MAX_VALUE

能表示的最大正数。最小的负数是 -MAX_VALUE。

### Number.MIN_SAFE_INTEGER

JavaScript 中最小的安全整数 (-(2^53 - 1)).

### Number.MIN_VALUE

能表示的最小正数即最接近 0 的正数 (实际上不会变成 0)。最大的负数是 -MIN_VALUE。

### Number.NaN

特殊的“非数字”值。

### Number.NEGATIVE_INFINITY

特殊的负无穷大值，在溢出时返回该值。

### Number.POSITIVE_INFINITY

特殊的正无穷大值，在溢出时返回该值。

### Number.isNaN()

确定传递的值是否是 NaN。

### Number.isFinite()

确定传递的值类型及本身是否是有限数。

### Number.isInteger()

确定传递的值类型是“number”，且是整数。

### Number.isSafeInteger()

确定传递的值是否为安全整数 ( -(2^53 - 1) 至 2^53 - 1) 之间。
### Number.parseFloat()

和全局对象 parseFloat() 一样。

### Number.parseInt()

和全局对象 parseInt() 一样。

---

## Number的实例方法

由于数字值可以使用 `Number` 对象进行封装，因此数字值可以调用 `Number.prototype` 上的方法

### Number.prototype.toExponential(fractionDigits)

返回使用指数表示法表示数字的字符串。

### Number.prototype.toFixed(digits)

返回使用定点表示法表示数字的字符串。

### Number.prototype.toLocaleString([locales [, options]])

返回数字在特定语言环境下表示的字符串。覆盖 Object.prototype.toLocaleString() 方法。

### Number.prototype.toPrecision(precision)

返回数字使用定点表示法或指数表示法至指定精度的字符串。

### Number.prototype.toString([radix])

返回一个代表给定对象的字符串，基于指定的基数。覆盖 Object.prototype.toString() 方法。

### Number.prototype.valueOf()

返回指定对象的原始值。覆盖 Object.prototype.valueOf() 方法。

## 参考资料

[Number-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)

[JavaScript 深入之浮点数精度](https://github.com/mqyqingfeng/Blog/issues/155)