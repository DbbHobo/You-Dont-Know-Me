/*
  实现new
*/
function fakeNew() {
  // 创建一个空的对象
  let obj = new Object()
  // 获得构造函数
  let Con = [].shift.call(arguments)
  // 链接到原型
  obj.__proto__ = Con.prototype
  // 绑定 this，执行构造函数
  let result = Con.apply(obj, arguments)
  // 确保 new 出来的是个对象
  return typeof result === 'object' ? result : obj
}

/*
  测试用例-new
*/
function Cat(name, gender) {
  this.name = name;
  this.gender = gender;
}
console.group('---实现一个new---');
let softKitty = fakeNew(Cat, 'softKitty', 'girl')
console.log(softKitty)

let prettyKitty = new Cat('prettyKitty', 'boy')
console.log(prettyKitty)
console.groupEnd();

/*
  测试用例-原型链
*/
console.group('---原型链---');
Cat.prototype.fur = 'long'
console.log('原型链上找不到canRun属性', softKitty.canRun)
console.log('softKitty的原型上有fur属性', softKitty.fur)
softKitty.fur = 'short'
console.log('softKitty自己有fur属性', softKitty.fur)
console.groupEnd();

/*
  借用构造函数继承
*/
function inheritParent1(name) {
  this.name = name;
  this.actions = ["breath", "walk"];
}
inheritParent1.prototype.walk = function () {
  console.log('Im walking...');
}
function inheritChild1() {
  inheritParent1.call(this, 'son');// 在子类型构造函数的内部调用超类型构造函数
}
console.group('---借用构造函数实现继承---');
let child1 = new inheritChild1();
child1.actions.push("run");
console.log(child1);
// child1.walk();会报错，找不到这个方法
let child2 = new inheritChild1();
console.log(child2);
console.groupEnd();
// 优点-相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。
// 缺点-方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。

/*
  原型链实现继承
*/
function inheritParent2(name) {
  this.name = name;
  this.actions = ["breath", "walk"];
}
inheritParent2.prototype.walk = function () {
  console.log('Im walking...');
}
function inheritChild2(name) {
  this.name = name;
}
inheritChild2.prototype = new inheritParent2();
console.group('---原型链实现继承---');
let child3 = new inheritChild2('son');
child3.name = 'daughter';
child3.actions.push("run");
child3.walk();
let child4 = new inheritChild2('son');
console.log(child4.actions);// child4被child3影响了(引用属性)
console.log(child4.name);// child4没有被child3影响（数据属性）
console.groupEnd();
// 实例化两个Child，在实例child3中为父类的actions属性push了一个动作，但是child4也被跟着改变了。
// 缺点-原型链上中的原型对象它俩是共用的，这不是我们想要的，s1和s2这个两个对象应该是隔离的，这是这种继承方式的缺点。

/*
  组合式继承(原型链+调用构造函数)
*/
function inheritParent3(name) {
  this.name = name;
  this.actions = ["breath", "walk"];
}
inheritParent3.prototype.walk = function () {
  console.log('Im walking...');
}
function inheritChild3(name) {
  this.name = name;
  inheritParent3.call(this, 'son');
}
inheritChild3.prototype = new inheritParent3();
console.group('---组合实现继承---');
let child5 = new inheritChild3();
child5.actions.push("run");
child5.walk();
let child6 = new inheritChild3();
console.log(child6.actions);// child6没有被child5影响
console.groupEnd();
// 缺点-组合继承最大的问题就是无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。

/*
  寄生组合继承
*/
function inheritParent4(name) {
  this.name = name;
  this.actions = ["breath", "walk"];
}
inheritParent4.prototype.walk = function () {
  console.log('Im walking...');
}
function inheritChild4(name) {
  this.name = name;
  inheritParent4.call(this, 'son');
}
inheritChild4.prototype = Object.create(inheritParent4.prototype, {
  constructor: {
    value: inheritChild4,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
console.group('---寄生组合继承---');
let child7 = new inheritChild4();
child7.actions.push("run");
child7.walk();
let child8 = new inheritChild4();
console.log(child8.actions);
console.groupEnd();

/*
  Class继承
*/
class inheritParent5 {
  constructor(name) {
    this.name = name;
    this.actions = ["breath", "walk"];
  }
  walk() {
    console.log('Im walking...');
  }
}
class inheritChild5 extends inheritParent5 {
  constructor(name) {
    super(name)
  }
}
console.group('---Class继承---');
let child9 = new inheritChild5();
child9.actions.push("run");
child9.walk();
let child10 = new inheritChild5();
console.log(child10.actions);
console.groupEnd();