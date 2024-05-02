# DOM（Document Object Model）文档对象模型

In the document node is the DOM (Document Object Model), the document object model, which represents the contents of the page. You can manipulate it using javascript.

`DOM`为`JavaScript`提供了一种访问和操作HTML元素的"方法"。`DOM`（文档对象模型）是针对 `HTML` 和 `XML` 文档的一个 API（应用程序编程接口）。 `DOM` 描绘了一个层次化的**DOM节点树**，允许开发人员添加、移除和修改页面的某一部分。

HTML 元素通过元素节点表示，特性（attribute）通过**特性节点**表示，文档类型通过**文档类型节点**表示，而注释则通过**注释节点**表示。总共有 12 种节点类型，这些类型都继承自一个基类型。每个节点都有一个 **`childNodes`** 属性，其中保存着一个 `NodeList` 对象。 `NodeList` 是一种**类数组对象**，用于保存一组有序的节点，可以通过位置来访问这些节点。包含在 `childNodes` 列表中的每个节点相互之间都是同胞节点。通过使用列表中每个节点的 `previousSibling` 和 `nextSibling` 属性，可以访问同一列表中的其他节点。父节点的 `firstChild` 和 `lastChild` 属性分别指向其 `childNodes` 列表中的第一个和最后一个节点。

一个DOM元素的原型链是这样的：

`div` => `HTMLDivElement` => `HTMLElement` => `Element` => `Node` => `EventTarget` => `Object`

HTML 元素类的总体继承关系如下：

![browser](./assets/html-dom-hierarchy.svg)

因此，元素继承其所有祖先的属性和方法。例如，考虑 `<a>` 元素，在 `DOM` 中由类型为 `HTMLAnchorElement` 的对象表示。元素包括了该类文档中，`Anchor` 特定的属性和方法。但也包括 `HTMLElement`、`Element` 以及 `Node` 定义的内容，最后是 `EventTarget` 定义的内容。

每一层级都定义了元素实用性的一个关键方面。从 `Node` 开始，该元素继承了有关该元素能否被另一个元素包含，以及自身包含其他元素的概念。特别重要的是从 `EventTarget` 继承的：接收和处理事件（如鼠标点击、播放和暂停事件等）的能力。

## HTMLElement

`HTMLElement` 接口表示所有的 `HTML` 元素。一些 `HTML` 元素直接实现了 `HTMLElement` 接口，其他的间接实现 `HTMLElement` 接口。

- `HTMLElement.offsetTop`

只读属性，它返回当前元素相对于其 `offsetParent` 元素的顶部内边距的距离。

- `HTMLElement.offsetLeft`

只读属性，返回当前元素左上角相对于 `HTMLElement.offsetParent` 节点的左边界偏移的像素值。

## Element

`Element` 是最通用的基类，`Document` 中的所有元素对象（即表示元素的对象）都继承自它。它只具有各种元素共有的方法和属性。

- `Element.scrollTop`

可以获取或设置一个元素的内容垂直滚动的像素数。

- `Element.scrollLeft`

可以读取或设置元素滚动条到元素左边的距离。

- `Element.clientTop`

一个元素顶部边框的宽度（以像素表示）。不包括顶部外边距或内边距。`clientTop` 是只读的。

- `Element.clientLeft`

表示一个元素的左边框的宽度，以像素表示。如果元素的文本方向是从右向左（RTL, right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度。`clientLeft` 不包括左外边距和左内边距。`clientLeft` 是只读的。

- `Element.getBoundingClientRect()`

返回一个 `DOMRect` 对象，其提供了元素的大小及其相对于视口的位置。

## Node

`Node` 是一个接口，各种类型的 `DOM API` 对象会从这个接口继承。它允许我们使用相似的方式对待这些不同类型的对象；比如，继承同一组方法，或者用同样的方式测试。

以下接口都从 `Node` 继承其方法和属性：

`Document`, `Element`, `Attr`, `CharacterData` (which Text, Comment, and CDATASection inherit), `ProcessingInstruction`, `DocumentFragment`, `DocumentType`等

## EventTarget

`EventTarget` 接口由可以接收事件、并且可以创建侦听器的对象实现。换句话说，任何事件目标都会实现与该接口有关的这三个方法。

`Element` 及其子项、`document` 和 `window` 是最常见的事件目标，但其他对象也可以是事件目标。比如 `XMLHttpRequest`、`AudioNode` 和 `AudioContext` 等等。

- `EventTarget.addEventListener()`

在 `EventTarget` 上注册特定事件类型的事件处理程序。

常见监听事件有：

  * DOMContentLoaded
  * scroll
  * paste
  * fullscreenchange

- `EventTarget.removeEventListener()`

`EventTarget` 中删除事件侦听器。

- `EventTarget.dispatchEvent()`

将事件分派到此 `EventTarget`。

### 浏览器中的事件

事件触发有三个阶段

- `document` 往事件触发处传播，遇到注册的**捕获**事件会触发
- 传播到事件触发处时触发注册的事件
- 从事件触发处往 `document` 传播，遇到注册的**冒泡**事件会触发

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

### 事件代理

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

### 事件冒泡

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

对于以上 HTML 代码结构，要求点击 p1 时候进入激活状态，点击其他任何`<p>`都取消激活状态，如何实现？

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

如果我们在 p1 div1 body 中都绑定了事件，它是会根据 DOM 的结构来冒泡，从下到上挨个执行的。但是我们使用 `e.stopPropagation()`就可以阻止冒泡。

## Document

`Document` 接口描述了任何类型的文档的通用属性与方法。

`Document` => `Node` => `EventTarget` => `Object`

### 获取 DOM 节点(查找)

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

### DOM 树操作(插入、删除)

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

## Window

`window` 对象表示一个包含 `DOM` 文档的窗口，其 `document` 属性指向窗口中载入的 `DOM` 文档。代表了脚本正在运行的窗口的 `window` 全局变量，被暴露给 Javascript 代码。

`Window` => `EventTarget` => `Object`

## attribute & property

全局属性是所有 `HTML` 元素共有的属性；它们可以用于所有元素，即使属性可能对某些元素不起作用。

- accesskey
- autocapitalize
- autofocus
- class
- contenteditable
- data-*
- dir
- draggable
- enterkeyhint
- exportparts
- hidden
- id
- inert
- inputmode
- is
- itemid
- itemprop
- itemref
- itemscope
- itemtype
- lang
- nonce
- part
- popover
- slot
- spellcheck
- style
- tabindex
- title
- translate
- 事件处理器属性：onabort、onautocomplete、onautocompleteerror、onblur、oncancel、oncanplay、oncanplaythrough、onchange、onclick、onclose、oncontextmenu、oncuechange、ondblclick、ondrag、ondragend、ondragenter、ondragleave、ondragover、ondragstart、ondrop、ondurationchange、onemptied、onended、onerror、onfocus、oninput、oninvalid、onkeydown、onkeypress、onkeyup、onload、onloadeddata、onloadedmetadata、onloadstart、onmousedown、onmouseenter、onmouseleave、onmousemove、onmouseout、onmouseover、onmouseup、onmousewheel、onpause、onplay、onplaying、onprogress、onratechange、onreset、onresize、onscroll、onseeked、onseeking、onselect、onshow、onsort、onstalled、onsubmit、onsuspend、ontimeupdate、ontoggle、onvolumechange、onwaiting

<!-- TODO -->

## 参考资料

[HTMLElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement)

[Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)

[Node](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)

[EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)

[Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)

[Window](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)
