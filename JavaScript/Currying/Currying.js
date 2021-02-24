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
let nowDate = `${new Date().getMonth() + 1}月${new Date().getDate()}号`;
log(nowDate, 'DEBUG日志', '这是一个正常调用的log');
log = curry(log);//进行柯里化变换
let logNow = log(nowDate);//形成一个专门打印今天日期的日志的方法
logNow('DEBUG日志', '这里有一个bug');
logNow('TODO日志', '这里有一个todo');