# Nginx
Nginx is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache. 

Nginx is built to offer low memory usage and high concurrency. Rather than creating new processes for each web request, Nginx uses an asynchronous, event-driven approach where requests are handled in a single thread.

## 正向代理 反向代理
正向代理是一个位于客户端和目标服务器之间的代理服务器(中间服务器)。为了从原始服务器取得内容，客户端向代理服务器发送一个请求，并且指定目标服务器，之后代理向目标服务器转交并且将获得的内容返回给客户端。正向代理的情况下客户端必须要进行一些特别的设置才能使用。
              
反向代理正好相反。对于客户端来说，反向代理就好像目标服务器。并且客户端不需要进行任何设置。客户端向反向代理发送请求，接着反向代理判断请求走向何处，并将请求转交给客户端，使得这些内容就好似他自己一样，一次客户端并不会感知到反向代理后面的服务，也因此不需要客户端做任何设置，只需要把反向代理服务器当成真正的服务器就好了。

## 负载均衡
负载均衡是在支持应用程序的资源池中平均分配网络流量的一种方法。如果没有负载均衡，客户端与服务端的操作通常是：客户端请求服务端，然后服务端去数据库查询数据，将返回的数据带给客户端。

公司通常在多台服务器上运行其应用程序。这种服务器安排称为服务器场。用户对应用程序的请求首先转到负载均衡器。然后，负载均衡器会将每个请求路由到服务器场中最适合处理该请求的单个服务器。

- 应用程序负载均衡

复杂的现代应用程序拥有多个服务器场，其中包含多个专用于单个应用程序功能的服务器。应用程序负载均衡器会查看请求内容（如 HTTP 标头或 SSL 会话 ID）以重定向流量。 

例如，电子商务应用程序具有产品目录、购物车和结账功能。应用程序负载均衡器会将浏览产品的请求发送给包含图像和视频但不需要保持开放连接的服务器。相比之下，它会将购物车请求发送给能够保持多个客户端连接并长时间保存购物车数据的服务器。

- 网络负载均衡

网络负载均衡器会检查 IP 地址和其他网络信息，以最佳方式重定向流量。它们将跟踪应用程序流量的来源，并可以将一个静态 IP 地址分配给多个服务器。网络负载均衡器使用前面介绍的静态和动态负载均衡算法来均衡服务器负载。

- 全局服务器负载均衡

全局服务器负载均衡可跨地理位置分散的多个服务器进行。例如，很多公司可能在不同国家/地区的多个数据中心以及全球的第三方云提供商中拥有服务器。在这种情况下，本地负载均衡器将管理某一地区或区域内的应用程序负载。这些负载均衡器会尝试将流量重定向到地理位置更接近客户端的服务器目标。只有在服务器出现故障的情况下，这些负载均衡器才会将流量重定向到客户端所在地理区域之外的服务器。

- DNS 负载均衡

在 DNS 负载均衡中，您可以将域配置为跨域上的资源池路由网络请求。域可以对应于网站、邮件系统、打印服务器或可通过互联网访问的其他服务。DNS 负载均衡有助于在全球分布的资源池中保持应用程序可用性以及均衡网络流量。 

## nginx配置
配置文件分为三个模块：

- `全局`：从配置文件开始到events块之间，主要是设置一些影响 `nginx` 服务器整体运行的配置指令。
- `events`：影响 `nginx` 服务器与用户的网络连接，常用的设置包括是否开启对多 `workprocess` 下的网络连接进行序列化，是否允许同时接收多个网络连接等等
- `http`：反向代理和负载均衡都在此配置

```conf
#全局配置
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

#events配置
events { 
    worker_connections  1024;
}

#http配置
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    server{ 
        location path
        {
            ...
        }
        location path
        {
            ...
        }
     }

    upstream mysvr {   
        server 127.0.0.1:7878;
        server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server{
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }

}
```
- `main`: nginx的全局配置，对全局生效。
- `events`: 配置影响nginx服务器或与用户的网络连接。
- `http`: 可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。
  - `server`: 配置虚拟主机的相关参数，一个http中可以有多个server。
    - `location`: 配置请求的路由，以及各种页面的处理情况。
      - `=` ：精确匹配，用于不含正则表达式的url前，要求字符串与url严格匹配，完全相等时，才能停止向下搜索并处理请求
      - `^~` ：用于不含正则表达式的url前，要求ngin服务器找到表示url和字符串匹配度最高的location后，立即使用此location处理请求，而不再匹配
      - `~` ：最佳匹配，用于表示url包含正则表达式，并且区分大小写。
      - `~*`：与~一样，只是不区分大小写
  - `upstream`: 配置后端服务器具体地址，负载均衡配置不可或缺的部分。

## nginx解决跨域的原理
前端服务器的域名为：`fe.server.com`，后端服务器的域名为：`dev.server.com`。在`fe.server.com`对`dev.server.com`发起请求一定会出现跨域。只需要启动一个 `nginx` 服务器，将 `server_name` 设置为`fe.server.com`,然后设置相应的 `location` 以拦截前端需要跨域的请求，最后将请求代理回 `dev.server.com`。如下面的配置：
```js
server {
    listen       80;
    server_name  fe.server.com;
    location / {
            proxy_pass dev.server.com;
    }
}
```
这样可以绕过浏览器的同源策略：`fe.server.com`访问 `nginx` 的 `fe.server.com`属于同源访问，而 `nginx` 对服务端转发的请求不会触发浏览器的同源策略。

## 参考资料
[What Is Nginx? A Basic Look at What It Is and How It Works](https://kinsta.com/knowledgebase/what-is-nginx/)
[Nginx 配置详解](https://www.runoob.com/w3cnote/nginx-setup-intro.html)