class myPromise {
  constructor(excuteCallback) {
    this.status = 'pending';
    this.value = 'null';
    this.fulfilledArr = [];
    this.rejectedArr = [];

    let resolveFn = (result) => {
      if (this.status !== 'pending') return;
      setTimeout(() => {
        this.status = 'fulfilled';
        this.value = result;
        this.fulfilledArr.forEach(Fn => Fn(result));
      }, 0);
    }

    let rejectFn = (reason) => {
      if (this.status !== 'pending') return;
      setTimeout(() => {
        this.status = 'rejected';
        this.value = reason;
        this.rejectedArr.forEach(Fn => Fn(reason));
      }, 0);
    }

    try {
      excuteCallback(resolveFn, rejectFn);
    } catch (error) {
      rejectFn(error);
    }
  }

  then(fulfilledFn, rejectedFn) {
    typeof fulfilledFn !== 'function' ? fulfilledFn = fulfilledFn => fulfilledFn : null;
    typeof rejectedFn !== 'function' ? rejectedFn = rejectedFn => { throw new Error(typeof rejectedFn === 'Error' ? rejectedFn.message : rejectedFn) } : null;
    return new myPromise((resolve, reject) => {
      this.fulfilledArr.push(() => {
        try {
          // 执行then方法传入的第一个方法fulfilledFn，也就是上一个Promise能resolve时的回调函数
          let callbackFn = fulfilledFn(this.value);
          // 回调函数返回的是否是Promise，是则执行then方法，否则resolve(callbackFn)
          callbackFn instanceof myPromise ? callbackFn.then(resolve, reject) : resolve(callbackFn);
        } catch (error) {
          reject(error);
        }
      });

      this.rejectedArr.push(() => {
        try {
          let callbackFn = rejectedFn(this.value);
          // 回调函数返回的是否是Promise，是则执行then方法，否则resolve(callbackFn)
          callbackFn instanceof myPromise ? callbackFn.then(resolve, reject) : resolve(callbackFn);
        } catch (error) {
          reject(error);
        }
      })
    });
  }

  catch(rejectedFn) {
    return this.then(null, rejectedFn);
  }

  all(promisesArr = []) {
    let count = 0, result = [];
    return new myPromise((resolve, reject) => {
      for (let i = 0; i < promisesArr.length; i++) {
        promisesArr[i].then((value) => {
          count++;
          result[i] = value;
          if (count === promisesArr.length) {
            resolve(result)
          }
        }, reject);
      }
    })
  }

  race(promisesArr = []) {
    return new myPromise((resolve, reject) => {
      for (let i = 0; i < promisesArr.length; i++) {
        promisesArr[i].then((result) => {
          resolve(result)
          return
        }, reject)
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

let flag = true;
let pro = new myPromise(function (resolve, reject) {
  setTimeout(() => {
    Math.random() < 0.5 ? resolve(100) : reject(-100);
  }, 500);
})
let pro1 = new myPromise(function (resolve, reject) {
  setTimeout(() => {
    Math.random() < 0.5 ? resolve(200) : reject(-200);
  }, 100);
})

pro.then((result) => {
  console.log('promise resolve了啥？', result);
  return 666
}, (reason) => {
  console.log('promise reject了啥？', reason);
  return 777
}).then((result) => {
  console.log('promise resolve了啥？', result);
}, (reason) => {
  console.log('promise reject了啥？', reason);
})

Promise.all([pro, pro1]).then((result) => {
  console.log('promise.all resolve了啥？', result);
}, (reason) => {
  console.log('promise.all reject了啥？', reason);
})

Promise.race([pro, pro1]).then((result) => {
  console.log('promise.race resolve了啥？', result);
}, (reason) => {
  console.log('promise.race reject了啥？', reason);
})