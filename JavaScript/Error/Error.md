# Error

当代码运行时的发生错误，会创建新的 `Error` 对象，并将其抛出。`Error` 对象也可用于用户自定义的异常的基础对象。

```js
new Error()
new Error(message)
new Error(message, options)
new Error(message, fileName)
new Error(message, fileName, lineNumber)
Error()
Error(message)
Error(message, options)
Error(message, fileName)
Error(message, fileName, lineNumber)
```

## EvalError

创建一个 error 实例，表示错误的原因：与 eval() 有关。

## RangeError

创建一个 error 实例，表示错误的原因：数值变量或参数超出其有效范围。

## ReferenceError

创建一个 error 实例，表示错误的原因：无效引用。

## SyntaxError

创建一个 error 实例，表示错误的原因：语法错误。

## TypeError

创建一个 error 实例，表示错误的原因：变量或参数不属于有效类型。

## URIError

创建一个 error 实例，表示错误的原因：给 encodeURI() 或 decodeURI() 传递的参数无效。

## AggregateError

创建一个 error 实例，其中包裹了由一个操作产生且需要报告的多个错误。如：Promise.any() 产生的错误。

## 参考资料

[Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)
