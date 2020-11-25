# XMLHttpRequest 对象

XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。XMLHttpRequest 在 AJAX 编程中被大量使用。

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      alert(xhr.responseText);
    }
  }
};
xhr.open("GET", "/api", false);
xhr.send(null);
```

xhr.readyState 是浏览器判断请求过程中各个阶段的，xhr.status 是 HTTP 协议中规定的不同结果的返回状态说明。

xhr.readyState 的状态码说明：

- 0 -代理被创建，但尚未调用 open() 方法。
- 1 -open() 方法已经被调用。
- 2 -send() 方法已经被调用，并且头部和状态已经可获得。
- 3 -下载中， responseText 属性已经包含部分数据。
- 4 -下载操作已完成

xhr.status 即 HTTP 状态码，有 2xx、3xx、4xx、5xx 等。

[XMLHttpRequest - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
