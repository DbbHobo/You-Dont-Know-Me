## URI

URI，是用来标识互联网上的资源（例如，网页或文件）和怎样访问这些资源的传输协议（例如，HTTP 或 FTP）的字符串。

除了`encodeURI()`、`encodeURIComponent()`、`decodeURI()`、`encodeURIComponent()`四个用来编码和解码 URI 的函数之外 ECMAScript 语言自身不提供任何使用 URL 的支持。

### encodeURI()

encodeURI()函数通过将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码 (该字符的 UTF-8 编码仅为四转义序列)由两个 "代理" 字符组成)。

### encodeURIComponent()

函数通过将一个，两个，三个或四个表示字符的 UTF-8 编码的转义序列替换某些字符的每个实例来编码 URI（对于由两个“代理”字符组成的字符而言，将仅是四个转义序列）。

### decodeURI()

decodeURI()函数能解码由encodeURI 创建或其它流程得到的统一资源标识符（URI）。

### encodeURIComponent()

decodeURIComponent()函数用于解码由 encodeURIComponent 方法或者其它类似方法编码的部分统一资源标识符（URI）。

`encodeURI()`、`encodeURIComponent()`的主要区别就是转码的范围不同，前者操作完整的URI，后者操作URI的部分。

If you want to encode characters such as `/ ? : @ & = + $ #` then you need to use encodeURIComponent().