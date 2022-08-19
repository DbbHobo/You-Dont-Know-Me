# Symbol

### symbol的定义

Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。基本上，它是一种类似于字符串的数据类型。

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。

```js
let s = Symbol();
typeof s
// "symbol"
```

### 属性名遍历

Symbol 作为属性名，遍历对象的时候，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。

但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

由于以 Symbol 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

### symbol的使用场景

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。

#### 应用一：防止XSS
在React的ReactElement对象中，有一个?typeof属性，它是一个Symbol类型的变量：
```js
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
```
ReactElement.isValidElement函数用来判断一个React组件是否是有效的，下面是它的具体实现。
```js
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.?typeof === REACT_ELEMENT_TYPE;
};
```
复制代码可见React渲染时会把没有?typeof标识，以及规则校验不通过的组件过滤掉。
如果你的服务器有一个漏洞，允许用户存储任意JSON对象， 而客户端代码需要一个字符串，这可能会成为一个问题：
```js
// JSON
let expectedTextButGotJSON = {
  type: 'div',
  props: {
    dangerouslySetInnerHTML: {
      __html: '/* put your exploit here */'
    },
  },
};
let message = { text: expectedTextButGotJSON };
<p>
  {message.text}
</p>
```
而JSON中不能存储Symbol类型的变量，这就是防止XSS的一种手段。

#### 应用二：私有属性
借助Symbol类型的不可枚举，我们可以在类中模拟私有属性，控制变量读写：
```js
const privateField = Symbol();
class myClass {
  constructor(){
    this[privateField] = 'ConardLi';
  }
  getField(){
    return this[privateField];
  }
  setField(val){
    this[privateField] = val;
  }
}
```

#### 应用三：防止属性污染
在某些情况下，我们可能要为对象添加一个属性，此时就有可能造成属性覆盖，用Symbol作为对象属性可以保证永远不会出现同名属性。
例如下面的场景，我们模拟实现一个call方法：
```js
    Function.prototype.myCall = function (context) {
      if (typeof this !== 'function') {
        return undefined; // 用于防止 Function.prototype.myCall() 直接调用
      }
      context = context || window;
      const fn = Symbol();
      context[fn] = this;
      const args = [...arguments].slice(1);
      const result = context[fn](...args);
      delete context[fn];
      return result;
    }
```
我们需要在某个对象上临时调用一个方法，又不能造成属性污染，Symbol是一个很好的选择。
