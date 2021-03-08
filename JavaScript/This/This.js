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
Function.prototype.fakeCall = function (obj) {
  let context = obj || window;// call的第一个入参是调用call的函数的this指向，也就是确定要执行的函数的执行环境
  context.fn = this;// 把函数绑定到这个执行对象上
  let args = [...arguments].slice(1);// 获取剩下的参数
  console.log([...arguments])
  let result = context.fn(...args);// 通过绑定的这个执行对象来调用函数
  delete context.fn;// 删除绑定关系
  return result;// 返回执行结果
}
/*
  测试用例-call
*/
var callText = 'Im from global...';
let callTestObj = {
  callText: 'Im from call...'
}
const callTestFn = function () {
  console.log(this.callText + [...arguments].splice(''));
}
console.group('---call---');
callTestFn.fakeCall(callTestObj, 'next1', 'next2');
console.groupEnd();


/*
  实现apply
*/
Function.prototype.fakeApply = function (obj) {
  let context = obj || window;
  context.fn = this;
  let result = null;
  if (arguments[1]) {// 需要判断第二个参数是否存在,apply和call的区别就是后面的入参是不是数组形式
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
/*
  测试用例-apply
*/
var applyText = 'Im from global...';
let applyTestObj = {
  applyText: 'Im from apply...'
}
const applyTestFn = function () {
  console.log(this.applyText + [...arguments].splice(''));
}
console.group('---apply---');
applyTestFn.fakeApply(applyTestObj, ['next1', 'next2']);
console.groupEnd();


/*
  实现bind
*/
Function.prototype.fakeBind = function (obj) {
  let context = obj || window;
  context.fn = this;
  let args = [...arguments].slice(1);
  // bind与call、apply不同之处就是不会直接执行调用的函数，而是返回一个指定this的函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new context.fn(...args, ...arguments);
    }
    return context.fn.apply(context, args.concat(...arguments));
  }
}
/*
  测试用例-bind
*/
var bindText = 'Im from global...';
let bindTestObj = {
  bindText: 'Im from bind...'
}
const bindTestFn = function () {
  console.log(this.bindText + [...arguments].splice(''));
}
console.group('---bind---');
bindTestFn.fakeBind(bindTestObj, 'next1', 'next2')();
console.groupEnd();


/*
  测试this
*/
function foo() {
  console.log("name: " + this.name);
}
let test = { name: "test" },
  test2 = { name: "test2" };
let fooOBJ = foo.bind(test);
fooOBJ(); // name: test
test2.foo = foo.bind(test);
test2.foo(); // name: test2 <---- 看！ ！ ！