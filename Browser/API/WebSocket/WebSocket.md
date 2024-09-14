# WebSocket

`WebSocket` 对象提供了用于创建和管理 `WebSocket` 连接，以及可以通过该连接发送和接收数据的 API。并且 `WebSocket` 对象继承自 `EventTarget` 对象，因此可以对 `WebSocket` 对象调用 `addEventListener()` 方法。

![browser](../../assets/WebSocket.png)

```js
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Change binary type from "blob" to "arraybuffer"
socket.binaryType = "arraybuffer";

// Listen for messages
socket.addEventListener("message", (event) => {
  if (event.data instanceof ArrayBuffer) {
    // binary frame
    const view = new DataView(event.data);
    console.log("Message from server ",view.getInt32(0));
  } else {
    // text frame
    console.log(event.data);
  }
});
```

## WebSocket 的实例属性

- `binaryType`
- `bufferedAmount`
- `extensions`
- `protocol`
- `readyState`
- `url`

## WebSocket 的实例方法

- `close()`
- `send()`

## 使用案例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat</title>
    <style>
        #chat {
            border: 1px solid #ccc;
            padding: 10px;
            height: 300px;
            overflow-y: scroll;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <h1>WebSocket Chat</h1>
    <div id="chat"></div>
    <input type="text" id="message" placeholder="Type a message" />
    <button onclick="sendMessage()">Send</button>

    <script>
        // 创建 WebSocket 连接
        const socket = new WebSocket('ws://localhost:8080');

        // 获取聊天框和消息输入框元素
        const chatBox = document.getElementById('chat');
        const messageInput = document.getElementById('message');

        // 监听服务器消息并将其显示在聊天框中
        socket.onmessage = function(event) {
            const message = document.createElement('div');
            message.textContent = event.data;
            chatBox.appendChild(message);
            chatBox.scrollTop = chatBox.scrollHeight;  // 自动滚动到底部
        };

        // 发送消息到服务器
        function sendMessage() {
            const message = messageInput.value;
            socket.send(message);
            messageInput.value = '';  // 清空输入框
        }

        // 监听 WebSocket 连接关闭
        socket.onclose = function(event) {
            console.log('WebSocket connection closed');
        };
    </script>
</body>
</html>
```

## 参考资料

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
