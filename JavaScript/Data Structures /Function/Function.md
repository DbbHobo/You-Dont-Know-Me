# Function

## 静态属性

### Function.length

Function 实例的 length 数据属性表示函数期望的参数数量。

- The length data property of a Function instance indicates the number of parameters expected by the function.

```js
function func1() {}

function func2(a, b) {}

console.log(func1.length);
// Expected output: 0

console.log(func2.length);
// Expected output: 2
```

### Function.name

Function 实例的 name 数据属性表示函数在创建时指定的名称，或者如果函数是匿名函数，则名称可以是 anonymous 或 ''（空字符串）。

- The name data property of a Function instance indicates the function's name as specified when it was created, or it may be either anonymous or '' (an empty string) for functions created anonymously.

```js
const func1 = function () {};

const object = {
  func2: function () {},
};

console.log(func1.name);
// Expected output: "func1"

console.log(object.func2.name);
// Expected output: "func2"
```

### Function.prototype

当 Function 实例作为构造函数与 new 运算符一起使用时，该实例的 prototype 数据属性将用作新对象的原型。

```js
function Ctor() {}
const inst = new Ctor();
console.log(Object.getPrototypeOf(inst) === Ctor.prototype); // true
```

## 实例方法

### Function.prototype.apply()

- The apply() method of Function instances calls this function with a given this value, and arguments provided as an array (or an array-like object).

```js
const numbers = [5, 6, 2, 3, 7];

const max = Math.max.apply(null, numbers);

console.log(max);
// Expected output: 7

const min = Math.min.apply(null, numbers);

console.log(min);
// Expected output: 2


const array = ["a", "b"];
const elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

### Function.prototype.bind()

- The bind() method of Function instances creates a new function that, when called, calls this function with its this keyword set to the provided value, and a given sequence of arguments preceding any provided when the new function is called.

```js
function log(...args) {
  console.log(this, ...args);
}
const boundLog = log.bind("this value", 1, 2);
const boundLog2 = boundLog.bind("new this value", 3, 4);
boundLog2(5, 6); // "this value", 1, 2, 3, 4, 5, 6
```

### Function.prototype.call()

- The bind() method of Function instances creates a new function that, when called, calls this function with its this keyword set to the provided value, and a given sequence of arguments preceding any provided when the new function is called.

```js
function greet() {
  console.log(this.animal, "typically sleep between", this.sleepDuration);
}

const obj = {
  animal: "cats",
  sleepDuration: "12 and 16 hours",
};

greet.call(obj); // cats typically sleep between 12 and 16 hours
```

### Function.prototype[Symbol.hasInstance]()

- The [Symbol.hasInstance]() method of Function instances specifies the default procedure for determining if a constructor function recognizes an object as one of the constructor's instances. It is called by the instanceof operator.

```js
class Foo {}
const foo = new Foo();
console.log(foo instanceof Foo === Foo[Symbol.hasInstance](foo)); // true
```

### Function.prototype.toString()

- The toString() method of Function instances returns a string representing the source code of this function.

```js
function sum(a, b) {
  return a + b;
}

console.log(sum.toString());
// Expected output: "function sum(a, b) {
//                     return a + b;
//                   }"

console.log(Math.abs.toString());
// Expected output: "function abs() { [native code] }"
```

## 参考资料

[Function-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
