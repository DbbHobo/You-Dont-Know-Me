## HTTP

## HTTP 基础

最开始，HTTP 是一种不保存状态， 即无状态（stateless） 协议。 HTTP 协议自身不对请求和响应之间的通信状态进行保存。 也就是说在 HTTP 这个级别， 协议对于发送过的请求或响应都不做持久化处理。

URI 用字符串标识某一互联网资源， 而 URL 表示资源的地点（互联网上所处的位置） 。 可见 URL 是 URI 的子集。HTTP 协议使用 URI 定位互联网上的资源。 正是因为 URI 的特定功能， 在互联网上任意位置的资源都能访问到。

HTTP 协议的初始版本中， 每进行一次 HTTP 通信就要断开一次 TCP 连接。

为解决上述 TCP 连接的问题， HTTP/1.1 和一部分的 HTTP/1.0 想出了持久连接（ HTTP Persistent Connections， 也称为 HTTP keep-alive 或 HTTP connection reuse） 的方法。 持久连接的特点是， 只要任意一端没有明确提出断开连接， 则保持 TCP 连接状态。

在 HTTP/1.1 中， 所有的连接默认都是持久连接， 但在 HTTP/1.0 内并未标准化。

持久连接使得多数请求以管线化（ pipelining） 方式发送成为可能。 从前发送请求后需等待并收到响应， 才能发送下一个请求。 管线化技术出现后， 不用等待响应亦可直接发送下一个请求。这样就能够做到同时并行发送多个请求， 而不需要一个接一个地等待响应了。

## HTTP 特点

HTTP 的特点概括如下:

- 灵活可扩展，主要体现在两个方面。一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。
- 可靠传输。HTTP 基于 TCP/IP，因此是可靠传输。
- 请求-应答。也就是一发一收、有来有回， 当然这个请求方和应答方不单单指客户端和服务器之间，如果某台服务器作为代理来连接后端的服务端，那么这台服务器也会扮演请求方的角色。
- 无状态。这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息。

## HTTP1.0 缺点

- 无状态

所谓的优点和缺点还是要分场景来看的，对于 HTTP 而言，最具争议的地方在于它的无状态。在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。

- 明文传输

即协议里的报文(主要指的是头部)不使用二进制数据，而是文本形式。这当然对于调试提供了便利，但同时也让 HTTP 的报文信息暴露给了外界，给攻击者也提供了便利。WIFI 陷阱就是利用 HTTP 明文传输的缺点，诱导你连上热点，然后疯狂抓你所有的流量，从而拿到你的敏感信息。

- HTTP 队头阻塞问题

当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的队头阻塞问题。

## HTTP/1.1 有哪些改进？

HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，但值得注意的是，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理。这就是著名的 HTTP 队头阻塞问题。

- 并发连接

对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。在 RFC2616 规定过客户端最多并发 2 个连接，不过事实上在现在的浏览器标准中，这个上限要多很多，Chrome 中是 6 个。但其实，即使是提高了并发连接，还是不能满足人们对性能的需求。

- 域名分片

一个域名不是可以并发 6 个长连接吗？那我就多分几个域名。比如 content1.test.com 、content2.test.com。这样一个 test.com 域名下可以分出非常多的二级域名，而它们都指向同样的一台服务器，能够并发的长连接数更多了，事实上也更好地解决了队头阻塞的问题。

## HTTP/2 有哪些改进？

- 头部压缩

在 HTTP/1.1 及之前的时代，请求体一般会有响应的压缩编码过程，通过 Content-Encoding 头部字段来指定，但你有没有想过头部字段本身的压缩呢？当请求字段非常复杂的时候，尤其对于 GET 请求，请求报文几乎全是请求头，这个时候还是存在非常大的优化空间的。HTTP/2 针对头部字段，也采用了对应的压缩算法——HPACK，对请求头进行压缩。

HPACK 算法是专门为 HTTP/2 服务的，它主要的亮点有两个：

首先是在服务器和客户端之间建立哈希表，将用到的字段存放在这张表中，那么在传输的时候对于之前出现过的值，只需要把索引(比如 0，1，2，...)传给对方即可，对方拿到索引查表就行了。这种传索引的方式，可以说让请求头字段得到极大程度的精简和复用。

其次是对于整数和字符串进行哈夫曼编码，哈夫曼编码的原理就是先将所有出现的字符建立一张索引表，然后让出现次数多的字符对应的索引尽可能短，传输的时候也是传输这样的索引序列，可以达到非常高的压缩率

- 多路复用

HTTP 队头阻塞的问题，其根本原因在于 HTTP 基于**请求-响应**的模型，在同一个 TCP 长连接中，前面的请求没有得到响应，后面的请求就会被阻塞。

HTTP/2 便从 HTTP 协议本身解决了队头阻塞问题。注意，这里并不是指的 TCP 队头阻塞，而是 HTTP 队头阻塞，两者并不是一回事。TCP 的队头阻塞是在数据包层面，单位是数据包，前一个报文没有收到便不会将后面收到的报文上传给 HTTP，而 HTTP 的队头阻塞是在 HTTP 请求-响应层面，前一个请求没处理完，后面的请求就要阻塞住。两者所在的层次不一样。

HTTP/2 认为明文传输对机器而言太麻烦了，不方便计算机的解析，因为对于文本而言会有多义性的字符，比如回车换行到底是内容还是分隔符，在内部需要用到状态机去识别，效率比较低。于是 HTTP/2 干脆把报文全部换成**二进制**格式，全部传输 01 串，方便了机器的解析。

原来 Headers + Body 的报文格式如今被拆分成了一个个二进制的帧，用 Headers 帧存放头部字段，Data 帧存放请求体数据。分帧之后，服务器看到的不再是一个个完整的 HTTP 请求报文，而是一堆**乱序的二进制帧**。这些二进制帧不存在先后关系，因此也就不会排队等待，也就没有了 HTTP 的队头阻塞问题。

通信双方都可以给对方发送**二进制帧**，这种二进制帧的**双向传输**的序列，也叫做流(Stream)。HTTP/2 用**流**来在一个 TCP 连接上来进行多个数据帧的通信，这就是**多路复用**的概念。

1. 设置请求优先级
2. 服务器推送

在 HTTP/2 当中，服务器已经不再是完全被动地接收请求，响应请求，它也能新建 stream 来给客户端发送消息，当 TCP 连接建立之后，比如浏览器请求一个 HTML 文件，服务器就可以在返回 HTML 的基础上，将 HTML 中引用到的其他资源文件一起返回给客户端，减少客户端的等待。
