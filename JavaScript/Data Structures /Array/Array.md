# Array

收集数组常用的一些内置方法

## Array的静态方法
### Array.isArray()

确定传递的值是否是一个 Array。

- determines whether the passed value is an Array.

```js
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
```

### Array.of()

创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。总是返回参数值组成的数组。如果没有参数，就返回一个空数组。用来替代Array()或new Array()，行为统一。

- creates a new Array instance from a variable number of arguments, regardless of number or type of the arguments.

```js
Array.of(7); // [7]
Array.of(1, 2, 3); // [1, 2, 3]
Array(7); // array of 7 empty slots
Array(1, 2, 3); // [1, 2, 3]
```

### Array.from()

用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

- creates a new, shallow-copied Array instance from an array-like or iterable object.

create Arrays from:array-like objects (objects with a length property and indexed elements) or iterable objects (objects where you can get its elements, such as Map and Set).

```js
console.log(Array.from("foo"));
// expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// expected output: Array [2, 4, 6]
```

---

## Array的实例方法
### Array.prototype.splice()*

通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回**被修改的内容**。

此方法会**改变原数组**。

- changes the contents of an array by removing or replacing existing elements and/or adding new elements

```js
var months = ["Jan", "March", "April", "June"];
months.splice(1, 0, "Feb");
// inserts at index 1
console.log(months);
// expected output: Array ['Jan', 'Feb', 'March', 'April', 'June']

months.splice(4, 1, "May");
// replaces 1 element at index 4
console.log(months);
// expected output: Array ['Jan', 'Feb', 'March', 'April', 'May']
```

### Array.prototype.concat()

合并多个数组，不会改变原数组，最终会返回一个新数组。

- is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.

```js
var array1 = ["a", "b", "c"];
var array2 = ["d", "e", "f"];

console.log(array1.concat(array2));
// expected output: Array ["a", "b", "c", "d", "e", "f"]
```


### Array.prototype.slice()

返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括 end）。原始数组不会被改变。

- returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included) where begin and end represent the index of items in that array. The original array will not be modified.

```js
var animals = ["ant", "bison", "camel", "duck", "elephant"];

console.log(animals.slice(2));
// expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// expected output: Array ["camel", "duck"]

console.log(animals.slice(1, 5));
// expected output: Array ["bison", "camel", "duck", "elephant"]
```

### Array.prototype.join()

将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。

- creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator string. If the array has only one item, then that item will be returned without using the separator.

```js
var a = ["Wind", "Water", "Fire"];
a.join(); // 'Wind,Water,Fire'
a.join(", "); // 'Wind, Water, Fire'
a.join(" + "); // 'Wind + Water + Fire'
a.join(""); // 'WindWaterFire'
```

### Array.prototype.every()

传入一个函数判断数组的每一项真假，全为 true 返回 true，有 false 即返回 false，最终返回一个 Boolean 值。

- tests whether all elements in the array pass the test implemented by the provided function. It returns a Boolean value.

```js
[12, 5, 8, 130, 44].every((x) => x >= 10); // false
```

### Array.prototype.some()

传入一个函数判断数组的每一项真假，有 true 返回 true，全为 false 即返回 false，最终返回一个 Boolean 值。

- tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value.

```js
[2, 5, 8, 1, 4].some((x) => x > 10); //false
[12, 5, 8, 1, 4].some((x) => x > 10); // true
```

### Array.prototype.filter()

返回一个新数组, 包含了通过传入的函数过滤后的所有元素。

- creates a new array with all elements that pass the test implemented by the provided function.

```js
const fruits = ["apple", "banana", "grapes", "mango", "orange"];
const filterItems = (arr, query) => {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
};
console.log(filterItems(fruits, "ap")); // ['apple', 'grapes']
console.log(filterItems(fruits, "an")); // ['banana', 'mango', 'orange']
```

### Array.prototype.map()

返回一个新数组，包含了该数组中的每个元素调用一次传入的函数后的返回值。

- creates a new array with the results of calling a provided function on every element in the calling array.

```js
var numbers = [1, 2, 3, 4];
var filteredNumbers = numbers.map(function (num, index) {
  if (index < 3) {
    return num;
  }
});
//index goes from 0,so the filterNumbers are 1,2,3 and undefined.
// filteredNumbers is [1, 2, 3, undefined]
// numbers is still [1, 2, 3, 4]
```

### Array.prototype.reduce()

对数组中的每个元素执行一个由您提供的 reducer 函数（从左到右），将其结果汇总为**单个返回值**。

- executes a reducer function (that you provide) on each element of the array, resulting in a single output value.

reduce 为数组中的每一个元素依次执行 callback 函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：

- accumulator 累计器
- currentValue 当前值
- currentIndex 当前索引
- array 数组

回调函数第一次执行时，accumulator 和 currentValue 的取值有两种情况：如果调用 reduce()时提供了 initialValue，accumulator 取值为 initialValue，currentValue 取数组中的第一个值；如果没有提供 initialValue，那么 accumulator 取数组中的第一个值，currentValue 取数组中的第二个值。

```js
[0, 1, 2, 3, 4].reduce(
  (accumulator, currentValue, currentIndex, array) => accumulator + currentValue
);
```

### Array.prototype.reduceRight()

- applies a function against an accumulator and each value of the array (from right-to-left) to reduce it to a single value.

接受一个函数作为累加器（accumulator）和数组的每个值（从右到左）将其减少为单个值。

```js
const array1 = [
  [0, 1],
  [2, 3],
  [4, 5],
].reduceRight((accumulator, currentValue) => accumulator.concat(currentValue));

console.log(array1);
// expected output: Array [4, 5, 2, 3, 0, 1]
```

### Array.prototype.find()/Array.prototype.findLast()

- The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.

数组实例的find方法，用于**找出第一个符合条件的数组成员**。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后**返回该成员**。如果没有符合条件的成员，则返回undefined。

```js
const array1 = [5, 12, 8, 130, 44];

const found = array1.find(element => element > 10);

console.log(found);
// Expected output: 12

const array1 = [5, 12, 50, 130, 44];

const found = array1.findLast((element) => element > 45);

console.log(found);
// Expected output: 130
```

### Array.prototype.findIndex()/Array.prototype.findLastIndex()

- The findIndex() method returns the index of the first element in an array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned.

数组实例的findIndex方法，**返回第一个符合条件的数组成员的位置**，如果所有成员都不符合条件，则返回-1。

```js
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2

const array1 = [5, 12, 50, 130, 44];

const isLargeNumber = (element) => element > 45;

console.log(array1.findLastIndex(isLargeNumber));
// Expected output: 3
// Index of element with value: 130
```

### Array.prototype.fill()
- The fill() method changes all elements in an array to a static value, from a start index (default 0) to an end index (default array.length). It returns the modified array.

fill方法使用给定值，填充一个数组。

```js
let arr = new Array(3).fill({name: "Mike"});
arr[0].name = "Ben";
// [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]
```

### Array.prototype.entries()/Array.prototype.keys()/Array.prototype.values()
- returns a new Array Iterator object that contains the key/value pairs for each index in the array.

keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

```js
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'
```

### Array.prototype.includes()
- The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.

返回一个**布尔值**，表示某个数组是否包含给定的值。

```js
const array1 = [1, 2, 3];

console.log(array1.includes(2));
// Expected output: true

const pets = ['cat', 'dog', 'bat'];

console.log(pets.includes('cat'));
// Expected output: true

console.log(pets.includes('at'));
// Expected output: false
```

### Array.prototype.indexOf()
- The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.

返回找到的**第一个给定值的索引**，找不到则返回-1，表示某个数组是否包含给定的值。

```js
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

console.log(beasts.indexOf('bison'));
// Expected output: 1

// Start from index 2
console.log(beasts.indexOf('bison', 2));
// Expected output: 4

console.log(beasts.indexOf('giraffe'));
// Expected output: -1
```



[Array-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)