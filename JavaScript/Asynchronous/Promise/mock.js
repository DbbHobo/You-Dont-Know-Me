class fakePromise{
    constructor(executor) {
        this.status = 'pending'
        this.value = null
        this.resolveList = []
        this.rejectList = []

        const resolveFn = (res) => {
            if (this.status != 'pending') throw ('status is changed')
            setTimeout(() => {
                this.status = 'resolve'
                this.value = res
                this.resolveList.forEach(fn => fn(res))
            }, 0);
        }

        const rejectFn = (res) => {
            if (this.status != 'pending') throw ('status is changed')
            setTimeout(() => {
                this.status = 'resolve'
                this.value = res
                this.rejectList.forEach(fn => fn(res))
            }, 0);
        }

        try {
            executor(resolveFn,rejectFn)
        } catch (error) {
            rejectFn(error)
        }
    }

    then(resolveCallback, rejectCallback) {
        typeof resolveCallback !== 'function' ? resolveCallback = resolveCallback => resolveCallback : null;
        if (rejectCallback) {
            typeof rejectCallback !== 'function' ? rejectCallback = rejectCallback => { throw new Error(typeof rejectCallback === 'Error' ? rejectCallback.message : rejectCallback) } : null;
        }
        
        return new fakePromise((resolve,reject) => {
            this.resolveList.push(() => {
                try {
                    let callbackFn = resolveCallback(this.value)
                    callbackFn instanceof fakePromise ? callbackFn.then(resolve,reject) : resolve(callbackFn)
                } catch (error) {
                    reject(error)
                }
            })
            
            rejectCallback && this.rejectList.push(() => {
                try {
                    let callbackFn = rejectCallback(this.value)
                    callbackFn instanceof fakePromise ? callbackFn.then(resolve,reject) : reject(callbackFn)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    catch(rejectFn) {
        return this.then(undefined,rejectFn)
    }

    all(promistList) {
        let count = 0,result = []
        return new fakePromise((resolve,reject) => {
            promistList.map(promiseItem => {
                promiseItem.then(value => {
                    count++
                    result.push(value)
                    if (count == promistList.length) {
                        resolve(result)
                    }
                },reject)
            })
        })
    }

    allSettled(promistList) {
        let count = 0,result = []
        return new fakePromise((resolve,reject) => {
            promistList.map(promiseItem => {
                promiseItem.then(value => {
                    count++
                    result.push({
                        status: 'resolved',
                        value: value
                    })
                    if (count == promistList.length) {
                        resolve(result)
                    }
                },value => {
                    count++
                    result.push({
                        status: 'rejected',
                        value: value
                    })
                    if (count == promistList.length) {
                        resolve(result)
                    }
                })
            })
        })
    }
}

let flag = true;
let pro = new fakePromise(function (resolve, reject) {
  setTimeout(() => {
    Math.random() < 0.5 ? resolve(100) : reject(-100);
  }, 500);
})
let pro1 = new fakePromise(function (resolve, reject) {
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

pro.all([pro, pro1]).then((result) => {
  console.log('promise.all resolve了啥？', result);
}, (reason) => {
  console.log('promise.all reject了啥？', reason);
})

pro.allSettled([pro, pro1]).then((result) => {
    console.log('promise.allSettled resolve了啥？', result);
  }, (reason) => {
    console.log('promise.allSettled reject了啥？', reason);
  })