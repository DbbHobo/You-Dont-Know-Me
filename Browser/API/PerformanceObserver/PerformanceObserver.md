# PerformanceObserver

`PerformanceObserver` 是一个用于被动监听页面性能事件的 API，它可以捕获诸如资源加载、绘制时间、布局偏移等关键性能指标，而不会阻塞浏览器的主线程

```js
// 1. 创建观察者，并定义回调函数-当性能事件完成之后就会调用传入的回调
const observer = new PerformanceObserver((list, observer) => {
  // 获取本次回调收到的所有性能条目
  const entries = list.getEntries()

  entries.forEach((entry) => {
    // 根据不同的 entryType 处理数据
    if (entry.entryType === "mark") {
      console.log(`标记名: ${entry.name}, 开始时间: ${entry.startTime}`)
    }
    if (entry.entryType === "measure") {
      console.log(`测量名: ${entry.name}, 耗时: ${entry.duration}`)
    }
    // ... 处理其他类型
  })
})

// 2. 指定要观察的性能条目类型-可以观察多种类型
observer.observe({ entryTypes: ["mark", "measure", "resource"] })

// 或者只观察单一类型，并加上 buffered 参数来获取页面加载早期（观察者注册前）的数据
observer.observe({ type: "paint", buffered: true })
```

![browser](../../assets/PerformanceObserver.png)

## PerformanceObserver 的实例属性

- `supportedEntryTypes`

  The static supportedEntryTypes read-only property of the PerformanceObserver interface returns an array of the entryType values supported by the user agent.

  As the list of supported entries varies per browser and is evolving, this property allows web developers to check which are available.

```js
PerformanceObserver.supportedEntryTypes

// returns ["element", "event", "first-input", "largest-contentful-paint", "layout-shift", "long-animation-frame", "longtask", "mark", "measure", "navigation", "paint", "resource", "visibility-state"] in the main thread in Chrome 129
// returns ["mark", "measure", "resource"] in a worker thread in Chrome 129
```

## PerformanceObserver 的实例方法

- `disconnect()`
- `observe()`
- `takeRecords()`

## 使用案例

1. 测量核心 Web 指标 (Core Web Vitals)
2. 监控资源加载
3. 监听自定义性能标记

```js
// 监测最大内容绘制 (Largest Contentful Paint, LCP)：衡量页面主要内容的加载速度
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  // LCP 条目可能会持续更新，最后一个条目通常是最新的
  const lastEntry = entries[entries.length - 1]
  console.log("LCP 时间:", lastEntry.startTime)
  console.log("LCP 元素:", lastEntry.element)
})
lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

// 与下一次绘制的交互 (Interaction to Next Paint, INP)：衡量页面的整体响应性
const inpObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    const delay = entry.processingStart - entry.startTime // 输入延迟
    const duration = entry.duration // 事件总耗时
    console.log(`事件: ${entry.name}, 延迟: ${delay}, 总耗时: ${duration}`)
  }
})
// 注意: 类型是 'event'
inpObserver.observe({ type: "event", buffered: true, durationThreshold: 16 })
```

```js
// 可以监控页面中所有资源（如图片、CSS、JS、Fetch请求）的加载性能
const resourceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`资源: ${entry.name}`)
    console.log(`  耗时: ${entry.duration}ms`)
    console.log(`  传输大小: ${entry.transferSize} bytes`)
  })
})
resourceObserver.observe({ type: "resource", buffered: true })
```

```js
// 通过在代码中插入 performance.mark() 和 performance.measure()，可以自定义并监听业务代码的执行耗时
performance.mark("fetch-start")
await fetch("/api/data")
performance.mark("fetch-end")
performance.measure("fetch-duration", "fetch-start", "fetch-end")

// 观察并输出
const measureObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "measure") {
      console.log(`${entry.name}: ${entry.duration}ms`)
    }
  })
})
measureObserver.observe({ entryTypes: ["measure"] })
```

## 参考资料

[PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
