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
- `bigint`

堆内存：

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

引用数据类型存放在**堆**中，闭包变量是存在**堆**内存中的，这也就解释了函数之后之后为什么闭包还能引用到函数内的变量。**引用数据类型在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。**现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。两者都是存放临时数据的地方。

- 栈是先进后出的，就像一个桶，后进去的先出来，它下面本来有的东西要等其他出来之后才能出来。栈区（stack） 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。
- 堆是在程序运行时，而不是在程序编译时，申请某个大小的内存空间。即动态分配内存，对其访问和对一般内存的访问没有区别。对于堆，我们可以随心所欲的进行增加变量和删除变量，不用遵循次序。堆区（heap） 一般由人工分配释放，若人工不释放，程序结束时可能由OS回收。

![数据存储]('../../../assets/storage.jpg')

## JavaScript 中内存管理

不管什么程序语言，内存生命周期基本是一致的：

1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放\归还

### JavaScript 的内存分配、使用和释放

- 内存的分配

  1. 值的初始化

为了不让开发者费心分配内存，`JavaScript` 在定义变量时就完成了内存分配。

```js
var n = 123; // 给数值变量分配内存
var s = "azerty"; // 给字符串分配内存

var o = {
  a: 1,
  b: null
}; // 给对象及其包含的值分配内存

// 给数组及其包含的值分配内存（就像对象一样）
var a = [1, null, "abra"];

function f(a){
  return a + 2;
} // 给函数（可调用的对象）分配内存

// 函数表达式也能分配一个对象
someElement.addEventListener('click', function(){
  someElement.style.backgroundColor = 'blue';
}, false);
```

  2. 通过函数调用分配内存

有些**函数调用结果**是分配对象内存：

```js
var d = new Date(); // 分配一个 Date 对象

var e = document.createElement('div'); // 分配一个 DOM 元素
```

有些**方法**分配新变量或者新对象：

```js
var s = "azerty";
var s2 = s.substr(0, 3); // s2 是一个新的字符串
// 因为字符串是不变量，
// JavaScript 可能决定不分配内存，
// 只是存储了 [0-3] 的范围。

var a = ["ouais ouais", "nan nan"];
var a2 = ["generation", "nan nan"];
var a3 = a.concat(a2);
// 新数组有四个元素，是 a 连接 a2 的结果
```

- 内存的使用

使用值的过程实际上是对分配内存进行读取与写入的操作。读取与写入可能是写入一个变量或者一个对象的属性值，甚至传递函数的参数。

- 内存的释放

大多数内存管理的问题都在这个阶段。在这里最艰难的任务是找到“哪些被分配的内存确实已经不再需要了”。它往往要求开发人员来确定在程序中哪一块内存不再需要并且释放它。

高级语言解释器嵌入了“垃圾回收器”，它的主要工作是跟踪内存的分配和使用，以便当分配的内存不再使用时，自动释放它。这只能是一个近似的过程，因为要知道是否仍然需要某块内存是无法判定的（无法通过某种算法解决）。

### javascript垃圾回收机制

- 引用计数垃圾收集

如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。该算法有个限制：无法处理**循环引用**的情况。

- 标记-清除算法

这个算法假定设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象。从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。解决了循环引用的问题，因为无法从根全局对象出发找到。

标记清除算法有一个很大的缺点，就是在清除之后，剩余的对象内存位置是不变的，也会导致空闲内存空间是不连续的，出现了 内存碎片（如下图），并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表。

- 分代式垃圾回收机制

V8 引擎基于标记清楚算法进行优化，V8 把**堆内存**分成了两部分进行处理——**新生代内存**和**老生代内存**。新生代就是临时分配的内存，存活时间短，老生代是常驻内存，存活的时间长。V8 的堆内存，也就是两个内存之和。V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分。

1. 新生代内存处理

新生代主要用于存放存活时间较短的对象，新生代中的对象一般存活时间较短，使用 `Scavenge GC` 算法。

在新生代空间中，内存空间分为两部分，分别为 **From 空间**和 **To 空间**。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。由于堆内存是连续分配的，如果是零零散散的空间可能会导致稍微大一点的对象没有办法进行空间分配，这种零散的空间也叫做内存碎片，因此在检查 From 空间中存活的对象并复制到 To 空间中的过程中，复制过去会在 To 内存中按照顺序**从头按序放置**。

Scavenge算法的垃圾回收过程主要就是将存活对象在**From 空间**和 **To 空间**之间进行复制，同时完成两个空间之间的角色互换，因此该算法的缺点也比较明显，浪费了一半的内存用于复制。

2. 老生代内存处理

当一个对象在经过多次复制之后依旧存活，那么它会被认为是一个生命周期较长的对象，在下一次进行垃圾回收时，该对象会被直接转移到老生代中，这种对象从新生代转移到老生代的过程我们称之为晋升。对象晋升的条件主要有以下两个：

- 对象是否经历过一次Scavenge算法
- To空间的内存占比是否已经超过25%

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是**标记清除算法**和**标记压缩算法**。老生代中的空间很复杂，有如下几个空间：

```js
  enum AllocationSpace {
  // TODO(v8:7464): Actually map this space's memory as read-only.
  RO_SPACE, // 不变的对象空间
  NEW_SPACE, // 新生代用于 GC 复制算法的空间
  OLD_SPACE, // 老生代常驻对象空间
  CODE_SPACE, // 老生代代码对象空间
  MAP_SPACE, // 老生代 map 对象
  LO_SPACE, // 老生代大空间对象
  NEW_LO_SPACE, // 新生代大空间对象

  FIRST_SPACE = RO_SPACE,
  LAST_SPACE = NEW_LO_SPACE,
  FIRST_GROWABLE_PAGED_SPACE = OLD_SPACE,
  LAST_GROWABLE_PAGED_SPACE = MAP_SPACE
  };
```

在老生代中，以下情况会先启动**标记清除算法**：

- 某一个空间没有分块的时候
- 空间中被对象超过一定限制
- 空间不能保证新生代中的对象移动到老生代中

垃圾回收器使用**标记清除算法**会在内部构建一个根列表，用于从根节点出发去寻找那些可以被访问到的变量。比如在JavaScript中，`window`全局对象可以看成一个根节点。在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型堆内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行。

**标记清除算法**算法存在一个问题，就是在经历过一次标记清除后，内存空间可能会出现不连续的状态，因为我们所清理的对象的内存地址可能不是连续的，所以就会出现内存碎片的问题，导致后面如果需要分配一个大对象而空闲内存不足以分配，就会提前触发垃圾回收，而这次垃圾回收其实是没必要的，因为我们确实有很多空闲内存，只不过是不连续的。

清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动**标记压缩算法**。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

### 如何避免内存泄露

- 尽可能少地创建全局变量
- 手动清除定时器
- 少用闭包
- 清除DOM引用
- 高效使用WeakMap和WeakSet

## 参考资料

[instanceof-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
[Class checking: "instanceof"](https://javascript.info/instanceof)
[内存管理-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
[Garbage collection](https://javascript.info/garbage-collection)
