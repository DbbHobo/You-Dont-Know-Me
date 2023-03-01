## Class

ES6 引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。ES6 的类，完全可以看作构造函数的另一种写法。
- 类的所有方法都定义在类的prototype属性上面。在类的实例上面调用方法，其实就是调用原型上的方法。
- 类的内部所有定义的方法，都是不可枚举的。
- 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。
- 类不存在变量提升

ES5写法：
```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};
var p = new Point(1, 2);
```
ES6写法：
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
typeof Point // "function"
Point === Point.prototype.constructor // true
let p = new Point(1,2)
Object.keys(Point.prototype)
```

- 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}
let inst = new MyClass();
inst.prop = 123;
// setter: 123
inst.prop
// 'getter'
```

### 静态属性、静态方法
静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
```js
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;
// 新写法
class Foo {
  static prop = 1;
}
```

如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为静态方法。
- 如果静态方法包含this关键字，这个this指的是类，而不是实例。
- 父类的静态方法，可以被子类继承。
```js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}
Foo.bar() // hello
var foo = new Foo();
foo.bar()
// TypeError: foo.bar is not a function
```


### 实例属性、方法
实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
实例方法定义在类内部，因为类相当于实例的原型，所有在类中定义的方法，都会被实例继承。
```js
class IncreasingCounter {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

- new.target
`new`是从构造函数生成实例对象的命令。ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。

- Class 内部调用`new.target`，返回当前 Class。
- 子类继承父类时，`new.target`会返回子类。
```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}
var obj = new Rectangle(3, 4); // 输出 true
```

### Class继承

`Class` 可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

- 子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。
- 父类的静态方法，也会被子类继承。
- `Object.getPrototypeOf`方法可以用来从子类上获取父类。
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return 'father'; // 调用父类的toString()
  }
  static hello() {
    console.log('hello world');
  }
}
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }
  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
ColorPoint.hello();//hello world
Object.getPrototypeOf(ColorPoint) === Point // true
```

大多数浏览器的 ES5 实现之中，每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性。Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。
- 子类的`__proto__`属性，表示构造函数的继承，总是指向父类。
- 子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。
```js
class A {
}
class B extends A {
}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
这样的结果是因为，类的继承是按照下面的模式实现的。
```js
class A {
}
class B {
}
// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
```