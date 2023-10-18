function* gen() {
  let x = 2,
    y = 2
  yield x + y
  yield 6
}
let result = gen()
console.log(result.next())
console.log(result.next())
console.log(result.next())

// ---thunk自动执行generator---
let thunkAsync = (str) => {
  return (callback) => {
    setTimeout(() => {
      callback(str)
    }, 1000)
  }
}

let genForThunk = function* () {
  let res1 = yield thunkAsync("res1...")
  console.log("res1 result:", res1)
  let res2 = yield thunkAsync("res2...")
  console.log("res2 result:", res2)
}

// let g = genForThunk()
// let gen1 = g.next()
// gen1.value(function (data) {
//   let gen2 = g.next(data)
//   gen2.value(function (data) {
//     g.next(data)
//   })
// })

function run(genFn) {
  let gen = genFn()
  function next(data) {
    let res = gen.next(data)
    if (res.done) return
    res.value(next)
  }
  next()
}

run(genForThunk)
// ---thunk自动执行generator---

// ---promise自动执行generator---
let promiseAsync = function (str) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(str)
    }, 3000)
  })
}

let genForPromise = function* () {
  let res1 = yield promiseAsync("res1...")
  console.log("res1 promise result:", res1)
  let res2 = yield promiseAsync("res2...")
  console.log("res2 promise result:", res2)
}

// let g = genForPromise()
// g.next().value.then(function (data) {
//   g.next(data).value.then(function (data) {
//     g.next(data)
//   })
// })

function run(genFn) {
  let gen = genFn()
  function next(data) {
    let res = gen.next(data)
    if (res.done) return res.value
    res.value.then(function (data) {
      next(data)
    })
  }
  next()
}
run(genForPromise)
// ---promise自动执行generator---
