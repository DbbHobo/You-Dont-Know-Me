/*
  Object.assign浅拷贝对象
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

/*
  concat浅拷贝数组
*/
let arr = [1, 2, 3];
let copiedArr = arr.concat();
copiedArr[1] = 100;
console.group('---concat---');
console.log(arr);// [ 1, 2, 3 ]
console.log(copiedArr);// [ 100, 2, 3 ]
console.groupEnd();

/*
  ...运算符浅拷贝数组
*/
let arr1 = [1, 2, 3, { test: '666' }];
let copiedArr1 = [...arr1];
copiedArr1[3] = { test: '777' }
console.group('---...运算符---');
console.log(arr1);// [ 1, 2, 3, { test: '666' } ]
console.log(copiedArr1);// [ 1, 2, 3, { test: '777' } ]
console.groupEnd();

/*
  深拷贝JSON.parse(JSON.stringify(object))
*/
const a = {
  string: 'string',
  number: 123,
  bool: false,
  nul: null,
  date: new Date(),  // stringified
  undef: undefined,  // lost
  inf: Infinity,  // forced to 'null'
  re: /.*/,  // lost
}
console.group('---JSON.parse(JSON.stringify(object))---');
console.log(a);
console.log(typeof a.date);  // object
const clone = JSON.parse(JSON.stringify(a));
console.log(clone);
console.log(typeof clone.date);  // string
console.groupEnd();


/*
  深拷贝遍历
*/
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }

  if (!isObject(obj)) {
    throw new Error('非对象')
  }

  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })

  return newObj
}
let obj = {
  a: [1, 2, 3],
  b: {
    c: 2,
    d: 3
  }
}
let newObj = deepClone(obj);
newObj.b.c = 1;
console.group('---深拷贝遍历---');
console.log(newObj);
console.groupEnd();
