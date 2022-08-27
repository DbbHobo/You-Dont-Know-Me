function memorize(f) {
  const cache = {};
  return function () {
    const key = Array.prototype.join.call(arguments, ",");
    if (key in cache) {
      return cache[key];
    } else {
      return (cache[key] = f.apply(this, arguments));
    }
  };
}

const factorial = memorize((n) => {
  return n <= 1 ? 1 : n * factorial(n - 1);
});

// 监听主线程发过来的消息
self.addEventListener(
  "message",
  function (e) {
    // 响应主线程
    console.log("接收来自 Worker.html 的消息", e);
    self.postMessage(factorial(e.data));
  },
  false
);
