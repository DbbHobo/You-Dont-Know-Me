const mapFoo = new Map();
const s1 = {
    name: 's1'
}
const s2 = {
    name: 's2'
}
const s3 = {
    name: 's3'
}
mapFoo.set(s1, 4)
mapFoo.set(s2, 1)
mapFoo.set(s3, 7)
console.log(mapFoo)

for (let key of mapFoo.keys()) {
    console.log(key)
}
for (let key of mapFoo.values()) {
    console.log(key)
}
for (let [key,value] of mapFoo.entries()) {
    console.log(key,value)
}
mapFoo.forEach((value, key, map) => {
    console.log(value,key,map)
})

mapFoo.delete(s3)
console.log(mapFoo.has(s3))
console.log(mapFoo)

mapFoo.clear()
console.log(mapFoo)


let arr = [['name','a'],['age','b'],['grade','c']]
let mapArr = new Map(arr)
console.log(mapArr)
let mapMap = new Map(mapFoo)
console.log(mapMap)