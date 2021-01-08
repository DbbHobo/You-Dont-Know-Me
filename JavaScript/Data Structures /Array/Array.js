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