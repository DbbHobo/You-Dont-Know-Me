# Node基础模块

因为`Node.js`是运行在服务区端的`JavaScript`环境，服务器程序和浏览器程序相比，最大的特点是没有浏览器的安全限制了，而且，服务器程序必须能接收网络请求，读写文件，处理二进制内容，所以，`Node.js`内置的常用模块就是为了实现基本的服务器功能。这些模块在浏览器环境中是无法被执行的，因为它们的底层代码是用`C/C++`在`Node.js`运行环境中实现的。

`JavaScript`程序是由事件驱动执行的单线程模型，`Node.js`也不例外。`Node.js`不断执行响应事件的`JavaScript`函数，直到没有任何响应事件的函数可以执行时，`Node.js`就退出了。

## `global`

在`Node.js`环境中，也有唯一的全局对象，但不叫`window`，而叫`global`，这个对象的属性和方法也和浏览器环境的`window`不同。

## `process`

`process`也是`Node.js`提供的一个对象，它代表当前`Node.js`进程。通过`process`对象可以拿到许多有用信息。

- `process.cwd()`

这是一个函数，返回当前 Node 进程执行的目录。

- `process.argv`

在终端通过 `Node` 执行命令的时候，通过 `process.argv` 可以获取传入的命令行参数，返回值是一个数组：

1. 0: Node 路径（一般用不到，直接忽略）
2. 1: 被执行的 JS 文件路径（一般用不到，直接忽略）
3. 2~n: 真实传入命令的参数**

所以，我们只要从 `process.argv[2]` 开始获取就好了。一般都是这样用：

```js
const args = process.argv.slice(2);
```

## 模块

- `__dirname`

当前模块的文件夹名称。等同于 `__filename` 的 `path.dirname()` 的值。

运行位于 `/Users/xxx` 目录下的`example.js`文件：`node example.js`

```js
console.log(__dirname);
// Prints: /Users/xxx
console.log(path.dirname(__filename));
// Prints: /Users/xxx
```

- `__filename`

当前模块的文件名称---解析后的绝对路径。在主程序中这不一定要跟命令行中使用的名称一致。

在 `/Users/xxx` 目录下执行 `node example.js`

```js
console.log(__filename);
// Prints: /Users/xxx/example.js
console.log(__dirname);
// Prints: /Users/xxx
```

- exports

这是一个对于 `module.exports` 的更简短的引用形式。

- module

对当前模块的引用。 `module.exports` 用于指定一个模块所导出的内容，即可以通过 `require()` 访问的内容。

- require()

引入模块.

## fs

`Node.js`内置的`fs`模块就是文件系统模块，负责读写文件。和所有其它`JavaScript`模块不同的是，`fs`模块同时提供了异步和同步的方法。

- `fs.readFile(path[, options], callback)`

文件读取的 API，通过 `fs.readFile()` 可以获取指定 `path` 的文件内容。

由于`Node`环境执行的`JavaScript`代码是服务器端代码，所以，绝大部分需要在服务器运行期反复执行业务逻辑的代码，必须使用异步代码，否则，同步代码在执行时期，服务器将停止响应，因为`JavaScript`只有一个执行线程。

服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。

```js
const fs = require('fs');

// 异步读取文件-有回调函数
fs.readFile('sample.png', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        console.log(data.length + ' bytes');
    }
});
// 同步读取文件
try {
    let data = fs.readFileSync('sample.txt', 'utf-8');
    console.log(data);
} catch (err) {
    // 出错了
}
```

- `fs.writeFile(file, data[, options], callback)`

对应着读文件 readFile，`fs.writeFile()` 也提供了写文件的 API ，接收四个参数：

```js
const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.join(process.cwd(), 'sample.js'),
  'console.log("Hello World")',
  function (error, content) {
    console.log(error);
  }
);
```

- `fs.stat(path[, options], callback)`

`fs.stat()` 返回一个文件或者目录的信息。

```js
const fs = require('fs');

fs.stat('sample.js', function(err, stats) {
  console.log(stats);
});
```

- `fs.readdir(path[, options], callback)`

`fs.readdir(path)` 获取 `path` 目录下的文件和目录，返回值为一个包含 `file` 和 `directory` 的数组。

```js
const fs = require('fs');

fs.readdir(process.cwd(), function (error, files) {
  if (!error) {
    console.log(files);
  }
});
```

## path

- `path.join(...paths)`

`path.join()` 作用是将传入的多个路径拼成一个完整的路径。该方法会自动去掉多余的路径分隔符，同时处理不同操作系统下的路径分隔符。

```js
const result = path.join('User', 'xxx', 'sample.js');
// User/xxx/sample.js
```

- `path.resolve(...paths)`

`path.resovle()` 和 `path.join()` 的区别在于它的作用是将传入的多个路径和当前执行路径拼接成一个完整的绝对路径。如果存在相对路径，则会自动将其解析为绝对路径。

```js
const result = path.resovle('User', 'xxx', 'sample.js');
// /当前文件所在路径/User/xxx/sample.js
```

- `path.basename(path[, ext])`

`path.basename` 返回指定 `path` 最后一个路径名，其中第二个参数 `ext` 可选，表示文件扩展名。

```js
const result = path.resovle('User', 'xxx', 'sample.js');
// /当前文件所在路径/User/xxx/sample.js
```

- `path.dirname(path)`

和 `path.basename` 对应，返回指定 `path` 最后一个路径名之前的路径。

```js
const result = path.basename('User/xxx/sample.js');
// sample.js
const result = path.basename('User/xxx/sample.js','js');
// sample.
const result = path.basename('User/xxx/sample.js','.js');
// sample
```

- `path.extname(path)`

和 `path.basename` 对应，返回指定 `path` 最后一个路径名的文件扩展名（含小数点 .）。

```js
const result = path.extname('User/xxx/sample.js');
// .js
```

## http

要开发HTTP服务器程序，从头处理`TCP`连接，解析`HTTP`是不现实的。这些工作实际上已经由`Node.js`自带的`http`模块完成了。应用程序并不直接和`HTTP`协议打交道，而是操作`http`模块提供的`request`和`response`对象。

- `request`对象封装了`HTTP`请求，我们调用`request`对象的属性和方法就可以拿到所有`HTTP`请求的信息；

- `response`对象封装了`HTTP`响应，我们操作`response`对象的方法，就可以把`HTTP`响应返回给浏览器。

```js
'use strict';

const
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

// 从命令行参数获取root目录，默认是当前目录:
const root = path.resolve(process.argv[2] || '.');

// 创建服务器:
const server = http.createServer(function (request, response) {
    // 获得URL的path，类似 '/css/bootstrap.css':
    const pathname = url.parse(request.url).pathname;
    // 获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    const filepath = path.join(root, pathname);
    // 获取文件状态:
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            // 没有出错并且文件存在:
            console.log('200 ' + request.url);
            // 发送200响应:
            response.writeHead(200);
            // 将文件流导向response:
            fs.createReadStream(filepath).pipe(response);
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
```

## url

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

```js
const url = require('url');

const myURL = new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');

const myURL = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');

const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh'; 
```

## steam

`stream`是`Node.js`提供的又一个仅在服务区端可用的模块，目的是支持“流”这种数据结构。

用`pipe()`把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，所以，这实际上是一个复制文件的程序：

```js
const fs = require('fs');

const rs = fs.createReadStream('sample.txt');
const ws = fs.createWriteStream('copied.txt');

rs.pipe(ws);
```

## crypto

`crypto`模块的目的是为了提供通用的加密和哈希算法。用纯`JavaScript`代码实现这些功能不是不可能，但速度会非常慢。`Nodejs`用`C/C++`实现这些算法后，通过`cypto`这个模块暴露为J`avaScript`接口，这样用起来方便，运行速度也快。

```js
const crypto = require('crypto');

const hash = crypto.createHash('md5');
// 可任意多次调用update():
hash.update('Hello, world!');
hash.update('Hello, nodejs!');

console.log(hash.digest('hex')); // 7e1977739c748beac0c0fd14fd26a544

const hmac = crypto.createHmac('sha256', 'secret-key');

hmac.update('Hello, world!');
hmac.update('Hello, nodejs!');

console.log(hmac.digest('hex')); // 80f7e22570...
```

## 参考资料

[Node.js v20.5.1 documentation](https://nodejs.org/api/synopsis.html)
