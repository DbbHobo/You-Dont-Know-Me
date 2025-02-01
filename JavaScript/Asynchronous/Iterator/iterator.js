// -----遍历Map-----
const map = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
])
for (let value of map) {
  console.log(value)
}

for (let key of map.keys()) {
  console.log(key)
}

for (let value of map.values()) {
  console.log(value)
}

for (let [key, value] of map.entries()) {
  console.log(key + ":" + value)
}

// -----遍历Set-----
const set = new Set(["value1", "value2", "value3"])

for (let value of set) {
  console.log(value)
}

for (let key of set.keys()) {
  console.log(key)
}

for (let value of set.values()) {
  console.log(value)
}

for (let [key, value] of set.entries()) {
  console.log(key + ":" + value)
}

// -----遍历Array-----
var arr = ["red", "green", "blue"]

for (let value of arr) {
  console.log(value)
}

for (let key of arr.keys()) {
  console.log(key)
}

for (let value of arr.values()) {
  console.log(value)
}

for (let [key, value] of arr.entries()) {
  console.log(key + ":" + value)
}
