# Async

## async定义

`async` 函数是使用`async`关键字声明的函数。`async` 函数是 `AsyncFunction` 构造函数的实例，并且其中允许使用 `await` 关键字。`async` 和 `await` 关键字让我们可以用一种更简洁的方式写出基于 `Promise` 的异步行为，而无需刻意地链式调用 `promise`。

`async` 函数完全可以看作将多个异步操作包装成的一个 `Promise` 对象的函数，而 `await` 命令就是内部 `then` 命令的语法糖。

带 `async` 关键字的函数，它使得你的函数的返回值必定是 **promise 对象**，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

- `async`函数返回一个 `Promise` 对象。`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。
- `async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。任何一个`await`语句后面的 `Promise` 对象变为`reject`状态，那么整个`async`函数都会中断执行。抛出的错误对象会被 `catch` 方法回调函数接收到。
- `async`函数返回的 `Promise` 对象，必须等到内部所有`await`命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。

```js
function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);
  // Expected output: "resolved"
}

asyncCall();
```

## async 函数同 Generator 函数区别

`async` 函数对 `Generator` 函数的改进，体现在以下四点：

（1）内置执行器。

`Generator` 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。

```js
asyncReadFile();
```

上面的代码调用了`asyncReadFile`函数，然后它就会自动执行，输出最后结果。这完全不像 `Generator` 函数，需要调用`next`方法，或者用`co`模块，才能真正执行，得到最后结果。

（2）更好的语义。

`async`和`await`，比起`*`和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性。

`co`模块约定，`yield`命令后面只能是 `Thunk` 函数或 `Promise` 对象，而`async`函数的`await`命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

（4）返回值是 Promise。

`async`函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用`then`方法指定下一步的操作。

进一步说，`async`函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而`await`命令就是内部`then`命令的语法糖。

## async 函数实现原理

`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。

## 异步

- `Promise`：

定义：`Promise` 是一种用于表示异步操作最终完成或失败的对象。它代表了一个异步操作的最终结果。

特点：`Promise` 对象具有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。`Promise` 实例可以通过 `then()` 方法添加成功和失败的回调，也可以通过 `catch()` 方法捕获错误。

应用：`Promise` 主要用于处理异步操作，解决了回调地狱（callback hell）的问题，使得异步代码更加清晰和可读。

---

- `Iterator`：

定义：`Iterator` 是一种对象，它提供了一种统一的方式来遍历数据集合中的元素。

特点：`Iterator` 对象具有一个 `next()` 方法，每次调用该方法可以返回集合中的下一个元素，同时也会返回一个表示是否遍历结束的布尔值。

应用：`Iterator` 主要用于遍历 JavaScript 中的内置数据结构（如数组、Map、Set 等）以及自定义的可迭代对象。

---

- `Generator`：
定义：`Generator` 是一种特殊的函数，可以通过 `function*` 关键字来声明，它允许函数在执行过程中暂停和恢复执行，从而实现一种惰性计算的方式。

特点：`Generator` 函数内部可以通过 `yield` 关键字来暂停函数的执行并返回一个值，然后可以通过调用生成器对象的 `next()` 方法来恢复函数的执行，并将传入的参数作为上一个 `yield` 表达式的返回值。

应用：`Generator` 主要用于简化异步编程、实现惰性计算、和处理无限序列等场景。

---

- `async`/`await`：

定义：`async`/`await` 是一种用于处理异步操作的语法糖，它基于 `Promise`，并提供了一种更加简洁和直观的方式来编写异步代码。

特点：通过在函数前面添加 `async` 关键字，函数内部可以使用 await 关键字来暂停函数的执行，直到 `Promise` 对象状态变为 `resolved`（成功）或 `rejected`（失败）。

应用：`async`/`await` 主要用于编写清晰、简洁的异步代码，使得异步操作更加容易理解和维护。

---

联系：`Promise`、`Iterator`、`Generator` 和 `async`/`await` 都是用于处理异步操作的机制，它们都可以帮助我们更好地管理异步代码和处理异步操作的结果。

区别：

- `Promise` 是一种用于表示异步操作最终完成或失败的对象。
- `Iterator` 是一种提供了统一遍历数据集合的对象。
- `Generator` 是一种特殊的函数，可以暂停和恢复执行，用于实现惰性计算和异步操作。
- `async`/`await` 是一种语法糖，基于 `Promise`，提供了更简洁和直观的方式来处理异步操作。

## 参考资料

[进程与线程的一个简单解释](https://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)

[😇 原生 JS 灵魂之问(下), 冲刺 🚀 进阶最后一公里(神三元)](https://juejin.im/post/6844904004007247880#heading-55)

[async 函数](https://www.bookstack.cn/read/es6-3rd/docs-async.md)
