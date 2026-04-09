# XMLHttpRequest 对象

`XMLHttpRequest`（XHR）对象用于与服务器交互。通过 `XMLHttpRequest` 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。`XMLHttpRequest` 在 AJAX 编程中被大量使用。

如果你的通信流程需要从服务器端接收事件或消息数据，请考虑通过 `EventSource` 接口使用服务器发送事件。对于全双工的通信，`WebSocket` 可能是更好的选择。

```js
var xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      alert(xhr.responseText)
    }
  }
}
xhr.open("GET", "/api", false)
xhr.send(null)
```

`XMLHttpRequest` => `XMLHttpRequestEventTarget` => `EventTarget`

当创建一个 `XMLHttpRequest` 实例时，实际上得到了两个可以监听事件的通道：

- 对象本身 (`xhr`)：继承自 `XMLHttpRequestEventTarget`，用来监听**服务器数据返回**相关的进度和最终结果。
- 上传属性 (`xhr.upload`)：同样继承自 `XMLHttpRequestEventTarget`，但它专门用来监听**发送数据到服务器**的过程。

## XMLHttpRequest的实例属性

- `readyState`

`xhr.readyState` 是浏览器判断请求过程中各个阶段的，`xhr.status` 是 HTTP 协议中规定的不同结果的返回状态说明。

`xhr.readyState` 的状态码说明：

- 0 -代理被创建，但尚未调用 open() 方法。
- 1 -open() 方法已经被调用。
- 2 -send() 方法已经被调用，并且头部和状态已经可获得。
- 3 -下载中， responseText 属性已经包含部分数据。
- 4 -下载操作已完成

```js
  var xhr = new XMLHttpRequest();
  xhr.open('post','www.xxx.com',true)
  // 接收返回值
  xhr.onreadystatechange = function(){
      if(xhr.readyState === 4 ){
          if(xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
              console.log(xhr.responseText);
          }
      }
  }
  // 处理请求参数
  postData = {"name1":"value1","name2":"value2"};
  postData = (function(value){
  var dataString = "";
  for(var key in value){
        dataString += key+"="+value[key]+"&";
  };
    return dataString;
  }(postData));
  // 设置请求头
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  // 异常处理
  xhr.onerror = function() {
      console.log('Network request failed')
  }
  // 跨域携带cookie
  xhr.withCredentials = true;
  // 发出请求
  xhr.send(postData);
```

- `response`
- `responseText`
- `responseType`
- `responseURL`
- `responseXML`
- `status`

`xhr.status` 即 HTTP 状态码，有 2xx、3xx、4xx、5xx 等。

- `statusText`
- `timeout`
- `upload`
- `withCredentials`

## XMLHttpRequest的实例方法

- `abort()`
- `getAllResponseHeaders()`
- `getResponseHeader()`
- `open()`
- `overrideMimeType()`
- `send()`
- `setRequestHeader()`

## XMLHttpRequest的使用案例

## 参考资料

[XMLHttpRequest - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
