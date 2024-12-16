# AbortController

`AbortController` 接口表示一个控制器对象，允许你根据需要中止一个或多个 `Web` 请求。

```js
let controller;
const url = "video.mp4";

const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  if (controller) {
    controller.abort();
    console.log("Download aborted");
  }
});

async function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(url, { signal });
    console.log("Download complete", response);
    // process response further
  } catch (err) {
    console.error(`Download error: ${err.message}`);
  }
}
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

## 使用案例

同时销毁多个事件监听：

```js
useEffect(() => {
  const controller = new AbortController()

  window.addEventListener('resize', handleResize, {
    signal: controller.signal,
  })
  window.addEventListener('hashchange', handleHashChange, {
    signal: controller.signal,
  })
  window.addEventListener('storage', handleStorageChange, {
    signal: controller.signal,
  })

  return () => {
    // Calling `.abort()` removes ALL event listeners
    // associated with `controller.signal`. Gone!
    controller.abort()
  }
}, [])
```

取消流操作：

```js
const stream = new WritableStream({
  write(chunk, controller) {
    controller.signal.addEventListener('abort', () => {
      // Handle stream abort here.
    })
  },
})

const writer = stream.getWriter()
await writer.abort()
```

## 参考资料

[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal)

[Don't Sleep on AbortController](https://kettanaito.com/blog/dont-sleep-on-abort-controller)
