# Reflect

`Reflect` 是一个内置的对象，它提供拦截 JavaScript 操作的方法。`Reflect`不是一个函数对象，因此它是不可构造的。

与大多数全局对象不同`Reflect`并非一个构造函数，所以不能通过 new 运算符对其进行调用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是**静态**的（就像Math对象）。其中的一些方法与 `Object` 相同，尽管二者之间存在某些细微上的差别。

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。

2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回false。

3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和d`elete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

## Reflect 的静态方法

### Reflect.get(target, name, receiver)

获取对象身上某个属性的值，类似于 `target[name]`。

### Reflect.set(target, name, value, receiver)

将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。

### Reflect.has(obj, name)

判断一个对象是否存在某个属性，和 `in` 运算符的功能完全相同。

### Reflect.deleteProperty(obj, name)

作为函数的`delete`操作符，相当于执行 `delete target[name]`。

### Reflect.getPrototypeOf(obj)

类似于 `Object.getPrototypeOf()`。

### Reflect.setPrototypeOf(obj, newProto)

设置对象原型的函数。返回一个 `Boolean`，如果更新成功，则返回 true。

### Reflect.defineProperty(target, propertyKey, attributes)

和 `Object.defineProperty()` 类似。如果设置成功就会返回 true。

### Reflect.getOwnPropertyDescriptor(target, propertyKey)

类似于 `Object.getOwnPropertyDescriptor()`。如果对象中存在该属性，则返回对应的属性描述符，否则返回 undefined。

### Reflect.ownKeys(target)

返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 `Object.keys()`, 但不会受enumerable 影响)。

### Reflect.preventExtensions(target)

类似于 `Object.preventExtensions()`。返回一个Boolean。

### Reflect.isExtensible(target)

类似于 `Object.isExtensible()`。

### Reflect.apply(func, thisArg, args)

对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 `Function.prototype.apply()` 功能类似。

### Reflect.construct(target, args)

对构造函数进行 `new` 操作，相当于执行 `new target(...args)`。

## Reflect 应用

### 简化对象操作

使用 `Reflect` 来执行与对象相关的操作，比如设置属性、获取属性、删除属性等，确保操作更为明确和规范。

```js
const obj = { name: "Alice" };

// 使用 Reflect 设置属性
Reflect.set(obj, 'name', 'Bob');
console.log(obj.name);  // "Bob"

// 使用 Reflect 获取属性
const name = Reflect.get(obj, 'name');
console.log(name);  // "Bob"

// 使用 Reflect 删除属性
const deleted = Reflect.deleteProperty(obj, 'name');
console.log(deleted);  // true
console.log(obj);  // {}
```

### 与 Proxy 配合使用

在 `Proxy` 的陷阱方法中，使用 `Reflect` 可以避免手动实现某些对象操作，并且可以简化代码的实现。

```js
const target = { message: "Hello" };
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(...arguments); // 使用 Reflect 获取属性值
  },
  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(...arguments); // 使用 Reflect 设置属性值
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.message); // Getting message -> "Hello"
proxy.message = "World";   // Setting message to World
```

## 参考资料

[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

[Reflect静态方法](https://www.bookstack.cn/read/es6-3rd/spilt.2.docs-reflect.md#b21mb4)
