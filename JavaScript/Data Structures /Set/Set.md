# Set

`Set`对象是值的集合，你可以按照插入的**顺序**迭代它的元素。`Set` 中的元素只会出现一次，即 Set 中的元素是**唯一**的。`Set`和`Map`类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在`Set`中，没有重复的key。

---
## Set的静态属性、方法

### Set.prototype.size
返回`Set`实例的成员总数。

### Set.prototype.constructor
构造函数，默认就是`Set`函数。

### Set.prototype.size
返回`Set`实例的成员总数。

---
## Set的实例属性

### Set.prototype.size
返回`Set`对象中的值的个数

---
## Set的实例方法

`Set` 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

需要特别指出的是，`Set`的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 `Set` 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

### Set.prototype.add(value)
添加某个值，返回 `Set` 结构本身。

### Set.prototype.delete(value)
删除某个值，返回一个布尔值，表示删除是否成功。

### Set.prototype.has(value)
返回一个布尔值，表示该值是否为`Set`的成员。

### Set.prototype.clear()
清除所有成员，没有返回值。

### Set.prototype.keys()
返回**键名**的遍历器

### Set.prototype.values()
返回**键值**的遍历器

### Set.prototype.entries()
返回**键值对**的遍历器

### Set.prototype.forEach()
使用**回调函数**遍历每个成员

# WeakSet
`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 `Set` 有两个区别。

- `WeakSet` 的成员只能是**对象**，而不能是其他类型的值。
- `WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中。
