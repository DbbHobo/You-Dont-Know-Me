# Map

`Map`是一组键值对的结构，具有极快的查找速度。`Map`类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，`Object` 结构提供了“字符串—值”的对应，`Map` 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，`Map` 比 `Object` 更合适。

不仅仅是数组，任何具有 `Iterator` 接口、且每个成员都是一个**双元素的数组**的数据结构都可以当作`Map`构造函数的参数。这就是说，`Set`和`Map`都可以用来生成新的 `Map`。

如果 `Map` 的键是一个对象，只有对同一个对象的引用，`Map` 结构才将其视为同一个键。`Map` 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。如果 `Map` 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，`Map` 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但 `Map` 将其视为同一个键。

`Map` 结构转为数组结构，比较快速的方法是使用扩展运算符 `...`。

## Map的静态属性、方法

---

## Map的实例属性、方法

`Map` 的遍历顺序就是插入顺序。

### Map.prototype.size

- The size accessor property of Map instances returns the number of elements in this map.

返回 `Map` 实例的成员总数。

```js
const map1 = new Map();

map1.set('a', 'alpha');
map1.set('b', 'beta');
map1.set('g', 'gamma');

console.log(map1.size);
// Expected output: 3
```

### Map.prototype.set(key, value)

- The set() method of Map instances adds or updates an entry in this map with a specified key and a value.

`set`方法设置键名`key`对应的键值为`value`，然后返回整个 `Map` 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。`set`方法返回的是当前的`Map`对象，因此可以采用**链式**写法。

```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.get('bar'));
// Expected output: "foo"

console.log(map1.get('baz'));
// Expected output: undefined
```

### Map.prototype.get(key)

- The get() method of Map instances returns a specified element from this map. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map object.

`get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

### Map.prototype.has(key)

- The has() method of Map instances returns a boolean indicating whether an element with the specified key exists in this map or not.

`has`方法返回一个布尔值，表示某个键是否在当前 `Map` 对象之中。

```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.has('bar'));
// Expected output: true

console.log(map1.has('baz'));
// Expected output: false
```

### Map.prototype.delete(key)

- The delete() method of Map instances removes the specified element from this map by key.

`delete`方法删除某个键，返回true。如果删除失败，返回false。

```js
const map1 = new Map();
map1.set('bar', 'foo');

console.log(map1.delete('bar'));
// Expected result: true
// True indicates successful removal

console.log(map1.has('bar'));
// Expected result: false
```

### Map.prototype.clear()

- The clear() method of Map instances removes all elements from this map.

`clear`方法清除所有成员，没有返回值。

```js
const map1 = new Map();

map1.set('bar', 'baz');
map1.set(1, 'foo');

console.log(map1.size);
// Expected output: 2

map1.clear();

console.log(map1.size);
// Expected output: 0
```

### Map.prototype.keys()

- The keys() method of Map instances returns a new map iterator object that contains the keys for each element in this map in insertion order.

返回**键名**的遍历器。

```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.keys();

console.log(iterator1.next().value);
// Expected output: "0"

console.log(iterator1.next().value);
// Expected output: 1
```

### Map.prototype.values()

- The values() method of Map instances returns a new map iterator object that contains the values for each element in this map in insertion order.

返回**键值**的遍历器。

```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.values();

console.log(iterator1.next().value);
// Expected output: "foo"

console.log(iterator1.next().value);
// Expected output: "bar"
```

### Map.prototype.entries()

- The entries() method of Map instances returns a new map iterator object that contains the [key, value] pairs for each element in this map in insertion order.

返回**所有成员**的遍历器。

```js
const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1.entries();

console.log(iterator1.next().value);
// Expected output: Array ["0", "foo"]

console.log(iterator1.next().value);
// Expected output: Array [1, "bar"]
```

### Map.prototype.forEach()

- The forEach() method of Map instances executes a provided function once per each key/value pair in this map, in insertion order.

遍历 Map 的**所有成员**。

```js
function logMapElements(value, key, map) {
  console.log(`m[${key}] = ${value}`);
}

new Map([
  ['foo', 3],
  ['bar', {}],
  ['baz', undefined],
]).forEach(logMapElements);

// Expected output: "m[foo] = 3"
// Expected output: "m[bar] = [object Object]"
// Expected output: "m[baz] = undefined"
```

## Map实例化

`Map`构造函数接受数组作为参数，不仅仅是数组，任何具有 `Iterator` 接口、且每个成员都是一个双元素的数组的数据结构都可以当作`Map`构造函数的参数。`Set`和`Map`都可以用来生成新的 `Map`。

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

## WeakMap

`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。`WeakMap`的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。`WeakMap` **弱引用的只是键名**，而不是键值。键值依然是正常引用。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，`WeakMap` 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

`WeakMap` 与 `Map` 在 API 上的区别主要是两个，一是没有遍历操作（即没有`keys()`、`values()`和`entries()`方法），也没有`size`属性。

- `WeakMap` 只接受**对象**作为键名（null除外），不接受其他类型的值作为键名。
- `WeakMap` 的键名所指向的对象，不计入垃圾回收机制。

## 参考资料

[Map-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

[Map](https://www.bookstack.cn/read/es6-3rd/spilt.3.docs-set-map.md)

[WeakMap-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
