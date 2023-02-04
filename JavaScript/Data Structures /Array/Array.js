// 扁平化
const flattenDeep = (array) => array.flat(Infinity)// Node12.0+
const flatArray = (arr) => {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr)
  }
  return arr
}
const flatArrayNew = (arr) => {
  return arr.reduce((acc, cur) => {
    acc = acc.concat(Array.isArray(cur) ? flatArrayNew(cur) : cur);
    return acc;
  }, []);
}

// 去重
const unique = (array) => Array.from(new Set(array))
const arrayUniq = (arr) => {
  return arr.reduce((acc, cur) => {
    if (!acc.includes(cur)) acc.push(cur);
    return acc;
  }, []);
}

// 排序
const sort = (array) => array.sort((a, b) => a - b)

// 函数组合
const compose = (...fns) => (initValue) => fns.reduceRight((y, fn) => fn(y), initValue)

// 组合后调用
const flatten_unique_sort = compose(sort, arrayUniq, flatArrayNew)

// 测试
let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
console.log(flatten_unique_sort(arr))
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

let arr1 = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
}
let arr2 = Array.from(arr1, x => x + 'd');
console.group('Array.from Array.of')
console.log(arr1, arr2, Array(3), Array.of(3))
console.groupEnd()

let arr3 = [1, 2, 3, 4]
let arr4 = ['a', 'b', 'c', 'd']
let arr5 = arr3.concat(arr4)
console.group('Array.prototype.concat')
console.log(arr3,arr4,arr5)
console.groupEnd()

let arr6 = arr5.splice(1,0,'add')
console.group('Array.prototype.splice')
console.log(arr5,arr6)
console.groupEnd()

let arr7 = arr5.slice(1,2)
console.group('Array.prototype.slice')
console.log(arr5,arr7)
console.groupEnd()

let arr8 = arr5.join('-')
console.group('Array.prototype.join')
console.log(arr5,arr8)
console.groupEnd()

let arr9 = [3, 4, 5, 6, '7', 8]
console.group('Array.prototype.every & Array.prototype.some & Array.prototype.filter')
console.log(arr9.every(x => x > 2))
console.log(arr9.some(x => x < 4))
console.log(arr9.filter(x=>Number.isFinite(x)),arr9)
console.groupEnd()

let arr10 = [9, 8, 7, 6, 5, 4]
let arr11 = arr10.map((x,index,arr)=> x = index)
console.group('Array.prototype.map')
console.log(arr10,arr11)
console.groupEnd()

let arr12 = [9, 8, 7, 6, 5, 4]
let arr13 = arr12.reduce((result, x, index, arr) => result = result + x, 1)
let arr14 = arr12.reduce((result,x,index,arr)=>result = result*x,1)
console.group('Array.prototype.reduce & Array.prototype.reduceRight')
console.log(arr12,arr13,arr14)
console.groupEnd()

let arr15 = ['tomboy','hurt','ditto','girls']
let arr16 = arr15.find((x, index, arr) => x == 'hurtx')
let arr17 = arr15.findIndex((x,index,arr)=> x == 'hurtx')
console.group('Array.prototype.find & Array.prototype.findIndex')
console.log(arr15,arr16,arr17)
console.groupEnd()

let arr18 = new Array(3).fill({ name: 'gidle' })
arr18[0].age = 19
console.group('Array.prototype.fill')
console.log(arr18)
console.groupEnd()

let arr19 = ['a', 'b', 'c']
console.group('Array.prototype.entries & Array.prototype.keys & Array.prototype.values')
for (let [index,item] of arr19.entries()) {
  console.log(index,item)
}
for (let item of arr19.keys()) {
  console.log(item)
}
for (let item of arr19.values()) {
  console.log(item)
}
console.groupEnd()

let arr20 = [857,899,888]
console.group('Array.prototype.inclues & Array.prototype.indexOf')
console.log(arr20.includes(857),arr20.indexOf(899))
console.groupEnd()