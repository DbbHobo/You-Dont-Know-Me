function red() {
  console.log("red")
}
function green() {
  console.log("green")
}
function yellow() {
  console.log("yellow")
}

const light = (timeout, cb) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb()
      resolve()
    }, timeout)
  })
}

const runLight = () => {
  Promise.resolve()
    .then(() => {
      return light(3000, red)
    })
    .then(() => {
      return light(1000, green)
    })
    .then(() => {
      return light(2000, yellow)
    })
    .then(() => {
      runLight()
    })
}

runLight()
