# Proxy

`Proxy` 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。`Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。`Proxy` 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。`Proxy` 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
const p = new Proxy(target, handler)
```

- `new Proxy(target,handler)` 表示生成一个Proxy实例
- `target` 要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
- `handler` 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为

```js
let obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```

## Proxy 支持的拦截操作

### `get(target, propKey, receiver)`

拦截对象属性的读取，比如`proxy.foo和proxy['foo']`。

### `set(target, propKey, value, receiver)`

拦截对象属性的设置，比如`proxy.foo = v或proxy['foo'] = v`，返回一个布尔值。

### `has(target, propKey)`

拦截`propKey in proxy`的操作，返回一个布尔值。

### `deleteProperty(target, propKey)`

拦截`delete proxy[propKey]`的操作，返回一个布尔值。

### `ownKeys(target)`

拦截以下操作，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。

- `Object.getOwnPropertyNames(proxy)`
- `Object.getOwnPropertySymbols(proxy)`
- `Object.keys(proxy)`
- `for...in`

### `getOwnPropertyDescriptor(target, propKey)`

拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。

### `defineProperty(target, propKey, propDesc)`

拦截以下操作，返回一个布尔值。

- `Object.defineProperty(proxy, propKey, propDesc）`
- `Object.defineProperties(proxy, propDescs)`

### `preventExtensions(target)`

拦截`Object.preventExtensions(proxy)`，返回一个布尔值。

### `isExtensible(target)`

拦截`Object.isExtensible(proxy)`，返回一个布尔值。

### `getPrototypeOf(target)`

拦截以下操作，返回一个对象。

- `Object.prototype.__proto__`
- `Object.prototype.isPrototypeOf()`
- `Object.getPrototypeOf()`
- `Reflect.getPrototypeOf()`
- `instanceof`

### `setPrototypeOf(target, proto)`

拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

### `apply(target, object, args)`

拦截 `Proxy` 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。

### `construct(target, args)`

拦截 `Proxy` 实例作为构造函数调用的操作，比如`new proxy(...args)`。

## Proxy 应用

### 动态拦截操作

通过 `Proxy` 可以拦截对象的访问方式，并实现动态行为。

```js
const target = {};
const handler = {
  get: (target, prop, receiver) => {
    if (prop === 'name') {
      return 'John Doe';
    }
    return prop in target ? target[prop] : `Property ${prop} not found`;
  },
  set: (target, prop, value) => {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true; // 返回 true 表示操作成功
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // "John Doe"
console.log(proxy.age);  // "Property age not found"
proxy.age = 30;         // "Setting age to 30"
```

### 属性访问日志

通过 `Proxy` 你可以实现属性访问的日志功能。

```js
const target = { message: "Hello" };
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.message); // Getting message
proxy.message = "World";   // Setting message to World
```

### 防止对象被修改（seal、freeze）

你可以使用 `Proxy` 来防止对象被修改或者删除属性。

```js
const target = { name: "Alice" };
const handler = {
  set(target, prop, value) {
    if (prop === "name") {
      console.log("Cannot change the 'name' property.");
      return false;
    }
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);
proxy.name = "Bob"; // Cannot change the 'name' property.
```

### 虚拟代理

通过 `Proxy` 可以实现虚拟代理，比如在需要惰性加载某些数据时，使用代理来延迟实际对象的初始化。

```js
const largeObject = {
  data: new Array(1000).fill('Data'),
  fetchData() {
    console.log('Fetching large data...');
    return this.data;
  }
};

const handler = {
  get(target, prop) {
    if (prop === 'fetchData') {
      console.log('Proxying fetchData...');
      return () => target.fetchData();
    }
    return target[prop];
  }
};

const proxy = new Proxy(largeObject, handler);
console.log(proxy.fetchData()); // Proxying fetchData... Fetching large data...
```

## 参考资料

[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

[Proxy 实例的方法](https://www.bookstack.cn/read/es6-3rd/spilt.2.docs-proxy.md)