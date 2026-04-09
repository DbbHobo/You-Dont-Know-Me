# Fetch

`Fetch` API 提供了一个获取资源的接口（包括跨网络通信）。要中止未完成的 `fetch()`，甚至 `XMLHttpRequest` 操作，使用 `AbortController` 和 `AbortSignal` 接口。不支持原生的“上传进度”监控。

```js
// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json", // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data) // JSON data parsed by `data.json()` call
})
```

## Headers

`Fetch` API 的 `Headers` 接口允许你对 `HTTP` 请求和响应头执行各种操作。这些操作包括检索，设置，添加和删除。一个 `Headers` 对象具有关联的标头列表，它最初为空，由零个或多个键值对组成。你可以使用类似于 `append()` 这样的方法添加到这个对象中。

- `Headers.append()`

  给现有的 header 添加一个值，或者添加一个未存在的 header 并赋值。

- `Headers.delete()`

  从 Headers 对象中删除指定 header.

- `Headers.entries()`

  以迭代器的形式返回 Headers 对象中所有的键值对。

- `Headers.get()`

  以 ByteString 的形式从 Headers 对象中返回指定 header 的全部值。

- `Headers.has()`

  以布尔值的形式从 Headers 对象中返回是否存在指定的 header。

- `Headers.keys()`

  以迭代器的形式返回 Headers 对象中所有存在的 header 名。

- `Headers.set()`

  替换现有的 header 的值，或者添加一个未存在的 header 并赋值。

- `Headers.values()`

  以迭代器的形式返回 Headers 对象中所有存在的 header 的值。

## Request

`Fetch` API 的 Request 接口用来表示资源请求。你可以使用 `Request()` 构造函数创建一个新的 `Request` 对象，但是你更可能会遇到作为其他 API 操作结果返回的 `Request` 对象，比如 `service worker` 的 `FetchEvent.request`。

### Request 的实例属性

- `Request.body` 只读

  主体内容的 ReadableStream。

- `Request.bodyUsed` 只读

  存储 true 或 false，以指示请求是否仍然未被使用。

- `Request.cache` 只读

  包含请求的缓存模式（例如，default、reload、no-cache）。

- `Request.credentials` 只读

  包含请求的凭据（例如，omit、same-origin、include）。默认是 same-origin。

- `Request.destination` 只读

  返回一个描述请求的目的字符串。这是一个字符串，指示所请求的内容类型。

- `Request.headers` 只读

  包含请求相关联的 Headers 对象。

- `Request.integrity` 只读

  包含请求的子资源完整性值（例如 sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。

- `Request.method` 只读

  包含请求的方法（GET、POST 等）。

- `Request.mode` 只读

  包含请求的模式（例如，cors、no-cors、same-origin、navigate）。

- `Request.redirect` 只读

  包含如何处理重定向的模式。它可能是 follow、error 或 manual 之一。

- `Request.referrer` 只读

  包含请求的 referrer（例如，client）。

- `Request.referrerPolicy` 只读

  包含请求的 referrer 策略（例如，no-referrer）。

- `Request.signal` 只读

  返回与请求相关联的 AbortSignal。

- `Request.url` 只读

  包含请求的 URL。

### Request 的实例方法

- `Request.arrayBuffer()`

  返回 promise，其兑现值为请求主体的 ArrayBuffer 表示形式。

- `Request.blob()`

  返回 promise，其兑现值为请求主体的 Blob 表示形式。

- `Request.clone()`

  创建一个当前 Request 对象的副本。

- `Request.formData()`

  返回 promise，其兑现值为请求主体的 FormData 表示形式。

- `Request.json()`

  返回 promise，其兑现值为请求主体经过 JSON 解析的结果。

- `Request.text()`

  返回 promise，其兑现值为请求主体的文本表示形式。

## Response

`Fetch` API 的 `Response` 接口呈现了对一次请求的响应数据。

你可以使用 `Response.Response()` 构造函数来创建一个 `Response` 对象，但通常更可能遇到的情况是，其他的 API 操作返回了一个 `Response` 对象。例如一个 `service worker` 的 `Fetchevent.respondWith`，或者一个简单的 `fetch()`。

### Response 的实例属性

- `Response.headers` 只读

  包含此 Response 所关联的 Headers 对象。

- `Response.ok` 只读

  包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）。

- `Response.redirected` 只读

  表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。

- `Response.status` 只读

  包含 Response 的状态码（例如 200 表示成功）。

- `Response.statusText` 只读

  包含了与该 Response 状态码一致的状态信息（例如，OK 对应 200）。

- `Response.type` 只读

  包含 Response 的类型（例如，basic、cors）。

- `Response.url` 只读

  包含 Response 的 URL。

- `Response.useFinalURL`

  包含了一个布尔值，来标示这是否是该 Response 的最终 URL。

- `Response.body` 只读

  一个简单的 getter，用于暴露一个 ReadableStream 类型的 body 内容。

- `Response.bodyUsed` 只读

  包含了一个布尔值来标示该 Response 是否读取过 Body。

### Response 的静态方法

- `Response.clone()`

  创建一个 Response 对象的克隆。

- `Response.error()`

  返回一个绑定了网络错误的新的 Response 对象。

- `Response.redirect()`

  用另一个 URL 创建一个新的 Response。

### Response 的实例方法

- `arrayBuffer()`

并返回一个被解析为 ArrayBuffer 格式的 Promise 对象。

- `blob()`

  返回一个被解析为 Blob 格式的 Promise 对象。

- `formData()`

  返回一个被解析为 FormData 格式的 Promise 对象。

- `json()`

  返回一个被解析为 JSON 格式的 Promise 对象。

- `text()`

  返回一个被解析为 text 的 Promise 对象。

## 使用案例

```js
const controller = new AbortController()

const fetchButton = document.querySelector("#fetch")
fetchButton.addEventListener("click", async () => {
  try {
    console.log("Starting fetch")
    const response = await fetch("https://example.org/get", {
      signal: controller.signal,
    })
    console.log(`Response: ${response.status}`)
  } catch (e) {
    console.error(`Error: ${e}`)
  }
})

const cancelButton = document.querySelector("#cancel")
cancelButton.addEventListener("click", () => {
  controller.abort()
  console.log("Canceled fetch")
})
```

## 参考资料

[Fetch - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch)
