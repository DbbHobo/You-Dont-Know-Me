# BroadcastChannel

`BroadcastChannel` 接口代理了一个命名频道，可以让指定 `origin` 下的任意 `browsing context` 来订阅它。它允许同源的不同浏览器窗口，`Tab` 页，`frame` 或者 `iframe` 下的不同文档之间相互通信。通过触发一个 `message` 事件，消息可以广播到所有监听了该频道的 `BroadcastChannel` 对象。

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

## BroadcastChannel的实例属性

- `name`
  是频道的唯一标识。属性 `name` 是在创建时传入 `BroadcastChannel()` 构造函数的，所以是只读的。

## BroadcastChannel的实例方法

- `close()`

```js
// 连接到指定频道
var bc = new BroadcastChannel("test_channel");

// 其他操作 (如：postMessage, …)

// 当完成后，断开与频道的连接
bc.close();
```

- `postMessage()`

## 使用案例

```js
// 监听主题变化
channel.onmessage = (event) => {
  if (event.data.type === 'THEME_CHANGE') {
    document.body.className = event.data.theme;
  }
};

// 改变主题并传信
function changeTheme(theme) {
  document.body.className = theme;
  channel.postMessage({ type: 'THEME_CHANGE', theme });
}

// 调用
changeTheme('dark-mode');
```

## 参考资料

[BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
