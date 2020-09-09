/*
  闭包的含义
*/
function closure() {
  let name = "Im a closure"; // name 是一个被closure()创建的局部变量
  function displayName() { // displayName()是内部函数，一个闭包
    console.group('---闭包---');
    console.log(name); // 使用了父函数中声明的变量，内部函数displayName()的作用域链中包含closure()的作用域
    console.groupEnd();
  }
  displayName();
}
closure();

/*
  经典的输出0，1，2...问题
*/
// 无法输出0，1，2
for (var i = 1; i <= 3; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
//闭包
for (var i = 1; i <= 3; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.group('---闭包---');
      console.log(j);
      console.groupEnd();
    }, j * 1000)
  })(i);
}
// 使用 setTimeout 的第三个参数
for (var i = 1; i <= 3; i++) {
  setTimeout(function timer(j) {
    console.group('---setTimeout---');
    console.log(j);
    console.groupEnd();
  }, i * 1000, i);
}
// let
for (let i = 1; i <= 3; i++) {
  setTimeout(function timer() {
    console.group('---let---');
    console.log(i);
    console.groupEnd();
  }, i * 1000);
}

/*
  使用闭包来模拟私有方法、变量
*/
let makeCounter = function () {
  let privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function () {
      changeBy(1);
    },
    decrement: function () {
      changeBy(-1);
    },
    value: function () {
      return privateCounter;
    }
  }
};

let Counter1 = makeCounter();
let Counter2 = makeCounter();
console.group('---使用闭包来进行数据隐藏和封装---');
console.log(Counter1.value()); /* 0 */
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); /* 2 */
Counter1.decrement();
console.log(Counter1.value()); /* 1 */
console.log(Counter2.value()); /* 0 */ // Counter1和Counter2互不影响,创建了两个独立的闭包环境
console.groupEnd();