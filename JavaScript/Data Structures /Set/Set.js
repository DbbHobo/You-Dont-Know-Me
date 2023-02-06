const setFoo = new Set()
setFoo.add('123')
setFoo.add({ name: 'foo' })
setFoo.add({ name: 'foo' })
console.log(setFoo)

let obj = {name: 'obj'}
const setArr = new Set(['a', 'b', 'c', obj])
console.log(setArr)
console.log([...setArr])

for (let key of setArr.keys()) {
    console.log(key)
}
for (let value of setArr.values()) {
    console.log(value)
}
for (let [key,value] of setArr.entries()) {
    console.log(key, value)
}
console.log(setArr.has(obj))
setArr.delete(obj)
console.log(setArr)
setArr.clear()
console.log(setArr)