/*
  Symbol.iterator遍历器
*/
let str = "hi";
typeof str[Symbol.iterator]
// "function"

let iterator = str[Symbol.iterator]();
// 执行遍历器函数返回一个遍历器对象iterator
// 该对象的根本特征就是具有next方法。每次调用next方法，都会返回一个代表当前成员的信息对象，具有value和done两个属性。
console.group('---iterator遍历器---');
console.log(iterator.next())  // { value: "h", done: false }
console.log(iterator.next())  // { value: "i", done: false }
console.log(iterator.next())  // { value: undefined, done: true }
console.groupEnd();


/*
  Generator实现异步操作-Thunk 函数
*/
const Thunk = function (fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  }
}
const readTxt = (filename) => {// 读取文件
  return (next) => {
    // fs.readFile(filename);
    next();
  }
}
const readFileThunk = Thunk(readTxt);
const callback = (filename) => {// 读取文件的回调函数
  console.log(`我读取了${filename}...`);
}
const gen = function* () {// Generator函数
  const data1 = yield readFileThunk('001.txt')(callback('001.txt'));
  const data2 = yield readFileThunk('002.txt')(callback('002.txt'));
}
function run(gen) {// 递归完成gen函数
  const next = (err, data) => {
    let res = gen.next(data);
    console.log(res);
    if (res.done) return;
    res.value(next);
  }
  next();
}
let g = gen();
console.group('---自动执行Generator---');
run(g);
console.groupEnd();


function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('finish')
      resolve("sleep");
    }, 2000);
  });
}
async function test() {
  let value = await sleep();
  console.log(value);
  console.log("object");
}
test()