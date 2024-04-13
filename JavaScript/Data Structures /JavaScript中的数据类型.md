# JavaScript 中的数据

## 数据类型

JS 中有两大类型：**基本数据类型**和**对象类型**（Object）。

基本数据类型： `null`、`undefined`、`boolean`、`number`、`string`、`symbol`、`bigint`

引用数据类型：普通对象-`Object`、数组对象-`Array`、正则对象-`RegExp`、日期对象-`Date`、数学函数-`Math`、函数对象-`Function`等等

引用数据类型的值是保存在内存中的对象。与其他语言不同， `JavaScript` 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。为此，**引用数据类型的值是按引用访问的**。因此如果对象作为参数传入函数，在函数传参的时候传递的是对象在堆中的内存地址值。

引用数据类型和基本数据类型不同的是，基本数据类型存储的是值，引用数据类型存储的是地址（指针）。

## typeof

`typeof` 对于基本类型，除了 `null` 都可以显示正确的类型

`typeof` 对于对象，除了函数都会显示 `object`

```js
typeof 1; // 'number'
typeof "1"; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，会显示 undefined
typeof null; // ---'object' 历史遗留问题---
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
typeof 9007199887740995n; // 'bigint'
```

`typeof`可以作为安全防范机制，对在浏览器中运行的 `JavaScript` 代码来说还是很有帮助的，因为多个脚本文件会在共享的全局命名空间中加载变量：

```js
// 这样会抛出错误
if (DEBUG) {
  console.log( "Debugging is starting" );
}
// 这样是安全的
if (typeof DEBUG !== "undefined") {
  console.log( "Debugging is starting" );
}
```

## instanceof

`instanceof` 可以正确的判断**对象**的类型，因为内部机制是通过查找原型链，只要处于原型链中，就会返回 true，字面量是无法判断的。

The instanceof operator tests the presence of constructor.prototype in object's prototype chain.

**object** instanceof **constructor**

- `object`-某个实例对象
- `constructor`-某个构造函数

```js
function fakeInstanceOf(left, right) {
  // 获得类型的原型
  let prototype = right.prototype;
  // 获得对象的原型
  left = left.__proto__;
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if (left === null) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}
```

使用 `Object.isPrototypeOf()` 方法同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型。

## Object.prototype.toString

Vue源码中用于判断对象类型就是用 `Object.prototype.toString` 方法，此方法能精准的判断对象到底是什么类型：

```ts
export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'
```

## Symbol.hasInstance

`Symbol.hasInstance` 用于判断某对象是否为某构造器的实例。因此你可以用它自定义 `instanceof` 操作符在某个类上的行为。

```js
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === "string";
  }
}
```

## bigint

在 JS 中，所有的数字都**以双精度 64 位浮点格式**表示，那这会带来什么问题呢？这导致 JS 中的 Number 无法精确表示非常大或者非常小的整数，它会将非常大、小的整数四舍五入，确切地说，JS 中的 Number 类型只能安全地表示-9007199254740991(-(2^53-1))和 9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

要创建 BigInt，只需要在数字末尾加 n 即可。

## 类型转换

在 JS 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

1. 条件判断时，除了 `undefined`，`null`，`false`，`NaN`，`''`，`0`，`-0`，其他所有值都转为 `true` 包括所有对象。

2. 对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

- 如果 Symbol.toPrimitive()方法，优先调用再返回
- 调用 valueOf()，如果转换为原始类型，则返回
- 调用 toString()，如果转换为原始类型，则返回
- 如果都没有返回原始类型，会报错

3. 四则运算

我们在对各种非 `Number` 类型运用数学运算符(- * /)时，会先将非 `Number` 类型转换为 `Number` 类型，加法运算符不同于其他几个运算符，执行+操作符时：

- 当一侧为String类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。
- 当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型。
- 当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后拼接。

```js
1 + "1"; // '11'
true + true; // 2
4 + [1, 2, 3]; // "41,2,3"
```

4. 比较运算符

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

`null` == `undefined` 比较结果是true，除此之外，`null`、`undefined` 和其他任何结果的比较值都为 `false`。

```js
null == undefined // true
null == '' // false
null == 0 // false
null == false // false
undefined == '' // false
undefined == 0 // false
undefined == false // false
```

- 如果是对象，就通过 [[ToPrimitive]] 转换对象
- 如果是字符串，就通过 unicode 字符索引来比较

```js
console.log([] == ![]); //true
```

## 数据存储

JavaScript 是在创建变量时自动进行了分配内存，并且在不使用它们时“自动”释放。

栈内存：

- 存储的值大小固定
- 空间较小
- 可以直接操作其保存的变量，运行效率高
- 由系统自动分配存储空间

基本数据类型存放在**栈**中，也就是以下数据类型存储在**栈**中:

- `boolean`
- `null`
- `undefined`
- `number`
- `string`
- `symbol`
- `bigInt`

堆内存：

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

引用数据类型存放在**堆**中，闭包变量是存在**堆**内存中的，这也就解释了函数之后之后为什么闭包还能引用到函数内的变量。**引用数据类型在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。**现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。两者都是存放临时数据的地方。

- 栈是先进后出的，就像一个桶，后进去的先出来，它下面本来有的东西要等其他出来之后才能出来。栈区（stack） 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。
- 堆是在程序运行时，而不是在程序编译时，申请某个大小的内存空间。即动态分配内存，对其访问和对一般内存的访问没有区别。对于堆，我们可以随心所欲的进行增加变量和删除变量，不用遵循次序。堆区（heap） 一般由人工分配释放，若人工不释放，程序结束时可能由OS回收。

![数据存储]('../../../assets/storage.jpg')

## 参考资料

[instanceof-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

[Class checking: "instanceof"](https://javascript.info/instanceof)
