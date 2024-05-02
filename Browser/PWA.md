# PWA

渐进式 Web 应用（Progressive Web App，PWA）是一个使用 web 平台技术构建的应用程序，但它提供的用户体验就像一个特定平台的应用程序。它像网站一样，PWA 可以通过一个代码库在多个平台和设备上运行。它也像一个特定平台的应用程序一样，可以安装在设备上，可以离线和在后台运行，并且可以与设备和其他已安装的应用程序集成。

## Web应用缺陷

那相对于本地应⽤，Web⻚⾯到底缺少了什么？

- Web应⽤缺少离线使⽤能⼒，在离线或者在弱⽹环境下基本上是⽆法使⽤的。⽽⽤户需要的是沉浸式的体验，在离线或者弱⽹环境下能够流畅地使⽤是⽤户对⼀个应⽤的基本要求。
- Web应⽤还缺少了消息推送的能⼒，因为作为⼀个App⼚商，需要有将消息送达到应⽤的能⼒。
- Web应⽤缺少⼀级⼊⼝，也就是将Web应⽤安装到桌⾯，在需要的时候直接从桌⾯打开Web应⽤，⽽不是每次都需要通过浏览器来打开。

针对以上Web缺陷，PWA提出了两种解决⽅案：通过引⼊`Service Worker`来试着解决离线存储和消息推送的问题，通过引⼊`manifest.json`来解决⼀级⼊⼝的问题。

## Service Worker

`Service Worker`的概念，它的主要思想是在⻚⾯和⽹络之间增加⼀个拦截器，⽤来缓存和拦截请求。

- `Web Worker`是临时的，每次`JavaScript`脚本执⾏完成之后都会退出，执⾏结果也不能保存下来，如果下次还有同样的操作，就还得重新来⼀遍。`Service Worker`需要在`Web Worker`的基础之上加上储存功能。
- 在⽬前的Chrome架构中，`Service Worker`是运⾏在浏览器进程中的，因为浏览器进程⽣命周期是最⻓的，所以在浏览器的⽣命周期内，能够为所有的⻚⾯提供服务。
- 消息推送也是基于`Service Worker`来实现的。

## manifest.json

## 参考资料

[Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
