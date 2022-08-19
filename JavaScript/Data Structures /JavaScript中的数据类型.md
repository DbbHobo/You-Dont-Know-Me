# JavaScript 中的数据

## 数据类型

JS 中有两大类型：基本数据类型和对象（Object）。

基本数据类型： null、undefined、boolean、number、string、symbol、bigint

引用数据类型：普通对象-Object、数组对象-Array、正则对象-RegExp、日期对象-Date、数学函数-Math、函数对象-Function

引用数据类型的值是保存在内存中的对象。与其他语言不同， JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。为此，**引用数据类型的值是按引用访问的**。因此如果对象作为参数传入函数，在函数传参的时候传递的是对象在堆中的内存地址值。

引用数据类型和基本数据类型不同的是，基本数据类型存储的是值，引用数据类型存储的是地址（指针）。

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
typeof b; // b 没有声明，会显示 undefined
typeof null; // ---'object' 历史遗留问题---
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
typeof 9007199887740995n; // 'bigint'
```

## instanceof

instanceof 可以正确的判断**对象**的类型，因为内部机制是通过查找原型链，只要处于原型链中，就会返回 true，字面量是无法判断的。

The instanceof operator tests the presence of constructor.prototype in object's prototype chain.

**object** instanceof **constructor**

- object-某个实例对象
- constructor-某个构造函数

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

使用 isPrototypeOf()方法同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型。

## Symbol.hasInstance

Symbol.hasInstance 用于判断某对象是否为某构造器的实例。因此你可以用它自定义 instanceof 操作符在某个类上的行为。

```js
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === "string";
  }
}
```

## 类型转换

在 JS 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

1. 条件判断时，除了 undefined， null， false， NaN， ''， 0， -0，其他所有值都转为 true，包括所有对象。

2. 对象在转换类型的时候，会调用内置的 [[ToPrimitive]] 函数，对于该函数来说，算法逻辑一般来说如下：

- 如果 Symbol.toPrimitive()方法，优先调用再返回
- 调用 valueOf()，如果转换为原始类型，则返回
- 调用 toString()，如果转换为原始类型，则返回
- 如果都没有返回原始类型，会报错

3. 四则运算

我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型，加法运算符不同于其他几个运算符，执行+操作符时：

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

- NaN
NaN和其他任何类型比较永远返回false(包括和他自己)。

- Boolean
Boolean和其他任何类型比较，Boolean首先被转换为Number类型。
```js
true == 1  // true 
true == '2'  // false
true == ['1']  // true
true == ['2']  // false
```
这里注意一个可能会弄混的点：undefined、null和Boolean比较，虽然undefined、null和false都很容易被想象成假值，但是他们比较结果是false，原因是false首先被转换成0：
```js
undefined == false // false
null == false // false
```

- String和Number
String和Number比较，先将String转换为Number类型。
```js
123 == '123' // true
'' == 0 // true
```

- null和undefined
null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。
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

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

堆内存：

- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

引用数据类型存放在**堆**中，闭包变量是存在**堆**内存中的，这也就解释了函数之后之后为什么闭包还能引用到函数内的变量。引用数据类型在栈中只存储了一个固定长度的地址，这个地址指向堆内存中的值。现在的 JS 引擎可以通过
逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。两者都是存放临时数据的地方。

- 栈是先进后出的，就像一个桶，后进去的先出来，它下面本来有的东西要等其他出来之后才能出来。栈区（stack） 由编译器自动分配释放 ，存放函数的参数值，局部变量的值等。 
- 堆是在程序运行时，而不是在程序编译时，申请某个大小的内存空间。即动态分配内存，对其访问和对一般内存的访问没有区别。对于堆，我们可以随心所欲的进行增加变量和删除变量，不用遵循次序。堆区（heap） 一般由人工分配释放，若人工不释放，程序结束时可能由OS回收。 

## JavaScript 中的垃圾回收机制

不管什么程序语言，内存生命周期基本是一致的：

1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放\归还

- 引用计数垃圾收集

如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。该算法有个限制：无法处理循环引用的情况。

- 标记-清除算法

这个算法假定设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象。从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。

- 分代式垃圾回收机制

V8 把堆内存分成了两部分进行处理——**新生代内存**和**老生代内存**。新生代就是临时分配的内存，存活时间短，老生代是常驻内存，存活的时间长。V8 的堆内存，也就是两个内存之和。V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分。

1. 新生代内存处理

新生代中的对象一般存活时间较短，使用 Scavenge GC 算法。

在新生代空间中，内存空间分为两部分，分别为 **From 空间**和 **To 空间**。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了。

2. 老生代内存处理

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是**标记清除算法**和**标记压缩算法**。

什么情况下对象会出现在老生代空间中：新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。老生代中的空间很复杂，有如下几个空间：

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

在老生代中，以下情况会先启动标记清除算法：

- 某一个空间没有分块的时候
- 空间中被对象超过一定限制
- 空间不能保证新生代中的对象移动到老生代中

在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型对内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行。

清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

[instanceof-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
[Class checking: "instanceof"](https://javascript.info/instanceof)
[内存管理-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
