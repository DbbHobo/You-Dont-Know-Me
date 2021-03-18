# DOM（文档对象模型）

DOM（文档对象模型）是针对 HTML 和 XML 文档的一个 API（应用程序编程接口）。 DOM 描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

HTML 元素通过元素节点表示，特性（attribute）通过**特性节点**表示，文档类型通过**文档类型节点**表示，而注释则通过**注释节点**表示。总共有 12 种节点类型，这些类型都继承自一个基类型。

每个节点都有一个 **childNodes** 属性，其中保存着一个 NodeList 对象。 NodeList 是一种**类数组对象**，用于保存一组有序的节点，可以通过位置来访问这些节点。

包含在 childNodes 列表中的每个节点相互之间都是同胞节点。通过使用列表中每个节点的 previousSibling 和 nextSibling 属性，可以访问同一列表中的其他节点。

父节点的 firstChild 和 lastChild 属性分别指向其 childNodes 列表中的第一个和最后一个节点。

## 获取 DOM 节点

最常用的 DOM API 就是获取节点，其中常用的获取方法如下面代码示例：

```js
// 通过 id 获取
var div1 = document.getElementById("div1"); // 元素

// 通过 tagname 获取
var divList = document.getElementsByTagName("div"); // 集合
console.log(divList.length);
console.log(divList[0]);

// 通过 class 获取
var containerList = document.getElementsByClassName("container"); // 集合

// 通过 CSS 选择器获取
var pList = document.querySelectorAll("p"); // 集合
```

## DOM 树操作

- 新增节点

```js
var div1 = document.getElementById("div1");

// 添加新节点
var p1 = document.createElement("p");
p1.innerHTML = "this is p1";
div1.appendChild(p1); // 添加新创建的元素

// 移动已有节点。注意，这里是“移动”，并不是拷贝
var p2 = document.getElementById("p2");
div1.appendChild(p2);
```

- 获取父元素

```js
var div1 = document.getElementById("div1");
var parent = div1.parentElement;
```

- 获取子元素

```js
var div1 = document.getElementById("div1");
var child = div1.childNodes;
```

- 删除节点

```js
var div1 = document.getElementById("div1");
var child = div1.childNodes;
div1.removeChild(child[0]);
```

## 事件冒泡

```js
<body>
  <div id="div1">
    <p id="p1">激活</p>
    <p id="p2">取消</p>
    <p id="p3">取消</p>
    <p id="p4">取消</p>
  </div>
  <div id="div2">
    <p id="p5">取消</p>
    <p id="p6">取消</p>
  </div>
</body>
```

对于以上 HTML 代码结构，要求点击 p1 时候进入激活状态，点击其他任何<p>都取消激活状态，如何实现？代码如下，注意看注释：

```js
var body = document.body;
bindEvent(body, "click", function (e) {
  // 所有 p 的点击都会冒泡到 body 上，因为 DOM 结构中 body 是 p 的上级节点，事件会沿着 DOM 树向上冒泡
  alert("取消");
});

var p1 = document.getElementById("p1");
bindEvent(p1, "click", function (e) {
  e.stopPropagation(); // 阻止冒泡
  alert("激活");
});
```

如果我们在 p1 div1 body 中都绑定了事件，它是会根据 DOM 的结构来冒泡，从下到上挨个执行的。但是我们使用 e.stopPropagation()就可以阻止冒泡

## 浏览器中的事件

事件触发有三个阶段

- document 往事件触发处传播，遇到注册的**捕获**事件会触发
- 传播到事件触发处时触发注册的事件
- 从事件触发处往 document 传播，遇到注册的**冒泡**事件会触发

事件触发一般来说会按照上面的顺序进行，但也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行

```js
// 以下会先打印冒泡然后是捕获-addEventListener第三个参数是true是捕获，false是冒泡，默认false
node.addEventListener(
  "click",
  (event) => {
    console.log("冒泡");
  },
  false
);
node.addEventListener(
  "click",
  (event) => {
    console.log("捕获 ");
  },
  true
);
```

## 事件代理

我们设定一种场景，如下代码，一个`<div>`中包含了若干个`<a>`，而且还能继续增加。那如何快捷方便地为所有`<a>`绑定事件呢？

```js
<div id="div1">
    <a href="#">a1</a>
    <a href="#">a2</a>
    <a href="#">a3</a>
    <a href="#">a4</a>
</div>
<button>点击增加一个 a 标签</button>
```

这里就会用到事件代理。我们要监听`<a>`的事件，但要把具体的事件绑定到`<div>`上，然后看事件的触发点是不是`<a>`。

```js
var div1 = document.getElementById("div1");
div1.addEventListener("click", function (e) {
  // e.target 可以监听到触发点击事件的元素是哪一个
  var target = e.target;
  if (e.nodeName === "A") {
    // 点击的是 <a> 元素
    alert(target.innerHTML);
  }
});
```

我们现在完善一下之前写的通用事件绑定函数，加上事件代理。

```js
function bindEvent(elem, type, selector, fn) {
  // 这样处理，可接收两种调用方式
  // bindEvent(div1, 'click', 'a', function () {...}) 和 bindEvent(div1, 'click', function () {...}) 这两种
  if (fn == null) {
    fn = selector;
    selector = null;
  }

  // 绑定事件
  elem.addEventListener(type, function (e) {
    var target;
    if (selector) {
      // 有 selector 说明需要做事件代理
      // 获取触发时间的元素，即 e.target
      target = e.target;
      // 看是否符合 selector 这个条件
      if (target.matches(selector)) {
        fn.call(target, e);
      }
    } else {
      // 无 selector ，说明不需要事件代理
      fn(e);
    }
  });
}
```

然后这样使用，简单很多。

```js
// 使用代理，bindEvent 多一个 'a' 参数
var div1 = document.getElementById("div1");
bindEvent(div1, "click", "a", function (e) {
  console.log(this.innerHTML);
});

// 不使用代理
var a = document.getElementById("a1");
bindEvent(div1, "click", function (e) {
  console.log(a.innerHTML);
});
```

最后，使用代理的优点如下：

- 使代码简洁
- 减少浏览器的内存占用
