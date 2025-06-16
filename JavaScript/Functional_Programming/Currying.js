/*
  函数柯里化
*/
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

let log = (date, type, detail) => {
  console.log(date, type, detail);
}
let nowDate = `${new Date().getMonth() + 1}月${new Date().getDate()}号${new Date().getHours()}时${new Date().getMinutes()}分${new Date().getSeconds()}秒`;
log(nowDate, 'DEBUG日志', '这是一个正常调用的log');
log = curry(log);//进行柯里化变换
let logNow = log(nowDate);//形成一个专门打印今天日期的日志的方法
logNow('DEBUG日志', '这里有一个bug');
logNow('TODO日志', '这里有一个todo');

/**
 *  函数柯理化
 */
function add(x, y) {
  return x+y
}
function addPlus(x) {
  return function (y) {
    return x+y
  }
}
console.log(addPlus(1)(2))

/**
 *  函数合成
 */
function result(num) {
  return `result:${num}`
}

function plus(x, y) {
  return x*y
}

const compose = function (f1, f2) {
  return function(x, y){
    return f1(f2(x,y))
  }
}
console.log(compose(result, plus)(4, 2))

// 扁平化
const flattenDeep = (array) => array.flat(Infinity)

// 去重
const unique = (array) => Array.from(new Set(array))

// 排序
const sort = (array) => array.sort((a, b) => a - b)

// 函数组合
const composeArr = (...fns) => (initValue) => fns.reduce((accumulator, fn) => fn(accumulator), initValue)
const flatten_unique_sort = composeArr(flattenDeep, unique, sort)
// 测试
let arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]
console.log('flatten_unique_sort',flatten_unique_sort(arr))