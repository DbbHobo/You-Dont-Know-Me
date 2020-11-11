/*
  Object.assign
*/
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);
console.group('---typeof---');
console.log(target);
console.log(returnedTarget);
target.a = 666;
console.log(target);
console.log(returnedTarget);
console.groupEnd();