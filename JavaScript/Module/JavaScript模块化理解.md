# JavaScript 模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

目前流行的 js 模块化规范有**CommonJS**、**AMD**、**CMD**以及**ES6**的模块系统。

## CommonJS

`CommonJS` 主要由 Node 推广使用。`CommonJS` 是**同步加载**的，是**运行时加载**，因此更适合服务器端。只有加载完成之后才能进行下面的操作。因为在服务器端模块文件一般存放在本地，再加上有缓存，加载速度十分快。

`CommonJS` 规范**每个文件就是一个模块**，有自己的作用域。在一个文件里面定义的变量、函数、类，都是**私有**的，对其他文件不可见。每个模块内部，`module` 变量代表当前模块。这个变量是一个对象，它的 `exports` 属性（即 `module.exports`）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

`CommonJS` 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，**一旦输出一个值，模块内部的变化就影响不到这个值**。

`webpack` 并不支持对 `CommonJs` 进行 `Tree-shaking`。

关键命令：`module.exports =` 、`require()`

```js
// math.js
exports.add = function () {
  var sum = 0,
    i = 0,
    args = arguments,
    l = args.length;
  while (i < l) {
    sum += args[i++];
  }
  return sum;
};

// increment.js
var add = require("math").add;
exports.increment = function (val) {
  return add(val, 1);
};

// program.js
var inc = require("increment").increment;
var a = 1;
inc(a); // 2

module.id == "program";
```

`module` 每个模块内部，都有一个 `module` 对象，代表当前模块。

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 module.exports 变量。
- `exports` Node 为每个模块提供一个 exports 变量，指向 module.exports。不能直接将 exports 变量指向一个值，因为这样等于切断了 exports 与 module.exports 的联系。这等同在每个模块头部，有一行这样的命令。

```js
var exports = module.exports;
```

`require` 命令用于加载文件，后缀名默认为`.js`。根据参数的不同格式，`require` 命令去不同路径寻找模块文件。

- 如果参数字符串以`/`开头，则表示加载的是一个位于**绝对路径**的模块文件。比如，`require('/home/marco/foo.js')`将加载`/home/marco/foo.js`。
- 如果参数字符串以`./`开头，则表示加载的是一个位于**相对路径**（跟当前执行脚本的位置相比）的模块文件。比如，`require('./foo')`将加载当前脚本同一目录的`foo.js`。
- 如果参数字符串不以`./`或`/`开头，则表示加载的是一个默认提供的核心模块（位于 Node 的系统安装目录中），或者一个位于各级 node_modules 目录的已安装模块（全局安装或局部安装）。
- 如果参数字符串不以`./`或`/`开头，而且是一个路径，比如 `require('example-module/path/to/file')`，则将先找到 `example-module` 的位置，然后再以它为参数，找到后续路径。
- 如果指定的模块文件没有发现，Node 会尝试为文件名添加`.js`、`.json`、`.node`后，再去搜索。`.js`件会以文本格式的 `js` 脚本文件解析，`.json` 文件会以 `JSON` 格式的文本文件解析，`.node` 文件会以编译后的二进制文件解析。
- 如果想得到 `require` 命令加载的确切文件名，使用 `require.resolve()` 方法。

## ES6

ES6 中的模块是**编译时加载**；ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即在 `import` 时可以指定加载某个输出值，而不是加载整个模块。

ES6 在语言标准的层面上，实现了模块功能，浏览器和服务器通用的模块解决方案。`export` 命令用于规定模块的对外接口，`import` 命令用于输入其他模块提供的功能。

关键命令：`export`、`export default`、`import`。

```js
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function () {}

import { a, b } from "./a.js";
import XXX from "./b.js";
```

## CommonJS 和 ES6 模块的区别

`CommonJS` 其实加载的是一个对象，这个对象只有在脚本运行时才会生成，而且只会生成一次。但是 `ES6` 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成，这样我们就可以使用各种工具对 JS 模块进行依赖分析，优化代码；

因为 `CommonJS` 的 `require` 语法是同步的，所以就导致了 `CommonJS` 模块规范只适合用在服务端，而 `ES6` 模块无论是在浏览器端还是服务端都是可以使用的，但是在服务端中，还需要遵循一些特殊的规则才能使用；

`CommonJS` 模块输出的是一个值的拷贝，而 `ES6` 模块输出的是值的引用；

`CommonJS` 模块是**运行时**加载，而 `ES6` 模块是**编译时**输出接口，使得对 JS 的模块进行静态分析成为了可能；

因为两个模块加载机制的不同，所以在对待循环加载的时候，它们会有不同的表现。`CommonJS` 遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。而 `ES6` 模块相反，使用 `import` 加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值；

关于模块顶层的 `this` 指向问题，在 `CommonJS` 顶层，`this` 指向当前模块；而在 `ES6` 模块中，`this` 指向 `undefined`；

关于两个模块互相引用的问题，在 `ES6` 模块当中，是支持加载 `CommonJS` 模块的。但是反过来，`CommonJS` 并不能 `require ES6` 模块，在 NodeJS 中，两种模块方案是分开处理的。

## AMD、CMD、UMD

```js
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do();
  b.do();
});
// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a");
  a.doSomething();
});
```

## JavaScript 中的模块化方法

- IIFE module: JavaScript module pattern
- Revealing module: JavaScript revealing module pattern
- CJS module: CommonJS module, or Node.js module
- AMD module: Asynchronous Module Definition, or RequireJS module
- UMD module: Universal Module Definition, or UmdJS module
- ES module: ECMAScript 2015, or ES6 module
- ES dynamic module: ECMAScript 2020, or ES11 dynamic module
- System module: SystemJS module
- Webpack module: transpile and bundle of CJS, AMD, ES modules
- Babel module: transpile ES module
- TypeScript: module and namespace

## 参考资料

[Module 的语法](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/module)

[Understanding (all) JavaScript module formats and tools](https://weblogs.asp.net/dixin/understanding-all-javascript-module-formats-and-tools)
