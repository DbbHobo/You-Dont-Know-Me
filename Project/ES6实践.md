# ES6 实践

## let 和 const

在我们开发的时候，可能认为应该默认使用 `let` 而不是 `var`，这种情况下，对于需要写保护的变量要使用 `const`。

然而另一种做法日益普及：默认使用 `const`，只有当确实需要改变变量的值的时候才使用 `let`。这是因为大部分的变量的值在初始化后不应再改变，而预料之外的变量的修改是很多 bug 的源头。

```js
// bad
var foo = 'bar';

// good
let foo = 'bar';

// better
const foo = 'bar';
```

## 模板字符串

- 模板字符串

需要拼接字符串的时候尽量改成使用模板字符串:

```js
// bad
const foo = 'this is a' + example;

// good
const foo = `this is a ${example}`;
```

- 标签模板

可以借助标签模板优化书写方式:

```js
// 例子 2-2

let url = oneLine `
    www.taobao.com/example/index.html
    ?foo=${foo}
    &bar=${bar}
`;

console.log(url); // www.taobao.com/example/index.html?foo=foo&bar=bar
```

## 箭头函数

优先使用箭头函数，不过以下几种情况避免使用：

- 不要使用箭头函数定义对象的方法

```js
// bad
let foo = {
  value: 1,
  getValue: () => console.log(this.value)
}

foo.getValue();  // undefined
```

- 不要定义原型方法

```js
// bad
function Foo() {
  this.value = 1
}

Foo.prototype.getValue = () => console.log(this.value)

let foo = new Foo()
foo.getValue();  // undefined
```

- 不要作为事件的回调函数

```js
// bad
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window); // => true
    this.innerHTML = 'Clicked button';
});
```

## Symbol

- 唯一值

```js
// bad
// 1. 创建的属性会被 for-in 或 Object.keys() 枚举出来
// 2. 一些库可能在将来会使用同样的方式，这会与你的代码发生冲突
if (element.isMoving) {
  smoothAnimations(element);
}
element.isMoving = true;

// good
if (element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__) {
  smoothAnimations(element);
}
element.__$jorendorff_animation_library$PLEASE_DO_NOT_USE_THIS_PROPERTY$isMoving__ = true;

// better
var isMoving = Symbol("isMoving");

...

if (element[isMoving]) {
  smoothAnimations(element);
}
element[isMoving] = true;
```

- 魔术字符串

魔术字符串指的是在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。魔术字符串不利于修改和维护，风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

```js
// bad
const TYPE_AUDIO = 'AUDIO'
const TYPE_VIDEO = 'VIDEO'
const TYPE_IMAGE = 'IMAGE'

// good
const TYPE_AUDIO = Symbol()
const TYPE_VIDEO = Symbol()
const TYPE_IMAGE = Symbol()

function handleFileResource(resource) {
  switch(resource.type) {
    case TYPE_AUDIO:
      playAudio(resource)
      break
    case TYPE_VIDEO:
      playVideo(resource)
      break
    case TYPE_IMAGE:
      previewImage(resource)
      break
    default:
      throw new Error('Unknown type of resource')
  }
}
```

- 私有变量

`Symbol` 也可以用于私有变量的实现。

```js
const Example = (function() {
    var _private = Symbol('private');

    class Example {
        constructor() {
          this[_private] = 'private';
        }
        getName() {
          return this[_private];
        }
    }

    return Example;
})();

var ex = new Example();

console.log(ex.getName()); // private
console.log(ex.name); // undefined
```

## Set 和 Map

- 数组去重

```js
[...new Set(array)]
```

- 条件语句的优化

```js
// 根据颜色找出对应的水果

// bad
function test(color) {
  switch (color) {
    case 'red':
      return ['apple', 'strawberry'];
    case 'yellow':
      return ['banana', 'pineapple'];
    case 'purple':
      return ['grape', 'plum'];
    default:
      return [];
  }
}

test('yellow'); // ['banana', 'pineapple']
// good
const fruitColor = {
  red: ['apple', 'strawberry'],
  yellow: ['banana', 'pineapple'],
  purple: ['grape', 'plum']
};

function test(color) {
  return fruitColor[color] || [];
}
// better
const fruitColor = new Map()
  .set('red', ['apple', 'strawberry'])
  .set('yellow', ['banana', 'pineapple'])
  .set('purple', ['grape', 'plum']);

function test(color) {
  return fruitColor.get(color) || [];
}
```

## for of

- 遍历范围

`for...of` 循环可以使用的范围包括：

数组
Set
Map
类数组对象，如 arguments 对象、DOM NodeList 对象
Generator 对象
字符串

- 优势
ES2015 引入了 `for..of` 循环，它结合了 `forEach` 的简洁性和中断循环的能力：

```js
for (const v of ['a', 'b', 'c']) {
  console.log(v);
}
// a b c

for (const [i, v] of ['a', 'b', 'c'].entries()) {
  console.log(i, v);
}
// 0 "a"
// 1 "b"
// 2 "c"
```

- 遍历 Map

```js
let map = new Map(arr);

// 遍历 key 值
for (let key of map.keys()) {
  console.log(key);
}

// 遍历 value 值
for (let value of map.values()) {
  console.log(value);
}

// 遍历 key 和 value 值(一)
for (let item of map.entries()) {
  console.log(item[0], item[1]);
}

// 遍历 key 和 value 值(二)
for (let [key, value] of data) {
  console.log(key)
}
```

## Promise

- 基本示例

```js
// bad
request(url, function(err, res, body) {
    if (err) handleError(err);
    fs.writeFile('1.txt', body, function(err) {
        request(url2, function(err, res, body) {
            if (err) handleError(err)
        })
    })
});

// good
request(url)
.then(function(result) {
    return writeFileAsynv('1.txt', result)
})
.then(function(result) {
    return request(url2)
})
.catch(function(e){
    handleError(e)
});
```

- finally

```js
fetch('file.json')
.then(data => data.json())
.catch(error => console.error(error))
.finally(() => console.log('finished'));
```

## Async

- 代码更加简洁

```js
// good
function fetch() {
  return (
    fetchData()
    .then(() => {
      return "done"
    });
  )
}

// better
async function fetch() {
  await fetchData()
  return "done"
};
// 例子 8-2

// good
function fetch() {
  return fetchData()
  .then(data => {
    if (data.moreData) {
        return fetchAnotherData(data)
        .then(moreData => {
          return moreData
        })
    } else {
      return data
    }
  });
}

// better
async function fetch() {
  const data = await fetchData()
  if (data.moreData) {
    const moreData = await fetchAnotherData(data);
    return moreData
  } else {
    return data
  }
};
```

```js
// good
function fetch() {
  return (
    fetchData()
    .then(value1 => {
      return fetchMoreData(value1)
    })
    .then(value2 => {
      return fetchMoreData2(value2)
    })
  )
}

// better
async function fetch() {
  const value1 = await fetchData()
  const value2 = await fetchMoreData(value1)
  return fetchMoreData2(value2)
};
```

- 错误处理

```js
// good
function fetch() {
  try {
    fetchData()
      .then(result => {
        const data = JSON.parse(result)
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}

// better
async function fetch() {
  try {
    const data = JSON.parse(await fetchData())
  } catch (err) {
    console.log(err)
  }
};
```

- "async 地狱"

```js
// bad
(async () => {
  const getList = await getList();
  const getAnotherList = await getAnotherList();
})();

// good
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();

// good
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

## Class

- 构造函数尽可能使用 `Class` 的形式

```js
class Foo {
  static bar () {
    this.baz();
  }
  static baz () {
    console.log('hello');
  }
  baz () {
    console.log('world');
  }
}

Foo.bar(); // hello
```

```js
class Shape {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get area() {
    return this._width * this._height;
  }
}

const square = new Shape(10, 10);
console.log(square.area);    // 100
console.log(square._width);  // 10
```

## Decorator

- log

```js
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}
```

- autobind

```js
class Toggle extends React.Component {

  @autobind
  handleClick() {
    console.log(this)
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        button
      </button>
    );
  }
}
```

- debounce

```js
class Toggle extends React.Component {

  @debounce(500, true)
  handleClick() {
    console.log('toggle')
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        button
      </button>
    );
  }
}
```

- `React` 与 `Redux`

```js
// good
class MyReactComponent extends React.Component {}

export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);

// better
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {};
```

## 函数

- 默认值

```js
// bad
function test(quantity) {
  const q = quantity || 1;
}

// good
function test(quantity = 1) {
  ...
}
```

```js
doSomething({ foo: 'Hello', bar: 'Hey!', baz: 42 });

// bad
function doSomething(config) {
  const foo = config.foo !== undefined ? config.foo : 'Hi';
  const bar = config.bar !== undefined ? config.bar : 'Yo!';
  const baz = config.baz !== undefined ? config.baz : 13;
}

// good
function doSomething({ foo = 'Hi', bar = 'Yo!', baz = 13 }) {
  ...
}

// better
function doSomething({ foo = 'Hi', bar = 'Yo!', baz = 13 } = {}) {
  ...
}
```

```js
// bad
const Button = ({className}) => {
  const classname = className || 'default-size';
  return <span className={classname}></span>
};

// good
const Button = ({className = 'default-size'}) => (
  <span className={classname}></span>
);

// better
const Button = ({className}) =>
  <span className={className}></span>
}

Button.defaultProps = {
  className: 'default-size'
}
```

```js
const required = () => {throw new Error('Missing parameter')};

const add = (a = required(), b = required()) => a + b;

add(1, 2) // 3
add(1); // Error: Missing parameter.
```

## 解构赋值

- 对象的基本解构

```js
componentWillReceiveProps(newProps) {
  this.setState({
    active: newProps.active
  })
}

componentWillReceiveProps({active}) {
  this.setState({active})
}
```

```js
handleEvent = () => {
  this.setState({
    data: this.state.data.set("key", "value")
  })
};

// good
handleEvent = () => {
  this.setState(({data}) => ({
    data: data.set("key", "value")
  }))
};
```

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)])
.then(([x, y]) => {
    console.log(x, y);
});
```

- 对象深度解构

```js
// bad
function test(fruit) {
  if (fruit && fruit.name)  {
    console.log (fruit.name);
  } else {
    console.log('unknown');
  }
}

// good
function test({name} = {}) {
  console.log (name || 'unknown');
}
```

```js
let obj = {
    a: {
      b: {
        c: 1
      }
    }
};

const {a: {b: {c = ''} = ''} = ''} = obj;
```

- 数组解构

```js
// bad
const splitLocale = locale.split("-");
const language = splitLocale[0];
const country = splitLocale[1];

// good
const [language, country] = locale.split('-');
```

- 变量重命名

```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
console.log(baz); // "aaa"
```

- 仅获取部分属性

```js
function test(input) {
  return [left, right, top, bottom];
}
const [left, __, top] = test(input);

function test(input) {
  return { left, right, top, bottom };
}
const { left, right } = test(input);
```

- 增强的对象字面量

```js
// bad
const something = 'y'
const x = {
  something: something
}

// good
const something = 'y'
const x = {
  something
};
```

- 动态属性

```js
const x = {
  ['a' + '_' + 'b']: 'z'
}

console.log(x.a_b); // z
```

## 数组的拓展方法

- keys

```js
var arr = ["a", , "c"];

var sparseKeys = Object.keys(arr);
console.log(sparseKeys); // ['0', '2']

var denseKeys = [...arr.keys()];
console.log(denseKeys);  // [0, 1, 2]
```

- entries

```js
var arr = ["a", "b", "c"];
var iterator = arr.entries();

for (let e of iterator) {
    console.log(e);
}
```

- values

```js
let arr = ['w', 'y', 'k', 'o', 'p'];
let eArr = arr.values();

for (let letter of eArr) {
  console.log(letter);
}
```

- includes

```js
// bad
function test(fruit) {
  if (fruit == 'apple' || fruit == 'strawberry') {
    console.log('red');
  }
}

// good
function test(fruit) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];
  if (redFruits.includes(fruit)) {
    console.log('red');
  }
}
```

- find

```js
var inventory = [
    {name: 'apples', quantity: 2},
    {name: 'bananas', quantity: 0},
    {name: 'cherries', quantity: 5}
];

function findCherries(fruit) {
    return fruit.name === 'cherries';
}

console.log(inventory.find(findCherries)); // { name: 'cherries', quantity: 5 }
```

- findIndex

```js
function isPrime(element, index, array) {
  var start = 2;
  while (start <= Math.sqrt(element)) {
    if (element % start++ < 1) {
      return false;
    }
  }
  return element > 1;
}

console.log([4, 6, 8, 12].findIndex(isPrime)); // -1, not found
console.log([4, 6, 7, 12].findIndex(isPrime)); // 2
```

## 数组新增方法includes、find等

- if中判断条件，利用数组的includes方法：

```js
// bad
if(
    type == 1 ||
    type == 2 ||
    type == 3 ||
    type == 4 ||
){
   //...
}

// good
const condition = [1,2,3,4];

if( condition.includes(type) ){
   //...
}
```

- 列表搜索

```js
// bad
const a = [1,2,3,4,5];
const result = a.filter( 
  item =>{
    return item === 3
  }
)
// good
const a = [1,2,3,4,5];
const result = a.find( 
  item =>{
    return item === 3
  }
)
```

- 输入框非空判断
  
```js
// bad
if(value !== null && value !== undefined && value !== ''){
    //...
}

// good
if((value??'') !== ''){
  //...
}
```

## 拓展运算符(...)

- arguments 转数组

```js
// bad
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// good
const sortNumbers = (...numbers) => numbers.sort();
```

- 调用参数

```js
// bad
Math.max.apply(null, [14, 3, 77])

// good
Math.max(...[14, 3, 77])
// 等同于
Math.max(14, 3, 77);
```

- 构建对象
剔除部分属性，将剩下的属性构建一个新的对象

```js
let [a, b, ...arr] = [1, 2, 3, 4, 5];

const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4, e: 5 };
```

有条件的构建对象

```js
// bad
function pick(data) {
  const { id, name, age} = data

  const res = { guid: id }

  if (name) {
    res.name = name
  }
  else if (age) {
    res.age = age
  }

  return res
}

// good
function pick({id, name, age}) {
  return {
    guid: id,
    ...(name && {name}),
    ...(age && {age})
  }
}
```

合并对象

```js
let obj1 = { a: 1, b: 2,c: 3 }
let obj2 = { b: 4, c: 5, d: 6}
let merged = {...obj1, ...obj2};
```

- React
将对象全部传入组件

```js
const parmas =  {value1: 1, value2: 2, value3: 3}

<Test {...parmas} />
```

## 双冒号运算符(::)

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。
```

```js
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);
```

## optional-chaining(?.)

```js
const obj = {
  foo: {
    bar: {
      baz: 42,
    },
  },
};

const baz = obj?.foo?.bar?.baz; // 42
```

同样支持函数：

```js
function test() {
  return 42;
}
test?.(); // 42

exists?.(); // undefined
```

需要添加 @babel/plugin-proposal-optional-chaining 插件支持

## Nullish coalescing operator(??)

空值合并运算符（??）是一个逻辑运算符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。

```js
a ?? b

// 相当于

(a !== null && a !== void 0) ? a : b
```

```js
var foo = object.foo ?? "default";

// 相当于

var foo = (object.foo != null) ? object.foo : "default";
```

需要 @babel/plugin-proposal-nullish-coalescing-operator 插件支持

## Nullish coalescing assignment(??=)

逻辑空赋值运算符（x ??= y）仅在 **x 是空值**（null 或 undefined）时对其赋值。

```js
const a = { duration: 50 };

a.speed ??= 25;
console.log(a.speed);
// Expected output: 25

a.duration ??= 10;
console.log(a.duration);
// Expected output: 50
```

## logical-assignment-operators(||= &&=)

逻辑或赋值（x ||= y）运算仅在 **x 为假**值时为其赋值。

逻辑与赋值（x &&= y）运算仅在 **x 为真**值时为其赋值。

```js
a ||= b;

obj.a.b ||= c;

a &&= b;

obj.a.b &&= c;
```

Babel 编译为：

```js
var _obj$a, _obj$a2;

a || (a = b);

(_obj$a = obj.a).b || (_obj$a.b = c);

a && (a = b);

(_obj$a2 = obj.a).b && (_obj$a2.b = c);
```

出现的原因：

```js
function example(a = b) {
  // a 必须是 undefined
  if (!a) {
    a = b;
  }
}

function numeric(a = b) {
  // a 必须是 null 或者 undefined
  if (a == null) {
    a = b;
  }
}

// a 可以是任何 falsy 的值
function example(a = b) {
  // 可以，但是一定会触发 setter
  a = a || b;

  // 不会触发 setter，但可能会导致 lint error
  a || (a = b);

  // 就有人提出了这种写法：
  a ||= b;
}
```

需要 @babel/plugin-proposal-logical-assignment-operators 插件支持

## pipeline-operator(|>)

```js
const double = (n) => n * 2;
const increment = (n) => n + 1;

// 没有用管道操作符
double(increment(double(5))); // 22

// 用上管道操作符之后
5 |> double |> increment |> double; // 22
```

## 参考资料

[ES6 完全使用手册](https://github.com/mqyqingfeng/Blog/issues/111)

[你会用ES6，那倒是用啊！](https://juejin.cn/post/7016520448204603423)

[The long path of JavaScript - from ES6 until today.](https://dev.to/fsh02/the-long-path-of-javascript-from-es6-until-today-3gc3?context=digest)

[ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
