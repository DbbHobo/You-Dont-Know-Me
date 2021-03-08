# Promise

把 Promise 看成一个状态机。初始是 pending 状态，可以通过函数 resolve 和 reject ，将状态转变为 resolved 或者 rejected 状态，状态一旦改变就不能再次变化。

```js
new Promise( function(resolve, reject) {...} /* executor */  );
// executor是带有 resolve 和 reject 两个参数的函数 。
// Promise构造函数执行时立即调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor
// （executor 函数在Promise构造函数返回所建promise实例对象前被调用）。
// resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。
```

Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 **resolve** 和 **reject**。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

（1）对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

（3）无法取消 Promise，一旦新建它就会立即执行，无法中途取消。

`Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

## then

`Promise.prototype.then()`方法：Promise 实例具有 then 方法，也就是说，then 方法是定义在原型对象 `Promise.prototype` 上的。它的作用是为 Promise 实例添加状态改变时的回调函数。then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。

then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法。

## catch

`Promise.prototype.catch()`方法：是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。

一般来说，不要在 then()方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 catch 方法。
如果没有使用 catch()方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

## finally

`Promise.prototype.finally()`方法：用于指定不管 Promise 对象最后状态如何，都会执行的操作，与状态无关。

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

## all

`Promise.prototype.all()`方法：Promise.all()方法接受一个数组作为参数，都是 Promise 实例，如果不是，就会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再进一步处理。另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

## race

`Promise.prototype.race()`方法：Promise.race()方法接受一个数组作为参数，只要入参 Promise 实例之中有一个实例率先改变状态，race 方法返回的 Promise 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 race 方法返回的 Promise 的回调函数。

## resolve

`Promise.prototype.resolve()`方法：需要将现有对象转为 Promise 对象。

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

## reject

`Promise.prototype.reject()`方法：会返回一个新的 Promise 实例，该实例的状态为 rejected。

```js
const p = Promise.reject("出错了");
// 等同于
const p = new Promise((resolve, reject) => reject("出错了"));
```

## 参考资料：

[ES6 入门](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/promise)

[Promise MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
