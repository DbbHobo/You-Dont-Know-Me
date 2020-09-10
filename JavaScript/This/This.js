/*
  理解this
*/
var foo = 'Global'; // 全局对象有一个foo变量,用var声明时会产生这个全局变量
let obj = { foo: 'Im from obj' }; // obj对象有一个foo属性
let objHaveFn = {
  foo: 'Im from objHaveFn',
  fakeThis: whatsThis
};  // objHaveFn对象有一个foo属性

function whatsThis(something) {
  this.something = something;
  console.log(this.foo);  // 这边的this指的是什么取决于这个函数如何被调用
}

console.group('---理解this---');
whatsThis();           // 直接调用-whatsThis的执行环境在全局环境，这里的this指向全局对象
whatsThis.call(obj);   // 显式绑定-call方法把this指向obj
whatsThis.apply(obj);  // 显式绑定-apply方法把this指向obj
whatsThis.bind(obj)(); // 显式绑定-bind方法把this指向obj
objHaveFn.fakeThis();  // 隐式绑定-whatsThis的执行环境在objHaveFn中，这里的this指向objHaveFn
let newObj = new whatsThis('Im from new');
console.log(newObj.something);  // new绑定-用new新建一个对象时，构造函数内部this会被指向这个新对象
console.groupEnd();

/*
  实现call
*/
Function.prototype.fakeCall = function (context) {
  let context = context || window;
  context.fn = this;
  let args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
}