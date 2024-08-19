# AbortController

`AbortController` 接口表示一个控制器对象，允许你根据需要中止一个或多个 `Web` 请求。

```js
// 发送者
const channel = new BroadcastChannel("example-channel");
const messageControl = document.querySelector("#message");
const broadcastMessageButton = document.querySelector("#broadcast-message");

broadcastMessageButton.addEventListener("click", () => {
  channel.postMessage(messageControl.value);
});

// 接收者 1
const channel = new BroadcastChannel("example-channel");
channel.addEventListener("message", (event) => {
  received.textContent = event.data;
});

// 接收者 2
const channel = new BroadcastChannel("example-channel");
channel.addEventListener("message", (event) => {
  received.textContent = event.data;
});
```

## AbortController的实例属性

- `signal`
  `AbortController` 接口的只读属性 `signal` 返回一个 `AbortSignal` 实例对象，该对象可以根据需要与异步操作通信或终止异步操作。

## AbortController的实例方法

- `abort()`

```js
const controller = new AbortController();
const signal = controller.signal;

const url = "video.mp4";
const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  controller.abort();
  console.log("Download aborted");
});

function fetchVideo() {
  fetch(url, { signal })
    .then((response) => {
      console.log("Download complete", response);
    })
    .catch((err) => {
      console.error(`Download error: ${err.message}`);
    });
}
```

## 参考资料

[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal)
