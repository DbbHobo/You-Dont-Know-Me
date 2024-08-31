# Promise

把 `Promise` 看成一个状态机。初始是 `pending` 状态，可以通过函数 `resolve` 和 `reject` ，将状态转变为 `resolved` 或者 `rejected` 状态，状态一旦改变就不能再次变化。

```js
new Promise( function(resolve, reject) {...} /* executor */  );
// executor是带有 resolve 和 reject 两个参数的函数
// Promise构造函数执行时立即调用 executor 函数， resolve 和 reject 两个函数作为参数传递给executor
// executor 函数在Promise构造函数返回所建promise实例对象前被调用
// resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）
```

`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，`Promise` 是一个对象，从它可以获取异步操作的消息。`Promise` 提供统一的 API，各种异步操作都可以用同样的方法进行处理。`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 **resolve** 和 **reject**。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

- （1）对象的状态不受外界影响。`Promise` 对象代表一个异步操作，有三种状态：**pending（进行中）**、**fulfilled（已成功）**和 **rejected（已失败）**。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

- （2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise` 对象的状态改变，只有两种可能：从 `pending` 变为 `fulfilled` 和从 `pending` 变为 `rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对 `Promise` 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

- （3）无法取消 `Promise`，一旦新建它就会立即执行，无法中途取消。

## Promise的实例方法

### Promise.prototype.then()

`Promise.prototype.then()`方法：`Promise` 实例具有 `then` 方法，也就是说，`then` 方法是定义在原型对象 `Promise.prototype` 上的。它的作用是为 `Promise` 实例添加状态改变时的回调函数。`then` 方法可以接受两个回调函数作为参数。第一个回调函数是 `Promise` 对象的状态变为 `resolved` 时调用，第二个回调函数是 `Promise` 对象的状态变为 `rejected` 时调用。其中，第二个函数是可选的，不一定要提供。

`then` 方法返回的是一个**新的 Promise 实例**（注意，不是原来那个 `Promise` 实例）。因此可以采用**链式写法**，即 `then` 方法后面再调用另一个 `then` 方法。

- 返回了一个值，那么 `then` 返回的 `Promise` 将会成为`resolved`状态，并且将**返回的值**作为接受状态的回调函数的参数值。
- 没有返回任何值，那么 `then` 返回的 `Promise` 将会成为`resolved`状态，并且该接受状态的回调函数的参数值为 **`undefined`**。

```js
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
```

### Promise.prototype.catch()

`Promise.prototype.catch()`方法：是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

一般来说，不要在 `then()` 方法里面定义 `Reject` 状态的回调函数（即 `then` 的第二个参数），总是使用 `catch` 方法。如果没有使用 `catch()` 方法指定错误处理的回调函数，`Promise` 对象抛出的错误不会传递到外层代码，即不会有任何反应。

### Promise.prototype.finally()

`Promise.prototype.finally()`方法：用于指定不管 `Promise` 对象最后状态如何，都会执行的操作，与状态无关。

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

## Promise的静态方法

### Promise.all()

`Promise.all()`方法接受一组 `Promise` 实例作为参数，如果不是，就会先调用 `Promise.resolve()` 方法，将参数转为 `Promise` 实例，再进一步处理。另外，`Promise.all()`方法的参数可以不是数组，但必须具有 `Iterator` 接口，且返回的每个成员都是 `Promise` 实例，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调。

`Promise.all().then()`结果中数组的顺序和`Promise.all()`接收到的数组顺序一致。

`all`和`race`传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被`then`的第二个参数或者后面的`catch`捕获；但并不会影响数组中其它的异步任务的执行。

`Promise.all()`方法接受一个**数组**作为参数，p1、p2、p3都是 `Promise` 实例，如果不是，就会先调用下面讲到的`Promise.resolve`方法，将参数转为 `Promise` 实例，再进一步处理。另外，`Promise.all()`方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 `Promise` 实例。如果作为参数的`Promise`实例，自己定义了`catch`方法，那么它一旦被 `rejected`，并不会触发`Promise.all()`的`catch`方法。

```js
// p的状态由p1、p2、p3决定，分成两种情况：
// -（1）只有p1、p2、p3的状态都变成`fulfilled`，p的状态才会变成`fulfilled`，此时p1、p2、p3的**返回值组成一个数组**，传递给p的回调函数。
// -（2）只要p1、p2、p3之中有一个被`rejected`，p的状态就变成`rejected`，此时**第一个被reject的实例的返回值**，会传递给p的回调函数。
const p = Promise.all([p1, p2, p3]);

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// Expected output: Array [3, 42, "foo"]

```

### Promise.allSettled()

`Promise.allSettled(iterable)` 方法接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例。只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。该方法返回的新的 `Promise` 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。状态变成`fulfilled`后，`Promise` 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 `Promise` 实例。

返回结果是一个数组，该数组的每个成员都是一个对象，每个对象都有`status`属性，该属性的值只可能是字符串`fulfilled`或字符串`rejected`。`fulfilled`时，对象有`value`属性，`rejected`时有`reason`属性，对应两种状态的返回值。

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, 'foo'),
);
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) =>
  console.log(results)
);

// Expected output:
// [
//   { status: 'fulfilled', value: 3 },
//   { status: 'rejected', reason: "foo" }
// ]
```

### Promise.race()

`Promise.race()` 方法接受一个数组作为参数，只要入参 `Promise` 实例之中有一个实例率先改变状态，`race` 方法返回的 `Promise` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `race` 方法返回的 `Promise` 的回调函数。

```js
// 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给p的回调函数。
const p = Promise.race([p1, p2, p3]);

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// Expected output: "two"
```

### Promise.any()

`Promise.any()` 方法接收一个由 `Promise` 所组成的可迭代对象，该方法会返回一个新的 `promise`，一旦可迭代对象内的任意一个 `promise` 变成了兑现状态，那么由该方法所返回的 `promise` 就会变成兑现状态，并且它的兑现值就是可迭代对象内的首先兑现的 `promise` 的兑现值。如果可迭代对象内的 `promise` 最终都没有兑现（即所有 `promise` 都被拒绝了），那么该方法所返回的 `promise` 就会变成拒绝状态，并且它的拒因会是一个 `AggregateError` 实例，这是 `Error` 的子类，用于把单一的错误集合在一起。

只要有一个`fullfilled`就变成`fullfilled`状态，全部`rejected`则变成`rejected`状态。

```js
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'));

const promises = [promise1, promise2, promise3];

Promise.any(promises).then((value) => console.log(value));

// Expected output: "quick"
```

### Promise.resolve()

`Promise.resolve(value)`方法：可以将现有对象转为 `Promise` 实例，其状态为已完成。`Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 `Promise` 实例。

```js
Promise.resolve("foo");
// 等价于
new Promise((resolve) => resolve("foo"));
```

### Promise.reject()

`Promise.reject(reason)`方法：会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`，拒绝原因为入参。

```js
const p = Promise.reject("出错了");
// 等同于
const p = new Promise((resolve, reject) => reject("出错了"));
```

### Promise.withResolvers()

`Promise.withResolvers()` 静态方法返回一个对象，其包含一个新的 `Promise` 对象和两个函数，用于解决或拒绝它，对应于传入给 `Promise()` 构造函数执行器的两个参数。

```js
async function* readableToAsyncIterable(stream) {
  let { promise, resolve, reject } = Promise.withResolvers();
  stream.on("error", (error) => reject(error));
  stream.on("end", () => resolve());
  stream.on("readable", () => resolve());

  while (stream.readable) {
    await promise;
    let chunk;
    while ((chunk = stream.read())) {
      yield chunk;
    }
    ({ promise, resolve, reject } = Promise.withResolvers());
  }
}
```

## Promise应用

## 并发指定数量的请求

```js
function mockRequest(id) {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 2000) + 1000; // 模拟 1-3 秒的随机延迟
    setTimeout(() => {
      console.log(`Request ${id} completed`);
      resolve(`Result of request ${id}`);
    }, delay);
  });
}

async function promiseQueue(requests, maxConcurrent) {
  let results = [];
  let executing = [];
  let index = 0;

  const enqueue = () => {
    if (index === requests.length) {
      return Promise.resolve();
    }

    const promise = requests[index++]().then(result => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    let r = Promise.resolve();
    if (executing.length >= maxConcurrent) {
      r = Promise.race(executing);
    }

    return r.then(enqueue);
  };

  return enqueue().then(() => Promise.all(executing)).then(() => results);
}

// 创建一个包含 10 个请求的数组
const requests = Array.from({ length: 10 }, (_, i) => () => mockRequest(i + 1));

// 最大并发数为 3
const maxConcurrent = 3;

promiseQueue(requests, maxConcurrent).then(results => {
  console.log('All requests completed');
  console.log(results);
});
```

## 取消Promise

- `Promise.withResolvers`

```ts
// 使用Promise.withResolvers
const buildCancelableTask = <T>(asyncFn: () => Promise<T>) => {
  let rejected = false;
  const { promise, resolve, reject } = Promise.withResolvers<T>();

  return {
    run: () => {
      if (!rejected) {
        asyncFn().then(resolve, reject);
      }

      return promise;
    },

    cancel: () => {
      rejected = true;
      reject(new Error('CanceledError'));
    },
  };
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const ret = buildCancelableTask(async () => {
  await sleep(1000);
  return 'Hello';
});

(async () => {
  try {
    const val = await ret.run();
    console.log('val: ', val);
  } catch (err) {
    console.log('err: ', err);
  }
})();

setTimeout(() => {
  ret.cancel();
}, 500);
```

- `AbortController`

```ts
// 使用AbortController
const buildCancelableFetch = <T>(
  requestFn: (signal: AbortSignal) => Promise<T>,
) => {
  const abortController = new AbortController();

  return {
    run: () =>
      new Promise<T>((resolve, reject) => {
        if (abortController.signal.aborted) {
          reject(new Error('CanceledError'));
          return;
        }

        requestFn(abortController.signal).then(resolve, reject);
      }),

    cancel: () => {
      abortController.abort();
    },
  };
};
​
const ret = buildCancelableFetch(async signal => {
  return fetch('http://localhost:5000', { signal }).then(res =>
    res.text(),
  );
});
​
(async () => {
  try {
    const val = await ret.run();
    console.log('val: ', val);
  } catch (err) {
    console.log('err: ', err);
  }
})();
​
setTimeout(() => {
  ret.cancel();
}, 500);
```

## 参考资料

[ES6 入门](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/promise)

[Promise MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
