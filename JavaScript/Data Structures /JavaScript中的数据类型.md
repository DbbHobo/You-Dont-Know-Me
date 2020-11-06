# JavaScript 中的数据

## 数据类型

JS 中有两大类型：基本数据类型和对象（Object）。

基本数据类型： null、undefined、boolean、number、string、symbol、bigint

引用数据类型：普通对象-Object、数组对象-Array、正则对象-RegExp、日期对象-Date、数学函数-Math、函数对象-Function

引用数据类型的值是保存在内存中的对象。与其他语言不同， JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。为此，**引用数据类型的值是按引用访问的**。因此如果对象作为参数传入函数，在函数传参的时候传递的是对象在堆中的内存地址值。

引用数据类型和基本数据类型不同的是，基本数据类型存储的是值，对象类型存储的是地址（指针）。

## bigint

在 JS 中，所有的数字都以双精度 64 位浮点格式表示，那这会带来什么问题呢？这导致 JS 中的 Number 无法精确表示非常大或者非常小的整数，它会将非常大、小的整数四舍五入，确切地说，JS 中的 Number 类型只能安全地表示-9007199254740991(-(2^53-1))和 9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

要创建 BigInt，只需要在数字末尾加 n 即可。

## typeof

typeof 对于基本类型，除了 null 都可以显示正确的类型

typeof 对于对象，除了函数都会显示 object

```js
typeof 1; // 'number'
typeof "1"; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，但是还会显示 undefined
typeof null; // ---'object' 历史遗留问题---
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
typeof 9007199887740995n; // 'bigint'
```

## instanceof

instanceof 可以正确的判断对象的类型，因为内部机制是通过查找原型链，只要处于原型链中，就会返回 true。

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

使用 isPrototypeOf()方法。同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型

## 类型转换

在 JS 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串 -条件判断时，除了 undefined， null， false， NaN， ''， 0， -0，其他所有值都转为 true，包括所有对象。

1. 对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：
   如果已经是原始类型了，那就不需要转换了
   如果需要转字符串类型就调用 x.toString()，转换为基础类型的话就返回转换的值。不是字符串类型的话就先调用 valueOf，结果不是基础类型的话再调用 toString
   调用 x.valueOf()，如果转换为基础类型，就返回转换的值如果都没有返回原始类型，就会报错

2. 四则运算
   加法运算符不同于其他几个运算符，它有以下几个特点：
   运算中其中一方为字符串，那么就会把另一方也转换为字符串
   如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
   1 + '1' // '11'
   true + true // 2
   4 + [1,2,3] // "41,2,3"
   对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字

3. 比较运算符
   如果是对象，就通过 toPrimitive 转换对象
   如果是字符串，就通过 unicode 字符索引来比较

## 数据存储

以下数据类型存储在栈中:

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

而所有的对象数据类型存放在堆中，闭包变量是存在堆内存中的。
