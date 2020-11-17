# JavaScript 模块化

模块化的开发方式可以提高代码复用率，方便进行代码的管理。

- 解决命名冲突
- 提供复用性
- 提高代码可维护性
  目前流行的 js 模块化规范有**CommonJS**、**AMD**、**CMD**以及**ES6**的模块系统。

## CommonJS

CommonJS 主要由 node 推广使用。CommonJS 是**同步加载**的，因此更适合服务器端。只有加载完成之后才能进行下面的操作。因为在服务器端模块文件一般存放在本地，再加上有缓存，加载速度十分快。

CommonJS 规范每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，**一旦输出一个值，模块内部的变化就影响不到这个值**。

webpack 并不支持对 CommonJs 进行 Tree-shaking。

关键命令：module.exports = 、require()

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

module 每个模块内部，都有一个 module 对象，代表当前模块。

- module.id 模块的识别符，通常是带有绝对路径的模块文件名。
- module.filename 模块的文件名，带有绝对路径。
- module.loaded 返回一个布尔值，表示模块是否已经完成加载。
- module.parent 返回一个对象，表示调用该模块的模块。
- module.children 返回一个数组，表示该模块要用到的其他模块。
- module.exports 表示模块对外输出的值。
- module.exports 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 module.exports 变量。
- exports Node 为每个模块提供一个 exports 变量，指向 module.exports。不能直接将 exports 变量指向一个值，因为这样等于切断了 exports 与 module.exports 的联系。这等同在每个模块头部，有一行这样的命令。

```js
var exports = module.exports;
```

require 命令用于加载文件，后缀名默认为.js。根据参数的不同格式，require 命令去不同路径寻找模块文件。

- 如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，require('/home/marco/foo.js')将加载/home/marco/foo.js。
- 如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，require('./circle')将加载当前脚本同一目录的 circle.js。
- 如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于 Node 的系统安装目录中），或者一个位于各级 node_modules 目录的已安装模块（全局安装或局部安装）。
- 如果参数字符串不以“./“或”/“开头，而且是一个路径，比如 require('example-module/path/to/file')，则将先找到 example-module 的位置，然后再以它为参数，找到后续路径。
- 如果指定的模块文件没有发现，Node 会尝试为文件名添加.js、.json、.node 后，再去搜索。.js 件会以文本格式的 JavaScript 脚本文件解析，.json 文件会以 JSON 格式的文本文件解析，.node 文件会以编译后的二进制文件解析。
- 如果想得到 require 命令加载的确切文件名，使用 require.resolve()方法。

[](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
