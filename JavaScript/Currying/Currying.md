# 函数柯里化和偏函数

## 函数柯里化的定义

柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。

函数柯里化就是将 f(a,b,c)调用形式转化为 f(a)(b)(c)调用形式的一种转化方法。

## 函数柯里化变换过程

```js
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
```

## 函数柯里化的应用
