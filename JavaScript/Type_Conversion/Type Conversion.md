# JS 中的类型转换

类型转换（Type conversion/typecasting）是指将数据由一种类型变换为另一种类型。在编译器（对于编译语言）或运行时（像 JavaScript 等脚本语言）自动转换数据类型时，会发生隐式转换。你也可以在源码中显式要求进行转换。

JavaScript 对象转换成基本类型值是一个称为“类型转换”或“强制转换”的过程。这种转换通常发生在以下情况下：

表达式中需要基本类型值：当您使用一个对象作为表达式的一部分，例如进行算术运算或字符串拼接时，JavaScript 将尝试将对象转换为基本类型值。

使用特定的强制类型转换函数：JavaScript 提供了一些函数，如`parseInt()`、`parseFloat()`和`String()`，可以将对象显式转换为基本类型值。

## 基本类型值转布尔值[Boolean()]

在 `JavaScript` 中，只有以下几种值可以被 `Boolean()` 转换成 `false`，其他都会被转换成 `true`。

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

## 基本类型转数字[Number()]

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

## 基本类型转字符串[String()]

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

对象到字符串和对象到数字的转换都是通过调用待转换对象的一个方法来完成的。而 `JavaScript` 对象有两个不同的方法来执行转换，一个是 `valueOf`，一个是 `toString`。注意这个跟上面所说的 `ToString` 和 `ToNumber` 是不同的，这两个方法是真实暴露出来的方法。对象在转换基本类型时，首先会调用 `valueOf` 然后调用 `toString`。

在对象转换成基本类型值的过程中，JavaScript 遵循一组规则，通常会按照以下顺序进行尝试：

1. `ToPrimitive` 操作：JavaScript 首先尝试使用 `ToPrimitive` 操作将对象转换为基本类型值。这个操作会尝试调用对象的 `valueOf()` 和 `toString()` 方法来获取基本类型值。如果对象具有 `valueOf()` 方法，则首先调用它，然后再调用 `toString()` 方法。如果这两个方法都不存在或者返回的不是基本类型值，那么会引发类型错误。

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

当对象需要参与数学运算时（如加减乘除），会优先调用 `valueOf`。

如果 `valueOf` 返回的是原始值，则该值会被使用；否则，JavaScript 会尝试调用 `toString`。

- `Object.prototype.valueOf`：将 this 值转换成对象。

```js
let date = new Date(2023, 4, 22)
console.log(date.valueOf()) // 1684684800000
```

### toString

所有的对象除了 `null` 和 `undefined` 之外的任何对象都具有 `toString` 方法，通常情况下，它和使用 `String` 方法返回的结果一致。`toString` 方法的作用在于返回一个反映这个对象的字符串。

- `Object.prototype.toString`：返回一个表示该对象的字符串
- `Array.prototype.toString`：返回一个字符串，表示指定的数组及其元素。
- `Function.prototype.toString`：返回一个表示该函数源码的字符串。
- `Date.prototype.toString`：返回一个字符串，以本地的时区表示该 Date 对象。
- `RegExp.prototype.toString`：返回一个表示该正则表达式的字符串。

```js
console.log({}.toString()) // [object Object]
console.log(Object.prototype.toString.call([])) // [object Array]
console.log(Object.prototype.toString.call(function () {})) // [object Function]
console.log(Object.prototype.toString.call(new Date())) // [object Date]
console.log(Object.prototype.toString.call(/\d+/g)) // [object RegExp]

console.log([].toString()) // ""
console.log([0].toString()) // 0
console.log([1, 2, 3].toString()) // 1,2,3
console.log(
  function () {
    var a = 1
  }.toString()
) // function (){var a = 1;}
console.log(/\d+/g.toString()) // /\d+/g
console.log(new Date(2010, 0, 1).toString()) // Fri Jan 01 2010 00:00:00 GMT+0800 (CST)
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
true == 1 // true
true == "2" // false
true == ["1"] // true
true == ["2"] // false
```

这里注意一个可能会弄混的点：`undefined`、`null` 和 `Boolean` 比较，虽然 `undefined`、`null` 和 `false` 都很容易被想象成假值，但是他们比较结果是 `false`，原因是 `false` 首先被转换成 0：

```js
undefined == false // false
null == false // false
undefined == null // true
```

- `String` 和 `Number`

`String` 和 `Number` 比较，先将 `String` 转换为 `Number` 类型。

```js
123 == "123" // true
"" == 0 // true
```

- `null` 和 `undefined`

`null` == `undefined` 比较结果是 `true`，除此之外，`null`、`undefined` 和其他任何结果的比较值都为 `false`。

```js
null == undefined // true
null == "" // false
null == 0 // false
null == false // false
undefined == "" // false
undefined == 0 // false
undefined == false // false
```

- 如果是对象，就通过 `ToPrimitive` 转换对象
- 如果是字符串，就通过 `unicode` 字符索引来比较

一些特殊情况：

```js
"0" == null // false
"0" == undefined // false
"0" == false // true -- 注意
"0" == NaN // false
"0" == 0 // true
"0" == "" // false
false == null // false
false == undefined // false
false == NaN // false
false == 0 // true -- 注意
false == "" // true -- 注意
false == [] // true -- 注意
false == {} // false
"" == null // false
"" == undefined // false
"" == NaN // false
"" == 0 // true -- 注意
"" == [] // true -- 注意
"" == {} // false
0 == null // false
0 == undefined // false
0 == NaN // false
0 == [] // true -- 注意
0 == {} // false
;[] == ![] //true
false == [] //true
```

## JSON.stringify(value)

1. 检查 `toJSON` 方法（最高优先级），如果 `value` 是对象且定义了 `toJSON` 方法，优先调用该方法，并使用其返回值继续序列化；
2. 基础类型直接转换
   - `null` → `"null"`
   - `number` / `boolean` → 直接转为字符串（如 `1` → `"1"`，`true` → `"true"`）
   - `string` → 添加双引号并转义特殊字符（如 `"a"` → `"\"a\""`）
   - `undefined` / `function` / `symbol` → 在对象属性中会被忽略，在数组中会被转换为 `null`
3. 对象/数组的递归处理，对于对象或数组，递归处理每个属性值；

## 数据类型判断

### typeof

```js
typeof 42 // "number"
typeof "hello" // "string"
typeof true // "boolean"
typeof { name: "Alice" } // "object"
typeof Symbol() // "symbol"
typeof 10n // "bigint"
// 比较特殊的几种typeof判断
typeof function () {} // "function"
typeof NaN // "number" (NaN is a special case of number)
typeof [1, 2, 3] // "object" (arrays are technically objects in JavaScript)
typeof null // "object" (this is a known quirk in JavaScript)
typeof undefined // "undefined"
```

### Object.prototype.toString

```js
// 以下是11种：
let number = 1 // [object Number]
let string = "string" // [object String]
let boolean = true // [object Boolean]
let und = undefined // [object Undefined]
let nu = null // [object Null]
let obj = { foo: 1 } // [object Object]
let array = [1, 2, 3] // [object Array]
let date = new Date() // [object Date]
let error = new Error() // [object Error]
let reg = /a/g // [object RegExp]
let fn = function doSth() {} // [object Function]

function checkType(sth) {
  console.log(Object.prototype.toString.call(sth))
}

console.log(Object.prototype.toString.call(Math)) // [object Math]
console.log(Object.prototype.toString.call(JSON)) // [object JSON]
console.log(Object.prototype.toString.call(arguments)) // [object Arguments]
```

`Vue`源码中的类型判断就是通过`Object.prototype.toString`方法：

```ts
export const objectToString: typeof Object.prototype.toString =
  Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === "[object Object]"

export const isArray: typeof Array.isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === "[object Map]"
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === "[object Set]"

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === "[object Date]"
export const isRegExp = (val: unknown): val is RegExp =>
  toTypeString(val) === "[object RegExp]"
export const isFunction = (val: unknown): val is Function =>
  typeof val === "function"
export const isString = (val: unknown): val is string => typeof val === "string"
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol"
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object"

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  )
}
```

## 总结

### 基本类型数据转换

- `Boolean(value)`
- `String(value)`
- `Number(value)`

### 对象类型数据转换

- `value[Symbol.toPrimitive]()`
- `value.valueOf()`
- `value.toString()`

### 四则运算符隐式转换准则

- 当一侧为 `String` 类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型（`ToString`）。
- 当一侧为 `Number` 类型，另一侧为基本类型，则将基本类型转换为 `Number` 类型（`ToNumber`）。
- 当一侧为 `Number` 类型，另一侧为引用类型，将引用类型和 `Number` 类型转换成字符串后拼接（`ToString`）。

### `==` 比较隐式转换准则

1. 字符串和数字之间的相等比较
   (1) 如果 Type(x) 是数字， Type(y) 是字符串，则返回 x == ToNumber(y) 的结果。
   (2) 如果 Type(x) 是字符串， Type(y) 是数字，则返回 ToNumber(x) == y 的结果。

2. 其他类型和布尔类型之间的相等比较
   (1) 如果 Type(x) 是布尔类型，则返回 ToNumber(x) == y 的结果；
   (2) 如果 Type(y) 是布尔类型，则返回 x == ToNumber(y) 的结果。

3. null 和 undefined 之间的相等比较
   (1) 如果 x 为 null， y 为 undefined，则结果为 true。
   (2) 如果 x 为 undefined， y 为 null，则结果为 true。

4. 对象和非对象之间的相等比较
   (1) 如果 Type(x) 是字符串或数字， Type(y) 是对象，则返回 x == ToPrimitive(y) 的结果；
   (2) 如果 Type(x) 是对象， Type(y) 是字符串或数字，则返回 ToPromitive(x) == y 的结果。

• 如果两边的值中有 true 或者 false，千万不要使用 ==。
• 如果两边的值中有 []、 "" 或者 0，尽量不要使用 ==。

### 将值转换为字符串的常见方法

- `String(value)`
- `value.toString()`
- `'' + value`
- `${value}`

## 参考资料

[JavaScript 深入之头疼的类型转换(上)](https://github.com/mqyqingfeng/Blog/issues/159)

[Re-implementing JavaScript's == in JavaScript](https://evanhahn.com/re-implementing-javascript-double-equals-in-javascript/)

[JavaScript 专题之类型判断(上)](https://juejin.cn/post/6844903485348020237)

[JavaScript 专题之类型判断(下)](https://juejin.cn/post/6844903486317035534)

[Converting values to strings in JavaScript has pitfalls](https://2ality.com/2025/04/stringification-javascript.html)
