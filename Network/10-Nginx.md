## Nginx

### nginx配置

```js
events { 

}

http 
{
    server
    { 
        location path
        {
            ...
        }
        location path
        {
            ...
        }
     }

    server
    {
        ...
    }

}
```
- main:nginx的全局配置，对全局生效。
- events:配置影响nginx服务器或与用户的网络连接。
- http：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。
- server：配置虚拟主机的相关参数，一个http中可以有多个server。
- location：配置请求的路由，以及各种页面的处理情况。
- upstream：配置后端服务器具体地址，负载均衡配置不可或缺的部分。

### nginx解决跨域的原理
前端server的域名为：`fe.server.com`，后端服务的域名为：`dev.server.com`

现在我在`fe.server.com`对`dev.server.com`发起请求一定会出现跨域。
现在我们只需要启动一个nginx服务器，将server_name设置为`fe.server.com`,然后设置相应的location以拦截前端需要跨域的请求，最后将请求代理回`dev.server.com`。如下面的配置：
```js
server {
        listen       80;
        server_name  fe.server.com;
        location / {
                proxy_pass dev.server.com;
        }
}
```
这样可以完美绕过浏览器的同源策略：`fe.server.com`访问nginx的`fe.server.com`属于同源访问，而nginx对服务端转发的请求不会触发浏览器的同源策略。
