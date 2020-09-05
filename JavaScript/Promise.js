/*
  实现一个Promise对象
*/
class fakePromise {
  constructor(executorCallBack) {
    this.status = 'pending';// Promise的状态
    this.value = undefined;// 回调函数的入参
    this.fulfilledArr = [];// resolve的执行队列
    this.rejectedArr = [];// reject的执行队列

    // resolve函数
    let resolveFn = result => {
      if (this.status !== 'pending') return;
      let timer = setTimeout(() => {
        this.status = 'fulfilled';
        this.value = result;
        this.fulfilledArr.forEach(Fn => Fn(this.value));
      }, 0);
    }

    // reject函数
    let rejectFn = reason => {
      if (this.status !== 'pending') return;
      let timer = setTimeout(() => {
        this.status = 'rejected';
        this.value = reason;
        this.rejectedArr.forEach(Fn => Fn(this.value));
      }, 0);
    }

    try {
      // new Promise的时候立刻执行传入的函数
      executorCallBack(resolveFn, rejectFn);
    } catch (err) {
      rejectFn(err);
    }
  }

  // then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。
  then(fulfilledCallBack, rejectedCallBack) {
    // 判断传入的是函数
    typeof fulfilledCallBack !== 'function' ? fulfilledCallBack = result => result : null;
    typeof rejectedCallBack !== 'function' ? rejectedCallBack = reason => {
      throw new Error(reason instanceof Error ? reason.message : reason);
    } : null;
    // 调用then方法会返回一个新的Promise对象，从而可以链式调用
    return new fakePromise((resolve, reject) => {
      // resolve执行队列
      this.fulfilledArr.push(() => {
        try {
          // 执行then方法传入的第一个方法fulfilledCallBack，也就是上一个Promise能resolve时的回调函数
          let callbackFn = fulfilledCallBack(this.value);
          // 回调函数返回的是否是Promise，是则执行then方法，否则resolve(callbackFn)
          callbackFn instanceof fakePromise ? callbackFn.then(resolve, reject) : resolve(callbackFn);
        } catch (err) {
          reject(err);
        }
      });

      // reject执行队列
      this.rejectedArr.push(() => {
        try {
          let callbackFn = rejectedCallBack(this.value);
          callbackFn instanceof fakePromise ? callbackFn.then(resolve, reject) : resolve(callbackFn);
        } catch (err) {
          reject(err);
        }
      })
    });
  }

  // catch就是在触发错误的时候调起reject回调
  catch(rejectedCallBack) {
    return this.then(null, rejectedCallBack);
  }

  // 所有的Promise都resolve才resolve，有一个reject就直接reject，入参是数组，里面是一个个Promise实例
  all(promiseArr = []) {
    let index = 0, result = [];
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        promiseArr[i].then(val => {
          index++;
          result[i] = val;
          if (index === promiseArr.length) {// 直到最后一个Promise都resolve为止
            resolve(result)
          }
        }, reject);
      }
    })
  }

  // 只要一个Promise变成resolve就resolve，所有都reject才reject，入参同样是数组，里面是一个个Promise实例
  race(promiseArr = []) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        promiseArr[i].then(val => {
          resolve(val);
          return;
        }, reject);
      }
    })
  }

  // 将现有对象转为 Promise 对象
  resolve(obj) {
    if (obj instanceof Promise) return obj
    return new Promise(resolve => resolve(obj))
  }

  // 返回一个新的 Promise 实例，该实例的状态为rejected
  reject(obj) {
    return new Promise((resolve, reject) => reject(obj))
  }
}


/*
  测试用例-then
*/
let p1 = new fakePromise((resolve, reject) => {
  let flag = 1
  setTimeout(() => {
    flag == 1 ? resolve('我是resolve') : reject('我是reject');
  }, 500)
})

let p2 = p1.then(result => {
  return result + '-来自新Promise';
})

let p3 = p2.then(result => {
  console.log(result);
}, reason => {
  console.log(reason);
})

/*
  测试用例-all&race
*/
const p4 = new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('hello');
  }, 1000);

})

const p5 = new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('world');
  }, 500);
})

fakePromise.prototype.all([p4, p5]).then(res => {
  console.log(res)
})

fakePromise.prototype.race([p4, p5]).then(res => {
  console.log(res)
})