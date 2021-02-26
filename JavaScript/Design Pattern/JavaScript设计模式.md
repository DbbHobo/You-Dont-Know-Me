# JavaScript 设计模式

# 常见的设计模式

设计模式就是一种理念，通过一些设计思维来解决平时编写底层或业务代码时遇到的场景问题。

- 创建型（5）

工厂，单例，原型。

- 结构型（7）

适配器，装饰器，代理，外观，桥接，组合，享元。

- 行为型（11）

策略，模板，观察者，迭代器，中介者，状态，职责链，命令，访问者，备忘录，解释器。

创建型设计模式主要解决“对象的创建”问题，结构型设计模式主要解决“类或对象的组合或组装”问题，那行为型设计模式主要解决的就是“类或对象之间的交互”问题。

设计模式要干的事情就是解耦，创建型模式是将**创建**和**使用代码**解耦，结构型模式是将**不同功能代码**解耦，行为型模式是将**不同的行为代码**解耦。

## 工厂模式

工厂模式有三种形式：简单工厂模式（Simple Factory）、工厂方法模式（Factory Method）和抽象工厂模式（Abstract Factory）。在 js 中我们最常见的当属简单工厂模式。工厂模式的设计思想即：

- 将 new 操作单独封装，只对外提供相应接口；
- 遇到 new 时，就要考虑是否应该使用工厂模式；

```js
class User {
  constructor(name = "", viewPage = []) {
    this.name = name;
    this.viewPage = viewPage;
  }
}

class UserFactory extends User {
  constructor(name, viewPage) {
    super(name, viewPage);
  }
  create(role) {
    switch (role) {
      case "superAdmin":
        return new UserFactory("超级管理员", [
          "首页",
          "通讯录",
          "发现页",
          "应用数据",
          "权限管理",
        ]);
        break;
      case "admin":
        return new UserFactory("管理员", ["首页", "通讯录"]);
        break;
      default:
        throw new Error("params error");
    }
  }
}
let userFactory = new UserFactory();
let superAdmin = userFactory.create("superAdmin");
let admin = userFactory.create("admin");
let user = userFactory.create("user");
```

使用场景：jQuery 的选择器$(selector)、Vue 异步组件、React.createElement()

## 单例模式

单例模式，顾名思义即保证实例在全局的单一性，概述如下：

- 系统中被唯一使用
- 一个类只有一个实例

单例模式的实现实质即创建一个可以返回对象实例的引用和一个获取该实例的方法。保证创建对象的引用恒唯一。

```js
class Modal {
  login() {
    console.log("login...");
  }
}
Modal.create = (function () {
  let instance;
  return function () {
    if (!instance) {
      instance = new Modal();
    }
    return instance;
  };
})();
let m1 = Modal.create();
let m2 = Modal.create();
console.log(m1 === m2); // true
```

## 适配器模式

适配器模式（Adapter）是将一个类（对象）的接口（方法或属性）转化成适应当前场景的另一个接口（方法或属性），适配器模式使得原本由于接口不兼容而不能一起工作的那些类（对象）可以一些工作。所以，适配器模式必须包含目标（Target）、源（Adaptee）和适配器（Adapter）三个角色。

## 装饰器模式

装饰器，就是在原来方法的基础上去装饰一些针对特别场景所适用的方法，即添加一些新功能。因此其特征主要有两点：

- 为对象添加新功能；
- 不改变其原有的结构和功能，即原有功能还继续会用，且场景不会改变。

```js
class Circle {
  draw() {
    console.log("画一个圆形");
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle;
  }
  draw() {
    this.circle.draw();
    this.setRedBorder(circle);
  }
  setRedBorder(circle) {
    console.log("画一个红色边框");
  }
}

let circle = new Circle();
let decorator = new Decorator(circle);
decorator.draw(); //画一个圆形，画一个红色边框
```

## 代理模式

代理模式要突出“代理”的含义，该模式场景需要三类角色，分别为使用者、目标对象和代理者，使用者的目的是直接访问目标对象，但却不能直接访问，而是要先通过代理者。

- 使用者无权访问目标对象；
- 中间加代理，通过代理做授权和控制。

## 观察者模式

观察者模式，也叫订阅-发布模式，观察者模式中的角色有两类：观察者（发布者）和被观察者（订阅者）。

- 每一个观察者（Observer）都有一个 update 方法，并且观察者的状态就是等待被触发；
- 每一个主题（subject）都可以通过 attach 方法接纳 N 个观察者所观察，即观察者们存储在主题的 observers 数组里；
- 主题有初始化状态（init）、获取状态（getState）和设置状态（setState）三个通用型方法；
- 当主题的状态发生变化时，通过特定的 notifyAllObervers 方法通知所有观察者。

[深入 JavaScript 设计模式，从此有了优化代码的理论依据](https://juejin.cn/post/6844903918330347533)
[设计模式之美-前端](https://zhuanlan.zhihu.com/p/111553641)
