# JavaScript 模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

目前流行的 js 模块化规范有**CommonJS**、**AMD**、**CMD**以及**ES6**的模块系统。

## CommonJS

`CommonJS` 主要由 `Node` 推广使用。`CommonJS` 是**同步加载**的，是**运行时加载**，因此更适合服务器端。只有加载完成之后才能进行下面的操作。因为在服务器端模块文件一般存放在本地，再加上有缓存，加载速度十分快。

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
    l = args.length
  while (i < l) {
    sum += args[i++]
  }
  return sum
}

// increment.js
var add = require("math").add
exports.increment = function (val) {
  return add(val, 1)
}

// program.js
var inc = require("increment").increment
var a = 1
inc(a) // 2

module.id == "program"
```

`module` 每个模块内部，都有一个 `module` 对象，代表当前模块。

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 module.exports 变量。
- `exports` Node 为每个模块提供一个 `exports` 变量，指向 `module.exports`。不能直接将 `exports` 变量指向一个值，因为这样等于切断了 `exports` 与 `module.exports` 的联系。这等同在每个模块头部，有一行这样的命令。

```js
var exports = module.exports
```

`require` 命令用于加载文件，后缀名默认为`.js`。根据参数的不同格式，`require` 命令去不同路径寻找模块文件。

- 如果参数字符串以`/`开头，则表示加载的是一个位于**绝对路径**的模块文件。比如，`require('/home/marco/foo.js')`将加载`/home/marco/foo.js`。
- 如果参数字符串以`./`开头，则表示加载的是一个位于**相对路径**（跟当前执行脚本的位置相比）的模块文件。比如，`require('./foo')`将加载当前脚本同一目录的`foo.js`。
- 如果参数字符串不以`./`或`/`开头，则表示加载的是一个默认提供的核心模块（位于 Node 的系统安装目录中），或者一个位于各级 `node_modules` 目录的已安装模块（全局安装或局部安装）。
- 如果参数字符串不以`./`或`/`开头，而且是一个路径，比如 `require('example-module/path/to/file')`，则将先找到 `example-module` 的位置，然后再以它为参数，找到后续路径。
- 如果指定的模块文件没有发现，Node 会尝试为文件名添加`.js`、`.json`、`.node`后，再去搜索。`.js`件会以文本格式的 `js` 脚本文件解析，`.json` 文件会以 `JSON` 格式的文本文件解析，`.node` 文件会以编译后的二进制文件解析。
- 如果想得到 `require` 命令加载的确切文件名，使用 `require.resolve()` 方法。

`CommonJS` 的一个模块，就是一个脚本文件。`require`命令第一次加载该脚本，就会执行整个脚本，然后**在内存生成一个对象 `module` 对象**。

```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

## ES6

`ES6` 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。

`ES6` 中的模块是**编译时加载**，ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即在 `import` 时可以指定加载某个输出值，而不是加载整个模块。

`ES6` 在语言标准的层面上，实现了模块功能，浏览器和服务器通用的模块解决方案。`export` 命令用于规定模块的对外接口，`import` 命令用于输入其他模块提供的功能。

`ES6` 模块是动态引用，如果使用`import`从一个模块加载变量（即`import foo from 'foo'`），那些变量不会被缓存，而是成为**一个指向被加载模块的引用**，需要开发者自己保证，真正取值的时候能够取到值。

关键命令：`export`、`export default`、`import`。

```js
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function () {}

import { a, b } from "./a.js"
import XXX from "./b.js"
```

## CommonJS 和 ES6 模块的区别

- `CommonJS` 模块是**运行时**加载，而 `ES6` 模块是**编译时**输出接口，使得对 JS 的模块进行静态分析成为了可能。`CommonJS` 其实加载的是一个对象，这个对象只有在脚本运行时才会生成，而且只会生成一次。但是 `ES6` 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成，这样我们就可以使用各种工具对 JS 模块进行依赖分析，优化代码；
- `CommonJS` 的 `require` 语法是同步的，所以就导致了 `CommonJS` 模块规范只适合用在服务端，而 `ES6` 模块无论是在浏览器端还是服务端都是可以使用的，但是在服务端中，还需要遵循一些特殊的规则才能使用；
- `CommonJS` 模块输出的是一个**值的拷贝**，一旦输出一个值，模块内部的变化就影响不到这个值。而 `ES6` 模块输出的是**值的引用**，原始值变了，import 加载的值也会跟着变；
- 因为两个模块加载机制的不同，所以在对待循环加载的时候，它们会有不同的表现。`CommonJS` 遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。而 `ES6` 模块相反，使用 `import` 加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值；
- 关于模块顶层的 `this` 指向问题，在 `CommonJS` 顶层，`this` 指向当前模块；而在 `ES6` 模块中，`this` 指向 `undefined`；
- 关于两个模块互相引用的问题，在 `ES6` 模块当中，是支持加载 `CommonJS` 模块的。但是反过来，`CommonJS` 并不能 `require ES6` 模块，在 NodeJS 中，两种模块方案是分开处理的；
- `.mjs`文件总是以 `ES6` 模块加载，`.cjs`文件总是以 `CommonJS` 模块加载，`.js`文件的加载取决于`package.json`里面`type`字段的设置；
- `ES6` 模块与 `CommonJS` 模块尽量不要混用。`require`命令不能加载`.mjs`文件，会报错，只有`import`命令才可以加载`.mjs`文件。反过来，`.mjs`文件里面也不能使用`require`命令，必须使用`import`；

## AMD、CMD、UMD

```js
// AMD
define(["./a", "./b"], function (a, b) {
  // 加载模块完毕可以使用
  a.do()
  b.do()
})

// CMD
define(function (require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require("./a")
  a.doSomething()
})
```

## JavaScript 中的模块化方案

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

## 浏览器加载模块

JavaScript 现在有两种常用的模块化方式。一种是 `ES6` 模块，简称 **`ESM`**；另一种是 `CommonJS` 模块，简称 **`CJS`**。

`CommonJS` 模块使用`require()`和`module.exports`，`ES6` 模块使用`import`和`export`。

Node.js 要求 `ES6` 模块采用`.mjs`后缀文件名。也就是说，只要脚本文件里面使用`import`或者`export`命令，那么就必须采用`.mjs`后缀名。Node.js 遇到`.mjs`文件，就认为它是 `ES6` 模块，默认启用严格模式，不必在每个模块文件顶部指定`"use strict"`。如果不希望将后缀名改成`.mjs`，可以在项目的`package.json`文件中，指定`type`字段为`module`。

`.mjs`文件总是以 `ES6` 模块加载，`.cjs`文件总是以 `CommonJS` 模块加载，`.js`文件的加载取决于`package.json`里面`type`字段的设置。

```json
{
  "type": "module"
}
```

`package.json`文件有两个字段可以指定模块的入口文件：`main`和`exports`。比较简单的模块，可以只使用`main`字段，指定模块加载的入口文件。

```json
// ./node_modules/es-module-package/package.json
{
  "type": "module",
  "main": "./src/index.js"
}
```

`package.json` 文件中的 `exports` 字段用于定义模块在不同环境下（如 `CommonJS`、`ESM` 等）如何暴露和解析。它是一个较新的特性，旨在替代 `main` 和 `module` 字段，提供更加精细的控制，尤其是在支持多种模块系统时（例如，支持同时发布 CommonJS 和 ES 模块）。

1. 子目录别名

`package.json`文件的`exports`字段可以指定脚本或子目录的别名。

```json
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/": "./src/features/"
  }
}

import feature from 'es-module-package/features/x.js';
// 加载 ./node_modules/es-module-package/src/features/x.js
```

2. `main` 的别名

`exports`字段的别名如果是`.`，就代表模块的主入口，优先级高于`main`字段，并且可以直接简写成`exports`字段的值。

```json
// 兼容旧版本入口
{
  "main": "./main-legacy.cjs",
  "exports": {
    ".": "./main-modern.cjs"
  }
}
```

3. 支持多种模块格式

```json
// 指明两种格式模块各自的加载入口。
{
  "exports": {
    "import": "./src/index.mjs",
    "require": "./src/index.cjs"
  }
}
```

4. Vue3 源码 reactive package 的配置

```json
"exports": {
  ".": {
    "types": "./dist/reactivity.d.ts",// 指定 TypeScript 类型声明文件的路径
    // 定义 Node.js 环境下的入口文件，支持根据环境变量（如 NODE_ENV）动态选择。
    "node": {
      "production": "./dist/reactivity.cjs.prod.js",
      "development": "./dist/reactivity.cjs.js",
      "default": "./index.js"
    },
    // 指定 ES 模块（ESM）的入口文件
    "module": "./dist/reactivity.esm-bundler.js",
    "import": "./dist/reactivity.esm-bundler.js",
    // 指定 CommonJs 模块（CJS）的入口文件
    "require": "./index.js"
  },
  "./*": "./*"
}
```

### 传统 JavaScript 模块加载

HTML 网页中，浏览器通过`<script>`标签加载 JavaScript 脚本。`<script>`标签打开`defer`或`async`属性，脚本就会**异步加载**。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

`defer`与`async`的区别是：`defer`要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；`async`一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，`defer`是“渲染完再执行”，`async`是“下载完就执行”。另外，如果有多个`defer`脚本，会按照它们在页面出现的顺序加载，而多个`async`脚本是不能保证加载顺序的。

![defer&async](../assets/defer&async.png)

```html
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js"></script>

<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

### ES6 模块加载

浏览器加载 ES6 模块，也使用`<script>`标签，但是要加入`type="module"`属性。浏览器对于带有`type="module"`的`<script>`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`<script>`标签的`defer`属性。

```js
<script type="module" src="./foo.js"></script>
```

利用顶层的`this`等于`undefined`这个语法点，可以侦测当前代码是否在 `ES6` 模块之中。

```js
const isNotModuleScript = this !== undefined
```

### 动态导入 import()

ESM 的 **`import`** 语法是静态导入，但有时我们希望在需要时才加载模块，可以使用动态导入 **`import()`**。`import()`返回一个 `Promise` 对象。

`import()`函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。`import()`类似于 Node.js 的`require()`方法，区别主要是前者是异步加载，后者是同步加载。

```js
import("./math.js").then((math) => {
  console.log(math.add(2, 3)) // 5
})

// 结合async/await使用
async function loadMath() {
  const math = await import("./math.js")
  console.log(math.add(2, 3))
}
loadMath()

// export1和export2都是myModule.js的输出接口，可以解构获得
import("./myModule.js").then(({ export1, export2 }) => {
  // ...·
})
```

`import.meta` 是 ES Module (ESM) 的一个内置属性，它包含当前模块的元信息（metadata），主要用于获取模块的相关信息，例如文件路径、运行环境等。`import.meta` 只能在模块内部使用，如果在模块外部使用会报错。

`import.meta` 主要包含以下常见属性：

- `import.meta.url`: 当前模块的文件路径（绝对路径）
- `import.meta.resolve()`: 解析相对路径为绝对路径（Node.js 18+）
- `import.meta.env`: Vite 等工具会扩展这个对象，用于存储环境变量

## 参考资料

[Module 的语法](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/module)

[Understanding (all) JavaScript module formats and tools](https://weblogs.asp.net/dixin/understanding-all-javascript-module-formats-and-tools)

[ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)

[Script Tag - async & defer](https://stackoverflow.com/questions/10808109/script-tag-async-defer#)

[ECMAScript feature: import attributes](https://2ality.com/2025/01/import-attributes.html)
