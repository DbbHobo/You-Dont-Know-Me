## Reflect

`Reflect` 是一个内置的对象，它提供拦截 JavaScript 操作的方法。`Reflect`不是一个函数对象，因此它是不可构造的。

与大多数全局对象不同`Reflect`并非一个构造函数，所以不能通过new 运算符对其进行调用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像Math对象）。其中的一些方法与 `Object` 相同，尽管二者之间存在某些细微上的差别。

## Reflect 的静态方法

### Reflect.get(target, name, receiver)
获取对象身上某个属性的值，类似于 `target[name]`。

### Reflect.set(target, name, value, receiver)
将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。

### Reflect.has(obj, name)
判断一个对象是否存在某个属性，和 `in` 运算符 的功能完全相同。

### Reflect.deleteProperty(obj, name)
作为函数的`delete`操作符，相当于执行 `delete target[name]`。

### Reflect.getPrototypeOf(obj)
类似于 `Object.getPrototypeOf()`。

### Reflect.setPrototypeOf(obj, newProto)
设置对象原型的函数。返回一个Boolean，如果更新成功，则返回 true。

### Reflect.defineProperty(target, propertyKey, attributes)
和 `Object.defineProperty()` 类似。如果设置成功就会返回 true

### Reflect.getOwnPropertyDescriptor(target, propertyKey)
类似于 `Object.getOwnPropertyDescriptor()`。如果对象中存在该属性，则返回对应的属性描述符，否则返回 undefined。

### Reflect.ownKeys (target)
返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 `Object.keys()`, 但不会受enumerable 影响).

### Reflect.preventExtensions(target)
类似于 `Object.preventExtensions()`。返回一个Boolean。

### Reflect.isExtensible (target)
类似于 `Object.isExtensible()`.

### Reflect.apply(func, thisArg, args)
对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 `Function.prototype.apply()` 功能类似。

### Reflect.construct(target, args)
对构造函数进行 `new` 操作，相当于执行 `new target(...args)`。

[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
[Reflect静态方法](https://www.bookstack.cn/read/es6-3rd/spilt.2.docs-reflect.md#b21mb4)