/*
  实现typeof
*/
console.group('---typeof---');
console.log(typeof 1);
console.log(typeof "1");
console.log(typeof undefined);
console.log(typeof true);
console.log(typeof Symbol());
console.log(typeof b);
console.log(typeof null);
console.log(typeof []);
console.log(typeof {});
console.log(typeof console.log);
console.log(typeof 9007199887740995n);
console.groupEnd();

/*
  实现instanceof
*/
function fakeInstanceOf(left, right) {
  // 获得类型的原型
  let prototype = right.prototype;
  // 获得对象的原型
  left = Object.getPrototypeOf(left);
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if (left === null) return false;
    if (prototype === left) return true;
    left = Object.getPrototypeOf(left);
  }
}
console.group('---实现instanceof---');
console.log(fakeInstanceOf(new String("666"), String));// true
console.log(fakeInstanceOf(666, String));// false
console.log(fakeInstanceOf("666", String));// true
console.log('666' instanceof String);// false
console.log(new String("666") instanceof String);// true
console.groupEnd();
