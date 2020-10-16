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
const readFileThunk = (filename) => {// 包装一个读取文件的函数
  return (callback) => {
    console.log(`我读取${filename}中...`);
    // fs.readFile(filename, callback);
  }
}
const gen = function* () {// Generator函数
  const data1 = yield readFileThunk('001.txt');
  const data2 = yield readFileThunk('002.txt');
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
run(g);