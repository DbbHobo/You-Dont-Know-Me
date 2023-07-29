# Generator Async

## async含义

`async` 函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖。

`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

带 `async` 关键字的函数，它使得你的函数的返回值必定是 **promise 对象**；如果 `async` 关键字函数返回的不是 promise，会自动用 `Promise.resolve()` 包装；如果 `async` 关键字函数显式地返回 promise，那就以你返回的 promise 为准。

`async` 函数内部 return 语句返回的值，会成为 `then` 方法回调函数的参数。

`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。

`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。

## async 函数同 Generator 函数区别

`async` 函数对 `Generator` 函数的改进，体现在以下四点：

（1）内置执行器。

`Generator` 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。

```js
asyncReadFile();
```

上面的代码调用了`asyncReadFile`函数，然后它就会自动执行，输出最后结果。这完全不像 `Generator` 函数，需要调用`next`方法，或者用`co`模块，才能真正执行，得到最后结果。

（2）更好的语义。

`async`和`await`，比起星号和yield，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性。

`co`模块约定，`yield`命令后面只能是 `Thunk` 函数或 `Promise` 对象，而`async`函数的`await`命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

（4）返回值是 Promise。

`async`函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用`then`方法指定下一步的操作。

进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而`await`命令就是内部`then`命令的语法糖。

## async 函数实现原理

`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。

## 参考资料

[进程与线程的一个简单解释](https://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
[😇 原生 JS 灵魂之问(下), 冲刺 🚀 进阶最后一公里(神三元)](https://juejin.im/post/6844904004007247880#heading-55)
