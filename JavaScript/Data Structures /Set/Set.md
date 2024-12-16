# Set

`Set`对象是**值的集合**，你可以按照插入的**顺序**迭代它的元素。`Set` 中的元素只会出现一次，即 `Set` 中的元素是**唯一**的。`Set`和`Map`类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key。

向 `Set` 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。`Set` 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（`===`），主要的区别是向 `Set` 加入值时认为 `NaN` 等于自身，而精确相等运算符认为 `NaN` 不等于自身。

Set objects are collections of values. A value in the set may only occur once; it is unique in the set's collection. You can iterate through the elements of a set in insertion order. The insertion order corresponds to the order in which each element was inserted into the set by the add() method successfully (that is, there wasn't an identical element already in the set when add() was called).

- `Set`的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 `Set` 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
- `Array.from()` 方法可以将 `Set` 结构转为数组。

## Set的静态属性、方法

---

## Set的实例属性、方法

`Set` 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。`Set` 的遍历顺序就是插入顺序。

### Set.prototype.size

- The size accessor property of Set instances returns the number of (unique) elements in this set.

返回`Set`对象中的值的个数

```js
const set1 = new Set();
const object1 = {};

set1.add(42);
set1.add('forty two');
set1.add('forty two');
set1.add(object1);

console.log(set1.size);
// Expected output: 3
```

### Set.prototype.add(value)

- The add() method of Set instances inserts a new element with a specified value in to this set, if there isn't an element with the same value already in this set

添加某个值，返回 `Set` 结构本身。

```js
const set1 = new Set();

set1.add(42);
set1.add(42);
set1.add(13);

for (const item of set1) {
  console.log(item);
  // Expected output: 42
  // Expected output: 13
}
```

### Set.prototype.delete(value)

- The delete() method of Set instances removes a specified value from this set, if it is in the set.

删除某个值，返回一个布尔值，表示删除是否成功。

```js
const set1 = new Set();
set1.add({ x: 10, y: 20 }).add({ x: 20, y: 30 });

// Delete any point with `x > 10`.
set1.forEach((point) => {
  if (point.x > 10) {
    set1.delete(point);
  }
});

console.log(set1.size);
// Expected output: 1
```

### Set.prototype.has(value)

- The has() method of Set instances returns a boolean indicating whether an element with the specified value exists in this set or not.

返回一个布尔值，表示该值是否为`Set`的成员。

```js
const set1 = new Set([1, 2, 3, 4, 5]);

console.log(set1.has(1));
// Expected output: true

console.log(set1.has(5));
// Expected output: true

console.log(set1.has(6));
// Expected output: false
```

### Set.prototype.clear()

- The clear() method of Set instances removes all elements from this set.

清除所有成员，没有返回值。

```js
const set1 = new Set();
set1.add(1);
set1.add('foo');

console.log(set1.size);
// Expected output: 2

set1.clear();

console.log(set1.size);
// Expected output: 0
```

### Set.prototype.keys()

- The keys() method of Set instances is an alias for the values() method.

返回**键名**的遍历器

```js
const mySet = new Set();
mySet.add("foo");
mySet.add("bar");
mySet.add("baz");

const setIter = mySet.keys();

console.log(setIter.next().value); // "foo"
console.log(setIter.next().value); // "bar"
console.log(setIter.next().value); // "baz"
```

### Set.prototype.values()

- The values() method of Set instances returns a new set iterator object that contains the values for each element in this set in insertion order.

返回**键值**的遍历器

```js
const set1 = new Set();
set1.add(42);
set1.add('forty two');

const iterator1 = set1.values();

console.log(iterator1.next().value);
// Expected output: 42

console.log(iterator1.next().value);
// Expected output: "forty two"
```

### Set.prototype.entries()

- The entries() method of Set instances returns a new set iterator object that contains an array of [value, value] for each element in this set, in insertion order. For Set objects there is no key like in Map objects. However, to keep the API similar to the Map object, each entry has the same value for its key and value here, so that an array [value, value] is returned.

返回**键值对**的遍历器，按照添加的顺序遍历

```js
const set1 = new Set();
set1.add(42);
set1.add('forty two');

const iterator1 = set1.entries();

for (const entry of iterator1) {
  console.log(entry);
  // Expected output: Array [42, 42]
  // Expected output: Array ["forty two", "forty two"]
}
```

### Set.prototype.forEach()

- The forEach() method of Set instances executes a provided function once for each value in this set, in insertion order.

使用**回调函数**遍历每个成员

```js
function logSetElements(value1, value2, set) {
  console.log(`s[${value1}] = ${value2}`);
}

new Set(['foo', 'bar', undefined]).forEach(logSetElements);

// Expected output: "s[foo] = foo"
// Expected output: "s[bar] = bar"
// Expected output: "s[undefined] = undefined"
```

`keys`方法、`values`方法、`entries`方法返回的都是遍历器对象。由于 `Set` 结构没有键名，只有键值（或者说键名和键值是同一个值），所以`keys`方法和`values`方法的行为完全一致。

### Set.prototype.difference()

- The difference() method of Set instances takes a set and returns a new set containing elements in this set but not in the given set.

Set 实例的 difference() 方法接受一个集合并返回一个新的集合，其中包含当前集合中存在但给定集合中不存在的所有元素。(差集)

```js
const odds = new Set([1, 3, 5, 7, 9]);
const squares = new Set([1, 4, 9]);
// odds中存在但squares中不存在的内容
console.log(odds.difference(squares)); // Set(3) { 3, 5, 7 }
```

### Set.prototype.intersection()

- The intersection() method of Set instances takes a set and returns a new set containing elements in both this set and the given set.

Set 实例的 difference() 方法接受一个集合并返回一个新的集合，其中包含当前集合中存在且给定集合中也存在的所有元素。(交集)

```js
const odds = new Set([1, 3, 5, 7, 9]);
const squares = new Set([1, 4, 9]);
// odds中存在且squares中也存在的内容
console.log(odds.intersection(squares)); // Set(2) { 1, 9 }
```

### Set.prototype.symmetricDifference()

- The symmetricDifference() method of Set instances takes a set and returns a new set containing elements which are in either this set or the given set, but not in both.

Set 实例的 difference() 方法接受一个集合并返回一个新的集合，其中包含元素要么在当前集合中要么在给定集合中但并不同时存在于两个集合。(补集)

```js
const evens = new Set([2, 4, 6, 8]);
const squares = new Set([1, 4, 9]);
console.log(evens.symmetricDifference(squares)); // Set(5) { 2, 6, 8, 1, 9 }
```

### Set.prototype.union()

Set 实例的 union() 方法接受一个集合并返回包含当前集合与给定集合中存在的所有元素的新集合。（并集）

```js
const evens = new Set([2, 4, 6, 8]);
const squares = new Set([1, 4, 9]);
console.log(evens.union(squares)); // Set(6) { 2, 4, 6, 8, 1, 9 }
```

### Set.prototype.isDisjointFrom()

- The isDisjointFrom() method of Set instances takes a set and returns a boolean indicating if this set has no elements in common with the given set.

Set 实例的 isDisjointFrom() 方法接受一个集合并返回一个布尔值来指示当前集合与给定集合是否不存在公共元素。(集合不相交为true)

```js
const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
const squares = new Set([1, 4, 9, 16]);
console.log(primes.isDisjointFrom(squares)); // true
```

### Set.prototype.isSubsetOf()

- The isSubsetOf() method of Set instances takes a set and returns a boolean indicating if all elements of this set are in the given set.

```js
const fours = new Set([4, 8, 12, 16]);
const evens = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
console.log(fours.isSubsetOf(evens)); // true
```

### Set.prototype.isSupersetOf()

- The isSupersetOf() method of Set instances takes a set and returns a boolean indicating if all elements of the given set are in this set.

```js
const evens = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
const fours = new Set([4, 8, 12, 16]);
console.log(evens.isSupersetOf(fours)); // true
```

## Set实例化

`Set`本身是一个构造函数，用来生成 `Set` 数据结构。`Set`函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

```js
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]
// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5
// 例三
const set = new 
```

## WeakSet

`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 `Set` 有两个区别。

- `WeakSet` 的成员只能是**对象**，而不能是其他类型的值。
- `WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中。`WeakSet` 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 `WeakSet` 里面的引用就会自动消失。
- `WeakSet` 的一个用处，是储存 `DOM` 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

## 参考资料

[Set-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

[Set](https://www.bookstack.cn/read/es6-3rd/spilt.1.docs-set-map.md)

[WeakSet-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
