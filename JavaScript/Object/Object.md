## 对象

无序属性的集合，其属性可以包含基本值、对象或者函数。

引用类型的值是保存在内存中的对象。与其他语言不同， JavaScript 不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。为此，引用类型的值是按引用访问的。

## 属性

**数据属性**

- [[Configurable]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Enumerable]]：表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 undefined。

**访问器属性**(访问器属性不能直接定义，必须使用 Object.defineProperty()来定义)

- [[Configurable]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Enumerable]]：表示能否通过 for-in 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Get]]：在读取属性时调用的函数。默认值为 undefined。
- [[Set]]：在写入属性时调用的函数。默认值为 undefined。

## 原型链

- 每个构造函数都有一个原型对象(prototype)
- 原型对象包含一个指向构造函数的指针(constructor)
- 实例都包含一个指向原型对象的内部指针(**_proto_**)。
- 所有对象都可以通过原型链最终找到 Object.prototype

```js
arr---- > Array.prototype---- > Object.prototype---- > null;
Fn---- > Function.prototype---- > Object.prototype---- > null;
```

## new

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

这就是调用 new 的过程

```js
// 实现new
function create() {
  // 创建一个空的对象
  let obj = new Object();
  // 获得构造函数
  let Con = [].shift.call(arguments);
  // 链接到原型
  obj.__proto__ = Con.prototype;
  // 绑定 this，执行构造函数
  let result = Con.apply(obj, arguments);
  // 确保 new 出来的是个对象
  return typeof result === "object" ? result : obj;
}
```
