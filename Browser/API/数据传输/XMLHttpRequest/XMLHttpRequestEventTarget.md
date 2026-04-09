# XMLHttpRequestEventTarget

`XMLHttpRequestEventTarget` 是一个描述事件处理程序的接口，你可以在一个用于处理 `XMLHttpRequest` 事件的对象中使用到该事件处理程序。

![browser](../../assets/XMLHttpRequestEventTarget.png)

`XMLHttpRequestEventTarget` => `EventTarget`

## XMLHttpRequestEventTarget的实例方法

- `onabort`

当请求失败时调用该方法，接受 abort 对象作为参数。

- `onerror`
  当请求发生错误时调用该方法，接受 error 对象作为参数。

- `onload`
  当一个 HTTP 请求正确加载出内容后返回时调用，接受 load 对象作为参数。

- `onloadstart`
  当一个 HTTP 请求开始加载数据时调用，接受 loadstart 对象作为参数。

- `onprogress`
  间歇调用该方法用来获取请求过程中的信息，接受 progress 对象作为参数。

## 参考资料

[XMLHttpRequestEventTarget - MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget)
