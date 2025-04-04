# URL

`URL API` 是 `URL` 标准的一个组成部分，该标准定义了有效的**统一资源定位符**（`URL`）以及用于访问和操作 `URL` 的 `API`。`URL` 标准还定义了诸如域（`domain`）、主机（`host`）和 `IP` 地址等概念。

`URL API` 用于解析、构造、规范化和编码 `URL`。它通过提供属性，使您能够轻松读取和修改 `URL` 的各个组成部分。

通常，可以在调用其构造函数时将 `URL` 作为字符串传入，或者提供一个相对 `URL` 和一个基础 `URL` 来创建新的 `URL` 对象。创建后，您可以轻松读取 `URL` 的解析组件或对其进行修改。

```js
let addr = new URL("https://developer.mozilla.org/en-US/docs/Web/API/URL_API")
let host = addr.host
let path = addr.pathname
```

## URL constructor

```js
new URL(url)
new URL(url, base)

// Base URLs:
let baseUrl = "https://developer.mozilla.org"

let A = new URL("/", baseUrl)
// => 'https://developer.mozilla.org/'

let B = new URL(baseUrl)
// => 'https://developer.mozilla.org/'

new URL("en-US/docs", B)
// => 'https://developer.mozilla.org/en-US/docs'

let D = new URL("/en-US/docs", B)
// => 'https://developer.mozilla.org/en-US/docs'

new URL("/en-US/docs", D)
// => 'https://developer.mozilla.org/en-US/docs'

new URL("/en-US/docs", A)
// => 'https://developer.mozilla.org/en-US/docs'

new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto")
// => 'https://developer.mozilla.org/en-US/docs'

if (URL.canParse("../cats", "http://www.example.com/dogs")) {
  const url = new URL("../cats", "http://www.example.com/dogs")
  console.log(url.hostname) // "www.example.com"
  console.log(url.pathname) // "/cats"

  url.hash = "tabby"
  console.log(url.href) // "http://www.example.com/cats#tabby"
} else {
  console.log("Invalid URL") //Invalid URL
}

const dataUrl = new URL("data:text/plain;base64,SGVsbG8gd29ybGQ=")
console.log(dataUrl.href) // 输出完整的 Data URL
console.log(dataUrl.protocol) // "data:"

const blobUrl = new URL("blob:https://example.com/12345678")
// ❌ 报错：TypeError: Failed to construct 'URL'

console.log(import.meta.url) // 例如 "file:///Users/.../script.js"

const assetUrl = new URL("./image.png", import.meta.url)
console.log(assetUrl.href) // 解析后的完整路径
```

- 解析 `Data URL`
  ✅ 直接用 `new URL("data:text/plain,...")`。

- 使用 `Blob URL`
  ❌ 不能用 `new URL()` 解析，必须用 `URL.createObjectURL(blob)` 生成。

- 解析相对路径（基于 Module URL）
  ✅ `new URL("./relative-path", import.meta.url)` 可以解析出完整路径。

### Data URL

`Data URL` 允许将数据直接嵌入到 `URL` 中，而不依赖外部资源。

```js
data:[<MIME-type>][;base64],<data>
```

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
```

```css
background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...");
```

### Blob URL

`Blob URL` 由 `Blob` 对象动态创建，通过 `URL.createObjectURL(blob)` 生成，用于引用二进制数据，支持引用大文件，如视频、音频、下载文件等。可以使用 `URL.revokeObjectURL(url)` 释放资源，以避免内存泄漏。

```js
blob:<origin>/<unique-id>
```

```js
const blob = new Blob(["Hello, Blob!"], { type: "text/plain" })
const blobURL = URL.createObjectURL(blob)

const link = document.createElement("a")
link.href = blobURL
link.download = "hello.txt"
link.textContent = "下载文件"
document.body.appendChild(link)

// 释放资源
setTimeout(() => URL.revokeObjectURL(blobURL), 5000)
```

### Module URL

`Module URL` 用于在 ES 模块 (ESM) 中获取当前模块的文件路径。它依赖于 `import.meta.url`，可以结合 `new URL()` 解析相对路径。在 `CommonJS` (`require()`) 中无法使用 `import.meta.url`，可以用于动态导入、Worker、资源路径解析等。

```js
// 获取当前模块路径
console.log(import.meta.url) // "file:///Users/.../script.js" 或 "http://example.com/script.js"

// 解析相对路径
const imageUrl = new URL("./image.png", import.meta.url)
console.log(imageUrl.href) // 解析后的完整 URL

// 在 Web Worker 中使用
const worker = new Worker(new URL("./worker.js", import.meta.url))
```

## URL 的静态方法

- `URL.canParse()`: 检查给定的字符串是否可以被解析为有效的 `URL`。
- `URL.createObjectURL()`: 为 `Blob` 或 `File` 对象创建一个临时的对象 URL。
- `URL.parse()`: （非标准方法）解析一个字符串并返回一个 `URL` 对象。
- `URL.revokeObjectURL()`: 释放通过 `createObjectURL()` 创建的对象 URL。

## URL 的实例属性

- `hash`: 返回或设置 URL 的片段标识符（以 `#` 开头的部分）。
- `host`: 返回或设置 URL 的主机名和端口号。
- `hostname`: 返回或设置 URL 的主机名（不包括端口号）。
- `href`: 返回或设置整个 URL。
- `origin`: 返回 URL 的源（协议、主机名和端口号的组合）。
- `password`: 返回或设置 URL 的密码部分。
- `pathname`: 返回或设置 URL 的路径部分。
- `port`: 返回或设置 URL 的端口号。
- `protocol`: 返回或设置 URL 的协议（以 `:` 结尾）。
- `search`: 返回或设置 URL 的查询字符串（以 `?` 开头的部分）。
- `searchParams`: 返回一个 `URLSearchParams` 对象，用于操作查询字符串中的参数。
- `username`: 返回或设置 URL 的用户名部分。

## URL 的实例方法

- `toJSON()`: 返回一个表示 URL 的 JSON 字符串。通常用于序列化 URL 对象。
- `toString()`: 返回一个表示 URL 的字符串。与 `href` 属性的值相同。

## 使用实例

## 参考资料

[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)

[Using the Resize Observer API with React](https://dev.to/darthknoppix/using-the-resize-observer-api-with-react-2f96)
