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
  // 基本数据类型直接返回false
  if (typeof left !== 'object' || left === null) return false;
  // 获得类型的原型
  let prototype = right.prototype;
  // 获得要检测的这个实例的原型
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
console.log(fakeInstanceOf("666", String));// false
console.log(new String("666") instanceof String);// true
console.log(666 instanceof String);// false
console.log('666' instanceof String);// false
console.log(String.prototype.isPrototypeOf(new String("666")));// true
console.log(String.prototype.isPrototypeOf('666'));// false
console.groupEnd();

/*
  用Symbol.hasInstance自定义 instanceof 操作符在某个类上的行为
*/
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === 'string'
  }
}
console.group('---Symbol.hasInstance---');
console.log('666' instanceof PrimitiveString); // 判断基本类型数据
console.log(666 instanceof PrimitiveString); // 判断基本类型数据
console.groupEnd();

/*
  数据类型转换
*/
console.group('---数据类型转换---');
console.log(1 + "1"); // '11'
console.log(true + true); // 2
console.log(4 + [1, 2, 3]); // "41,2,3"
console.groupEnd();