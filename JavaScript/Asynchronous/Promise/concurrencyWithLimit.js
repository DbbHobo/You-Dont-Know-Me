function mockRequest(id) {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 2000) + 1000 // 模拟 1-3 秒的随机延迟
    setTimeout(() => {
      console.log(`Request ${id} completed`)
      resolve(`Result of request ${id}`)
    }, delay)
  })
}

// async function promiseQueue(requests, maxConcurrent) {
//   let results = []
//   let executing = []
//   let index = 0

//   const enqueue = () => {
//     if (index === requests.length) {
//       return Promise.resolve()
//     }

//     const promise = requests[index++]().then((result) => {
//       results.push(result)
//       executing.splice(executing.indexOf(promise), 1)
//     })

//     executing.push(promise)

//     let r = Promise.resolve()
//     if (executing.length >= maxConcurrent) {
//       r = Promise.race(executing)
//     }

//     return r.then(enqueue)
//   }

//   return enqueue()
//     .then(() => Promise.all(executing))
//     .then(() => results)
// }

// 创建一个包含 10 个请求的数组

async function promiseQueue(requests, maxConcurrent) {
  const results = []
  const executing = []

  for (const request of requests) {
    const p = request().then((result) => {
      // 执行成功后从executing队列中删除
      executing.splice(executing.indexOf(p), 1)
      return result
    })
    results.push(p)
    executing.push(p)

    if (executing.length >= maxConcurrent) {
      await Promise.race(executing)
    }
  }

  return Promise.all(results)
}

const requests = Array.from({ length: 10 }, (_, i) => () => mockRequest(i + 1))

// 最大并发数为 3
const maxConcurrent = 3

promiseQueue(requests, maxConcurrent)
  .then((results) => {
    console.log("All requests completed")
    console.log(results)
  })
  .catch((error) => {
    console.error("One or more requests failed", error)
  })
