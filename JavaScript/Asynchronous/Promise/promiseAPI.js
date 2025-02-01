function mockRequest(id) {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 2000) + 1000 // 模拟 1-3 秒的随机延迟
    setTimeout(() => {
      console.log(`Request ${id} completed`)
      // resolve(`Result of request ${id} success`)
      id > 10
        ? resolve(`Result of request ${id} success`)
        : reject(`Result of request ${id} failure`)
    }, delay)
  })
}

// Create an array of 10 mock request functions
const requests = Array.from({ length: 10 }, (_, i) => mockRequest(i + 1))

Promise.all(requests)
  .then((result) => {
    console.log("Success")
    console.log(result)
  })
  .catch((result) => {
    console.log("Failure")
    console.log(result)
  })

// Promise.race(requests.map((request) => request()))
//   .then((result) => {
//     console.log("Success")
//     console.log(result)
//   })
//   .catch((result) => {
//     console.log("Failure")
//     console.log(result)
//   })

// Promise.allSettled(requests.map((request) => request()))
//   .then((result) => {
//     console.log("Success")
//     console.log(result)
//   })
//   .catch((result) => {
//     console.log("Failure")
//     console.log(result)
//   })

// Promise.any(requests.map((request) => request()))
//   .then((result) => {
//     console.log("Success")
//     console.log(result)
//   })
//   .catch((result) => {
//     console.log("Failure")
//     console.log(result)
//   })
