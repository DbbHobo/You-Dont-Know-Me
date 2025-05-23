# Object

收集对象常用的一些内置方法

## Object 静态的属性、方法

### Object.length

值为 1。

### Object.is(value1, value2)

`Object.is()` 用来比较两个值是否严格相等，与严格比较运算符（`===`）的行为基本一致。=== 运算符（和 == 运算符）将数值 `-0` 和 `+0` 视为相等，但是会将 `NaN` 视为彼此不相等。

```js
console.log(Object.is(NaN, NaN))
// true
console.log(Object.is(+0, -0))
// false

console.log(NaN === NaN)
// false
console.log(+0 === -0)
// true
```

### 创建 Object 相关

### Object.create(proto, propertiesObject)

- The Object.create() static method creates a new object, using an existing object as the prototype of the newly created object.

创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。新创建的对象就会在现有对象的原型链上。

在 JavaScript 中创建一个空对象最简单的方法都是 `Object.create(null)` 。 `Object.create(null)` 和 `{}` 很像， 但是并不会创建 `Object.prototype` 这个委托， 所以它比 `{}` “更空” 。

```js
var person1 = {
  name: "张三",
  age: 38,
  greeting: function () {
    console.log("Hi! I'm " + this.name + ".")
  },
}
var person2 = Object.create(person1)
person2.name // 张三
person2.greeting() // Hi! I'm 张三.
```

上面代码中，对象 person1 是 person2 的原型对象，后者继承了前者的属性和方法。

### Object.setPrototypeOf(obj, prototype) / Object.getPrototypeOf(obj)

\***\*proto\*\***属性没有写入 ES6 的正文，而是写入了附录，原因是\***\*proto\*\***前后的双下划线，说明它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的 `Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替。

`Object.setPrototypeOf()` 方法的作用与**proto**相同，用来设置一个对象的 `prototype` 对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。

- The Object.setPrototypeOf() static method sets the prototype (i.e., the internal [[Prototype]] property) of a specified object to another object or null.

`Object.getPrototypeOf()` 方法与 `Object.setPrototypeOf()` 方法配套，用于读取一个对象的原型对象。

- The Object.getPrototypeOf() static method returns the prototype (i.e. the value of the internal [[Prototype]] property) of the specified object.

```js
// ES6 之前需要抛弃默认的 Bar.prototype
Bar.ptototype = Object.create(Foo.prototype)
// ES6 开始可以直接修改现有的 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

### Object.assgin(target,source)

- The Object.assign() static method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.

用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。方法只会拷贝**源对象自身的**并且**可枚举的**属性到目标对象。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。

`Object.assign`方法用于**对象的合并**，将源对象（source）的所有可枚举属性，复制到目标对象（target）。`Object.assign(target, source1, source2);`是**浅拷贝**。

```js
const target = { a: 1, b: 2 }
const source = { b: 4, c: 5 }
const returnedTarget = Object.assign(target, source)
console.log(target)
// expected output: Object { a: 1, b: 4, c: 5 }
console.log(returnedTarget)
// expected output: Object { a: 1, b: 4, c: 5 }
```

### Object.defineProperty(obj, prop, descriptor) / Object.defineProperties(obj, props)

- `Object.defineProperty(obj, prop, descriptor)`
- The Object.defineProperty() static method defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
- `Object.defineProperties(obj, props)`
- The Object.defineProperties() static method defines new or modifies existing properties directly on an object, returning the object.

直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

**数据属性**：

- [[Configurable]]：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。对于直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Enumerable]]：表示能否通过 `for-in` 循环返回属性。对于直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Writable]]：表示能否修改属性的值。对于直接在对象上定义的属性，它们的这个特性默认值为 true。
- [[Value]]：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 `undefined`。

**访问器属性**：

- [[Configurable]]：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Enumerable]]：表示能否通过 `for-in` 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为 true。
- [[Get]]：在读取属性时调用的函数。默认值为 `undefined`。
- [[Set]]：在写入属性时调用的函数。默认值为 `undefined`。

ES5 有三个操作会忽略 `enumerable` 为 false 的属性：

- `for...in` 循环：只遍历对象自身的和继承的可枚举的属性
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名
- `JSON.stringify()`：只串行化对象自身的可枚举的属性
- ES6 新增了一个操作`Object.assign()`：会忽略 `enumerable` 为 false 的属性，只拷贝对象自身的可枚举的属性。

只有`for...in`会返回继承的属性，其他三个方法都会忽略继承的属性，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉`for...in`操作，不然所有内部属性和方法都会被遍历到。

```js
const object1 = {}

Object.defineProperty(object1, "property1", {
  value: 42,
  writable: false,
})

object1.property1 = 77
// Throws an error in strict mode

console.log(object1.property1)
// Expected output: 42

const object2 = {}

Object.defineProperties(object2, {
  property1: {
    value: 42,
    writable: true,
  },
  property2: {},
})

console.log(object2.property1)
// Expected output: 42
```

### 属性相关

### Object.getOwnPropertyNames(obj)

- The Object.getOwnPropertyNames() static method returns an array of all properties (including non-enumerable properties except for those which use Symbol) found directly in a given object.

`Object.getOwnPropertyNames()`方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括 Symbol 值作为名称的属性）组成的数组。

```js
const object1 = {
  a: 1,
  b: 2,
  c: 3,
}

console.log(Object.getOwnPropertyNames(object1))
// Expected output: Array ["a", "b", "c"]
```

### Object.getOwnPropertySymbols(obj)

- The Object.getOwnPropertySymbols() static method returns an array of all symbol properties found directly upon a given object.

`Object.getOwnPropertySymbols()` 方法返回一个给定对象自身的所有 Symbol 属性的数组。

```js
const object1 = {}
const a = Symbol("a")
const b = Symbol.for("b")

object1[a] = "localSymbol"
object1[b] = "globalSymbol"

const objectSymbols = Object.getOwnPropertySymbols(object1)

console.log(objectSymbols.length)
// Expected output: 2
```

### Object.getOwnPropertyDescriptor(obj,prop) / Object.getOwnPropertyDescriptors(obj)

- The Object.getOwnPropertyDescriptor() static method returns an object describing the configuration of a specific property on a given object (that is, one directly present on an object and not in the object's prototype chain). The object returned is mutable but mutating it has no effect on the original property's configuration.

ES5 的 `Object.getOwnPropertyDescriptor()` 方法会返回**某个**对象属性的描述对象（descriptor）。

ES2017 引入了 `Object.getOwnPropertyDescriptors()` 方法，返回指定对象**所有**自身属性（非继承属性）的描述对象。

```js
const object1 = {
  property1: 42,
  property2: "dfkk",
}
const descriptor1 = Object.getOwnPropertyDescriptor(object1, "property1")
const descriptors = Object.getOwnPropertyDescriptors(object1)
console.log(descriptor1.configurable)
// Expected output: true
console.log(descriptor1.value)
// Expected output: 42
console.log(descriptors)
// Expected output: {
//     "property1": {
//         "value": 42,
//         "writable": true,
//         "enumerable": true,
//         "configurable": true
//     },
//     "property2": {
//         "value": "dfkk",
//         "writable": true,
//         "enumerable": true,
//         "configurable": true
//     }
// }

let arr = []
Object.getOwnPropertyDescriptor(arr, "length")
// Expected output: {value: 0, writable: true, enumerable: false, configurable: false}
```

### Object.preventExtensions(obj) / Object.isExtensible(obj)

- The Object.preventExtensions() static method prevents new properties from ever being added to an object. It also prevents the object's prototype from being re-assigned.

`Object.preventExtensions()`让一个对象变的不可扩展，也就是永远不能再添加新的属性。

- **不能添加新属性**

`Object.isExtensible()`判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。

### Object.seal(obj) / Object.isSealed(obj)

- Sealing an object prevents extensions and makes existing properties non-configurable.

`Object.seal()`封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。

- **不能添加新属性**
- **不能删除已有属性**
- **不能配置现有属性 相当于 configurable=false**

`Object.isSealed()`判断一个对象是否被密封。密封对象是指那些不可扩展的，且所有自身属性都不可配置且因此不可删除（但不一定是不可写）的对象。

### Object.freeze(obj) / Object.isFrozen(obj)

- Freezing an object prevents extensions and makes existing properties non-writable and non-configurable.

`Object.freeze()`冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。

- **不能添加新属性**
- **不能删除已有属性**
- **不能配置现有属性 相当于 configurable=false**
- **不能修改现有属性现有值 相当于 writable=false**

`Object.isFrozen()`判断一个对象是否被冻结。一个对象是冻结的是指它不可扩展，所有属性都是不可配置的，且所有数据属性（即没有 getter 或 setter 组件的访问器的属性）都是不可写的。

### 属性遍历

### Object.keys(obj)

- The Object.keys() static method returns an array of a given object's own enumerable string-keyed property names.

`object.keys()` 方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

```js
// simple array
var arr = ["a", "b", "c"]
console.log(Object.keys(arr)) // console: ['0', '1', '2']

// array like object
var obj = { 0: "a", 1: "b", 2: "c" }
console.log(Object.keys(obj)) // console: ['0', '1', '2']
```

### Object.values(obj)

- The Object.values() static method returns an array of a given object's own enumerable string-keyed property values.

`Object.values()` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值，值的顺序与使用 `for...in` 循环的顺序相同(区别在于 `for...in` 循环枚举原型链中的属性)。

```js
// array like object
var obj = { 0: "a", 1: "b", 2: "c" }
console.log(Object.values(obj)) // ['a', 'b', 'c']

// array like object with random key ordering
// when we use numeric keys, the value returned in a numerical order according to the keys
var an_obj = { 100: "a", 2: "b", 7: "c" }
console.log(Object.values(an_obj)) // ['b', 'c', 'a']
```

### Object.entries(obj)

- The Object.entries() static method returns an array of a given object's own enumerable string-keyed property key-value pairs.

`Object.entries()` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

```js
// array like object
const obj = { 0: "a", 1: "b", 2: "c" }
console.log(Object.entries(obj)) // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = { 100: "a", 2: "b", 7: "c" }
console.log(Object.entries(anObj)) // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]
```

### Object.fromEntries(obj)

- The Object.fromEntries() static method transforms a list of key-value pairs into an object.

`Object.fromEntries()`方法是 `Object.entries()` 的逆操作，用于将一个键值对数组转为对象。

```js
const map = new Map([
  ["foo", "bar"],
  ["baz", 42],
])
const obj = Object.fromEntries(map)
console.log(obj) // { foo: "bar", baz: 42 }
```

---

## Object 的实例方法

### Object.prototype.hasOwnProperty(prop)

- The hasOwnProperty() method of Object instances returns a boolean indicating whether this object has the specified property as its own property (as opposed to inheriting it).

会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键），而且此属性非原型链继承的。

```js
const object1 = {}
object1.property1 = 42

console.log(object1.hasOwnProperty("property1"))
// expected output: true

console.log(object1.hasOwnProperty("toString"))
// expected output: false
```

### Object.prototype.isPrototypeOf(object)

- The isPrototypeOf() method of Object instances checks if this object exists in another object's prototype chain.

返回一个布尔值，表示指定的对象是否在本对象的原型链中。

```js
function Foo() {}
function Bar() {}

Bar.prototype = Object.create(Foo.prototype)

const bar = new Bar()

console.log(Foo.prototype.isPrototypeOf(bar))
// Expected output: true
console.log(Bar.prototype.isPrototypeOf(bar))
// Expected output: true
```

### Object.prototype.propertyIsEnumerable(prop)

- The propertyIsEnumerable() method of Object instances returns a boolean indicating whether the specified property is this object's enumerable own property.

判断指定属性是否可枚举，内部属性设置参见 ECMAScript [[Enumerable]] attribute 。

```js
const object1 = {}
const array1 = []
object1.property1 = 42
array1[0] = 42

console.log(object1.propertyIsEnumerable("property1"))
// Expected output: true

console.log(array1.propertyIsEnumerable(0))
// Expected output: true

console.log(array1.propertyIsEnumerable("length"))
// Expected output: false
```

### Object.prototype.toLocaleString()

- The toLocaleString() method of Object instances returns a string representing this object. This method is meant to be overridden by derived objects for locale-specific purposes.

直接调用 `toString()` 方法。

```js
const date1 = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))

console.log(date1.toLocaleString("ar-EG"))
// Expected output: "٢٠‏/١٢‏/٢٠١٢ ٤:٠٠:٠٠ ص"

const number1 = 123456.789

console.log(number1.toLocaleString("de-DE"))
// Expected output: "123.456,789"
```

### Object.prototype.toString()

- The toString() method of Object instances returns a string representing this object. This method is meant to be overridden by derived objects for custom type conversion logic.

返回对象的字符串表示。

```js
function Dog(name) {
  this.name = name
}

const dog1 = new Dog("Gabby")

Dog.prototype.toString = function dogToString() {
  return `${this.name}`
}

console.log(dog1.toString())
// Expected output: "Gabby"

let obj = { name: "obj" }
console.log(obj.toString())
// Expected output: [object Object]
Object.prototype.toString.call(obj)
// Expected output: '[object Object]'

let arr = [1]
console.log(arr.toString())
// Expected output: 1
Object.prototype.toString.call(arr)
// Expected output: '[object Array]'
```

### Object.prototype.valueOf()

- The valueOf() method of Object instances converts the this value to an object. This method is meant to be overridden by derived objects for custom type conversion logic.

返回指定对象的原始值。

```js
function MyNumberType(n) {
  this.number = n
}

MyNumberType.prototype.valueOf = function () {
  return this.number
}

const object1 = new MyNumberType(4)

console.log(object1 + 3)
// Expected output: 7

let obj = [1]
console.log(obj.valueOf())
// Expected output: [1]

let obj = { name: "obj" }
console.log(obj.valueOf())
// Expected output: {name: 'obj'}
```

## Object 总结

### 对象属性遍历

1. `for...in`
   - for...in 循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
2. `Object.keys(obj)`/`Object.values(obj)`/`Object.entries(obj)`
   - Object.keys 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
3. `Object.getOwnPropertyNames(obj)`
   - Object.getOwnPropertyNames 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
4. `Object.getOwnPropertySymbols(obj)`
   - Object.getOwnPropertySymbols 返回一个数组，包含对象自身的所有 Symbol 属性的键名。
5. `Reflect.ownKeys(obj)`
   - Reflect.ownKeys 返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

## 参考资料

[Object-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
