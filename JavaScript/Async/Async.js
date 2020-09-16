/*
  Generator实现异步操作-Thunk 函数
*/
const readFileThunk = (filename) => {
  // 包装一个读取文件的函数
  return (callback) => {
    console.log(`我读取${filename}中...`);
    // fs.readFile(filename, callback);
  }
}
const gen = function* () {
  // Generator函数
  const data1 = yield readFileThunk('001.txt');
  const data2 = yield readFileThunk('002.txt');
}
function run(gen) {
  // 递归完成gen函数
  const next = (err, data) => {
    let res = gen.next(data);
    console.log(res)
    if (res.done) return;
    res.value(next);
  }
  next();
}
let g = gen();
run(g);