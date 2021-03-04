# Object

收集对象常用的一些内置方法

### Object 构造函数的属性

- Object.length

值为 1。

- Object.prototype

可以为所有 Object 类型的对象添加属性。

### Object 构造函数的方法

#### Object.create()

创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。新创建的对象就会在现有对象的原型链上。

```js
var person1 = {
  name: "张三",
  age: 38,
  greeting: function () {
    console.log("Hi! I'm " + this.name + ".");
  },
};
var person2 = Object.create(person1);
person2.name; // 张三
person2.greeting(); // Hi! I'm 张三.
```

上面代码中，对象 person1 是 person2 的模板，后者继承了前者的属性和方法。

#### Object.assgin()

用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。方法只会拷贝源对象自身的并且可枚举的属性到目标对象。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);
console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }
console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

#### Object.setPrototypeOf()，Object.getPrototypeOf()

该属性没有写入 ES6 的正文，而是写入了附录，原因是**proto**前后的双下划线，说明它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的 Object.setPrototypeOf()（写操作）、Object.getPrototypeOf()（读操作）、Object.create()（生成操作）代替。
Object.setPrototypeOf 方法的作用与**proto**相同，用来设置一个对象的 prototype 对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。
Object.getPrototypeOf()方法与 Object.setPrototypeOf 方法配套，用于读取一个对象的原型对象。
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.ptototype = Object.create( Foo.prototype );
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf( Bar.prototype, Foo.prototype );

#### Object.defineProperty()

直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
数据属性：

- [[Configurable]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Enumerable]]：表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Writable]]：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 undefined。

访问器属性：

- [[Configurable]]：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Enumerable]]：表示能否通过 for-in 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Get]]：在读取属性时调用的函数。默认值为 undefined。
- [[Set]]：在写入属性时调用的函数。默认值为 undefined。

ES5 有三个操作会忽略 enumerable 为 false 的属性

- for...in 循环：只遍历对象自身的和继承的可枚举的属性
- Object.keys()：返回对象自身的所有可枚举的属性的键名
- JSON.stringify()：只串行化对象自身的可枚举的属性

ES6 新增了一个操作

- Object.assign()，会忽略 enumerable 为 false 的属性，只拷贝对象自身的可枚举的属性。

#### Object.getOwnPropertyDescriptors()

ES5 的 Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了 Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。

#### Object.preventExtensions()

让一个对象变的不可扩展，也就是永远不能再添加新的属性。

#### Object.seal()

封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。

#### Object.freeze()

冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

#### Object.isFrozen()

判断一个对象是否被冻结。一个对象是冻结的是指它不可扩展，所有属性都是不可配置的，且所有数据属性（即没有 getter 或 setter 组件的访问器的属性）都是不可写的。

#### Object.isSealed()

判断一个对象是否被密封。密封对象是指那些不可扩展的，且所有自身属性都不可配置且因此不可删除（但不一定是不可写）的对象。

#### Object.is()

Object.is 用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

#### Object.keys()

object.keys 方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

```js
// simple array
var arr = ["a", "b", "c"];
console.log(Object.keys(arr)); // console: ['0', '1', '2']

// array like object
var obj = { 0: "a", 1: "b", 2: "c" };
console.log(Object.keys(obj)); // console: ['0', '1', '2']
```

#### Object.values()

Object.values 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值，值的顺序与使用 for...in 循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。

```js
// array like object
var obj = { 0: "a", 1: "b", 2: "c" };
console.log(Object.values(obj)); // ['a', 'b', 'c']

// array like object with random key ordering
// when we use numeric keys, the value returned in a numerical order according to the keys
var an_obj = { 100: "a", 2: "b", 7: "c" };
console.log(Object.values(an_obj)); // ['b', 'c', 'a']
```

#### Object.entries()

Object.entries()方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

```js
// array like object
const obj = { 0: "a", 1: "b", 2: "c" };
console.log(Object.entries(obj)); // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = { 100: "a", 2: "b", 7: "c" };
console.log(Object.entries(anObj)); // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]
```

#### Object.fromEntries()

Object.fromEntries()方法是 Object.entries()的逆操作，用于将一个键值对数组转为对象。

```js
const map = new Map([
  ["foo", "bar"],
  ["baz", 42],
]);
const obj = Object.fromEntries(map);
console.log(obj); // { foo: "bar", baz: 42 }
```

### Object 原型对象的属性

#### Object.prototype.constructor

特定的函数，用于创建一个对象的原型。

### Object 原型对象的方法

#### Object.prototype.hasOwnProperty()

会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。

```js
const object1 = {};
object1.property1 = 42;

console.log(object1.hasOwnProperty("property1"));
// expected output: true

console.log(object1.hasOwnProperty("toString"));
// expected output: false
```

#### Object.prototype.hasOwnProperty()

返回一个布尔值 ，表示某个对象是否含有指定的属性，而且此属性非原型链继承的。

#### Object.prototype.isPrototypeOf()

返回一个布尔值，表示指定的对象是否在本对象的原型链中。

#### Object.prototype.propertyIsEnumerable()

判断指定属性是否可枚举，内部属性设置参见 ECMAScript [[Enumerable]] attribute 。

#### Object.prototype.toLocaleString()

直接调用 toString()方法。

#### Object.prototype.toString()

返回对象的字符串表示。

#### Object.prototype.valueOf()

返回指定对象的原始值。

[Object-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
