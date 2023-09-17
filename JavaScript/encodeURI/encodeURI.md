# URI

URI，是用来标识互联网上的资源（例如，网页或文件）和怎样访问这些资源的传输协议（例如，HTTP 或 FTP）的字符串。

除了 `encodeURI()`、`encodeURIComponent()`、`decodeURI()`、`encodeURIComponent()` 四个用来编码和解码 URI 的函数之外 ECMAScript 语言自身不提供任何使用 URL 的支持。

## encodeURI()

`encodeURI()` 函数通过将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码 (该字符的 `UTF-8` 编码仅为四转义序列)由两个 "代理" 字符组成)。`encodeURI` 使用 `UTF-8` 编码方式来对 `URI` 进行安全编码。

## encodeURIComponent()

`encodeURIComponent()` 函数通过将一个，两个，三个或四个表示字符的 `UTF-8` 编码的转义序列替换某些字符的每个实例来编码 URI（对于由两个“代理”字符组成的字符而言，将仅是四个转义序列）。`encodeURIComponent` 同样使用 `UTF-8` 编码方式来对 `URI` **查询字符串参数**进行安全编码。

## decodeURI()

`decodeURI()` 函数能解码由 `encodeURI()` 创建或其它流程得到的统一资源标识符（URI）。

## decodeURIComponent()

`decodeURIComponent()` 函数用于解码由 `encodeURIComponent()` 方法或者其它类似方法编码的部分统一资源标识符（URI）。

`encodeURI()`、`encodeURIComponent()`的主要区别就是转码的范围不同，前者操作完整的URI，后者操作URI的部分。

If you want to encode characters such as `/ ? : @ & = + $ #` then you need to use `encodeURIComponent()`.

## encodeURI() / encodeURIComponent() 区别

`encodeURI` 和 `encodeURIComponent` 是 `JavaScript` 中用于编码字符串的两个不同函数，它们的主要区别在于编码的范围和目的。

`encodeURI`：

- 用途：`encodeURI` 主要用于编码整个 URI（Uniform Resource Identifier），包括协议、域名、路径等。它不会编码用于分隔 URI 各个部分的特殊字符，如冒号（:）、斜杠（/）、问号（?）和井号（#）。
- 编码范围：`encodeURI` 保留了一些 URI 中的字符，以保持 URI 的完整性，只编码那些可能引起 URI 结构混淆的字符，如空格、逗号等。
- 示例：`encodeURI("https://www.example.com/page?param=hello world")` 会将空格编码为 `%20`，但不会编码其他特殊字符。

`encodeURIComponent`：

- 用途：`encodeURIComponent` 主要用于编码 URI 中的查询字符串参数部分。它会对所有特殊字符（包括冒号、斜杠、问号、井号等）进行编码，以确保参数不会干扰 URI 的结构。
- 编码范围：`encodeURIComponent` 对特殊字符和常见的非字母数字字符都进行编码。
- 示例：`encodeURIComponent("hello world!")` 会将空格编码为 `%20`，感叹号编码为 `%21`。

总结：

- 如果你需要编码整个 URI，包括协议、域名和路径等，应使用 `encodeURI`。
- 如果你需要编码 URI 中的查询字符串参数部分，应使用 `encodeURIComponent`，以确保所有特殊字符都得到正确编码。
- 在实际应用中，根据你的需求选择正确的编码函数非常重要，以确保 URI 或查询字符串参数的正确性和安全性。

## 编码方式

计算机中常见的编码方式有很多，它们用于将文本、数字、图像、音频和其他数据转换成二进制形式以便计算机处理。

我们知道，计算机内部，所有信息最终都是一个二进制值。每一个二进制位（bit）有0和1两种状态，因此八个二进制位就可以组合出256种状态，这被称为一个字节（byte）。也就是说，一个字节一共可以用来表示256种不同的状态，每一个状态对应一个符号，就是256个符号，从00000000到11111111。以下是一些常见的编码方式及其区别：

### ASCII编码

`ASCII` 是一种7位编码，最早用于表示英文字符，包括字母、数字、标点符号等。它只使用了128个不同的字符，采用了一个字节（8位）的存储空间，其中最高位通常未被使用。
由于 `ASCII` 仅支持英文字符，无法表示非拉丁字符，因此在全球化环境中有限制。

### Unicode编码

`Unicode` 是一种字符编码标准，支持世界上几乎所有的语言和符号。它使用16位或32位编码单个字符，以容纳更多字符。

`UTF-8`、`UTF-16`和`UTF-32`是 `Unicode` 的不同实现方式，它们用于**以不同的位数存储字符**，UTF-8最为常用，因为它能够节省存储空间，并支持ASCII兼容。

#### UTF-8编码（Unicode Transformation Format-8）

`UTF-8` 是一种可变长度编码，它可以**用1到4个字节表示一个字符**，根据字符的不同而变化。对于 `ASCII` 字符，它只使用一个字节，因此与 `ASCII` 兼容。

`UTF-8` 广泛用于互联网和计算机操作系统中，因为它支持多种语言，同时也能节省存储空间。

#### UTF-16编码

`UTF-16` 使**用16位或2个字节来表示大多数字符**，但对于一些辅助字符（如表情符号），它需要4个字节。它在处理某些字符时会占用更多的存储空间。

`UTF-16` 常用于Java和Windows操作系统中。

#### UTF-32编码

`UTF-32` 使用32位或4个字节来表示每个字符，无论字符的类型如何。它在存储空间方面相对较大，但在处理时更加简单和一致。

`UTF-32`适用于需要快速随机访问文本的应用程序。

总之，编码方式的选择取决于具体需求。如果只需要支持英文字符，`ASCII`足够了。如果需要支持多种语言和符号，`Unicode`是更好的选择。而在`Unicode`中，`UTF-8`通常是最常用的编码方式，因为它兼容`ASCII`，同时具有较小的存储开销。

## 参考资料

[字符编码笔记：ASCII，Unicode 和 UTF-8](https://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

[encodeURI-MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
