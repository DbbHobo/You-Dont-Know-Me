# JS 中的类型转换

类型转换（Type conversion/typecasting）是指将数据由一种类型变换为另一种类型。在编译器（对于编译语言）或运行时（像 JavaScript 等脚本语言）自动转换数据类型时，会发生隐式转换。你也可以在源码中显式要求进行转换。

JavaScript 对象转换成基本类型值是一个称为“类型转换”或“强制转换”的过程。这种转换通常发生在以下情况下：

表达式中需要基本类型值：当您使用一个对象作为表达式的一部分，例如进行算术运算或字符串拼接时，JavaScript 将尝试将对象转换为基本类型值。

使用特定的强制类型转换函数：JavaScript 提供了一些函数，如parseInt()、parseFloat()和String()，可以将对象显式转换为基本类型值。

## 基本类型值转布尔值

在 `JavaScript` 中，只有 6 种值可以被转换成 `false`，其他都会被转换成 `true`。

```js
console.log(Boolean()) // false
console.log(Boolean(false)) // false
console.log(Boolean(undefined)) // false
console.log(Boolean(null)) // false
console.log(Boolean(+0)) // false
console.log(Boolean(-0)) // false
console.log(Boolean(NaN)) // false
console.log(Boolean("")) // false
```

## 基本类型转数字

根据规范，如果 `Number` 函数不传参数，返回 `+0`，如果有参数，调用 `ToNumber(value)`。注意这个 `ToNumber` 表示的是一个底层规范实现上的方法，并没有直接暴露出来。

```js
console.log(Number()) // +0

console.log(Number(undefined)) // NaN
console.log(Number(null)) // +0

console.log(Number(false)) // +0
console.log(Number(true)) // 1

console.log(Number("123")) // 123
console.log(Number("-123")) // -123
console.log(Number("1.2")) // 1.2
console.log(Number("000123")) // 123
console.log(Number("-000123")) // -123

console.log(Number("0x11")) // 17

console.log(Number("")) // 0
console.log(Number(" ")) // 0

console.log(Number("123 123")) // NaN
console.log(Number("foo")) // NaN
console.log(Number("100a")) // NaN
```

如果通过 `Number` 转换函数传入一个字符串，它会试图将其转换成一个整数或浮点数，而且会忽略所有前导的 0，如果有一个字符不是数字，结果都会返回 `NaN`。

## 基本类型转字符串

如果 `String` 函数不传参数，返回空字符串，如果有参数，调用 `ToString(value)`。同样的 `ToString` 表示的是一个底层规范实现上的方法，并没有直接暴露出来。

```js
console.log(String()) // 空字符串

console.log(String(undefined)) // undefined
console.log(String(null)) // null

console.log(String(false)) // false
console.log(String(true)) // true

console.log(String(0)) // 0
console.log(String(-0)) // 0
console.log(String(NaN)) // NaN
console.log(String(Infinity)) // Infinity
console.log(String(-Infinity)) // -Infinity
console.log(String(1)) // 1
```

## 对象转基本类型值

对象到字符串和对象到数字的转换都是通过调用待转换对象的一个方法来完成的。而 `JavaScript` 对象有两个不同的方法来执行转换，一个是 `toString`，一个是 `valueOf`。注意这个跟上面所说的 `ToString` 和 `ToNumber` 是不同的，这两个方法是真实暴露出来的方法。对象在转换基本类型时，首先会调用 `valueOf` 然后调用 `toString`。

在对象转换成基本类型值的过程中，JavaScript 遵循一组规则，通常会按照以下顺序进行尝试：

1. `ToPrimitive` 抽象操作：JavaScript 首先尝试使用 `ToPrimitive` 抽象操作将对象转换为基本类型值。这个抽象操作会尝试调用对象的 `valueOf()` 和 `toString()` 方法来获取基本类型值。如果对象具有 `valueOf()` 方法，则首先调用它，然后再调用 `toString()` 方法。如果这两个方法都不存在或者返回的不是基本类型值，那么会引发类型错误。

2. 隐式强制转换：如果上述步骤未能成功转换对象为基本类型值，JavaScript 将尝试进行隐式强制转换。这通常发生在算术运算、比较运算和字符串拼接等情况下。在这种情况下，JavaScript 会尝试自动将对象转换为基本类型值，具体转换规则取决于操作符和操作数的类型。

### ToPrimitive

`ToPrimitive` 方法，其实就是输入一个值，然后返回一个一定是基本类型的值。当用 `String` 方法转化一个值的时候，如果是基本类型，就参照 “原始值转字符”，如果不是基本类型，我们会将调用一个 `ToPrimitive` 方法，将其转为基本类型，然后再参照 “原始值转字符” 相应的进行转换。

如果是 `ToPrimitive(obj, Number)`，处理步骤如下：

1. 如果 `obj` 为基本类型，直接返回
2. 否则，调用 `valueOf` 方法，如果返回一个原始值，则将其返回。
3. 否则，调用 `toString` 方法，如果返回一个原始值，则将其返回。
4. 否则，抛出一个类型错误异常。

如果是 `ToPrimitive(obj, String)`，处理步骤如下：

1. 如果 `obj` 为基本类型，直接返回
2. 否则，调用 `toString` 方法，如果返回一个原始值，则将其返回。
3. 否则，调用 `valueOf` 方法，如果返回一个原始值，则将其返回。
4. 否则，抛出一个类型错误异常。

### valueOf

另一个转换对象的函数是 `valueOf`，表示对象的原始值。默认的 `valueOf` 方法返回这个对象本身，数组、函数、正则简单的继承了这个默认方法，也会返回**对象本身**。日期是一个例外，它会返回它的一个内容表示: 1970 年 1 月 1 日以来的毫秒数。

```js
let date = new Date(2023, 4, 22);
console.log(date.valueOf()) // 1684684800000
```

### toString

所有的对象除了 `null` 和 `undefined` 之外的任何值对象都具有 `toString` 方法，通常情况下，它和使用 `String` 方法返回的结果一致。`toString` 方法的作用在于返回一个反映这个对象的字符串。

- `Object.prototype.toString`
- `Array.prototype.toString`
- `Function.prototype.toString`
- `Date.prototype.toString`
- `RegExp.prototype.toString`

```js
console.log(({}).toString()) // [object Object]
console.log(Object.prototype.toString.call([])) // [object Array]
console.log(Object.prototype.toString.call(function(){})) // [object Function]
console.log(Object.prototype.toString.call(new Date())) // [object Date]
console.log(Object.prototype.toString.call(/\d+/g)) // [object RegExp]

console.log([].toString()) // ""
console.log([0].toString()) // 0
console.log([1, 2, 3].toString()) // 1,2,3
console.log((function(){var a = 1;}).toString()) // function (){var a = 1;}
console.log((/\d+/g).toString()) // /\d+/g
console.log((new Date(2010, 0, 1)).toString()) // Fri Jan 01 2010 00:00:00 GMT+0800 (CST)
```

## 四则运算符

我们在对各种非 `Number` 类型运用数学运算符(`-` `*` `/`)时，会先将非 `Number` 类型转换为 `Number` 类型，加法运算符不同于其他几个运算符，执行`+`操作符时：

- 当一侧为 `String` 类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型（`ToString`）。
- 当一侧为 `Number` 类型，另一侧为基本类型，则将基本类型转换为 `Number` 类型（`ToNumber`）。
- 当一侧为 `Number` 类型，另一侧为引用类型，将引用类型和 `Number` 类型转换成字符串后拼接（`ToString`）。

## 比较运算符

使用`==`时，若两侧类型相同，则比较结果和`===`相同，否则会发生隐式转换，使用`==`时发生的转换可以分为几种不同的情况，只考虑两侧类型不同：

- `NaN`

`NaN` 和其他任何类型比较永远返回 `false` (包括和他自己)。

- `Boolean`

`Boolean` 和其他任何类型比较，`Boolean` 首先被转换为 `Number` 类型。

```js
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false
```

这里注意一个可能会弄混的点：`undefined`、`null` 和 `Boolean`  比较，虽然 `undefined`、`null` 和 `false` 都很容易被想象成假值，但是他们比较结果是 `false`，原因是 `false` 首先被转换成 0：

```js
undefined == false // false
null == false // false
```

- `String` 和 `Number`

`String` 和 `Number` 比较，先将 `String` 转换为 `Number` 类型。

```js
123 == '123' // true
'' == 0 // true
```

- `null` 和 `undefined`

`null` == `undefined` 比较结果是 `true`，除此之外，`null`、`undefined` 和其他任何结果的比较值都为 `false`。

```js
null == undefined // true
null == '' // false
null == 0 // false
null == false // false
undefined == '' // false
undefined == 0 // false
undefined == false // false
```

- 如果是对象，就通过 `ToPrimitive` 转换对象
- 如果是字符串，就通过 `unicode` 字符索引来比较

```js
console.log([] == ![]); //true
console.log(false == []); //true
```

## 参考资料

[JavaScript 深入之头疼的类型转换(上)](https://github.com/mqyqingfeng/Blog/issues/159)

[JavaScript 深入之头疼的类型转换(上)](https://github.com/mqyqingfeng/Blog/issues/159)
