# Web APIs

APIs in client-side JavaScript Client-side JavaScript, in particular, has many APIs available to it — these are not part of the JavaScript language itself, rather they are built on top of the core JavaScript language, providing you with extra superpowers to use in your JavaScript code. They generally fall into two categories:

1. Browser APIs are built into your web browser and are able to expose data from the browser and surrounding computer environment and do useful complex things with it. For example, the Web Audio API provides JavaScript constructs for manipulating audio in the browser — taking an audio track, altering its volume, applying effects to it, etc. In the background, the browser is actually using some complex lower-level code (e.g. C++ or Rust) to do the actual audio processing. But again, this complexity is abstracted away from you by the API.

2. Third-party APIs are not built into the browser by default, and you generally have to retrieve their code and information from somewhere on the Web. For example, the Google Maps API allows you to do things like display an interactive map to your office on your website. It provides a special set of constructs you can use to query the Google Maps service and return specific information.

- Graphics and Media APIs: Graphics APIs like Canvas and WebGL allow for rendering 2D and 3D graphics. Media APIs enable playing and manipulating audio and video content, such as the HTMLMediaElement interface and Web Audio API.
- Communication APIs: Facilitate communication between different parts of a web application or between applications. Examples include WebSockets and the Fetch API.
- Device APIs: Provide access to the capabilities of the user's device, like the camera, microphone, GPS. Examples include the Geolocation API, Media Capture and Streams API, and the Battery Status API.
- Storage APIs: Allow web applications to store data locally on the user's device. Examples include the Local Storage API and IndexedDB.
- Service Workers and Offline APIs: Enable applications to work offline and improve performance by caching resources. Service Workers can intercept network requests and deliver push messages.
- Performance APIs: Help in measuring and optimizing the performance of web applications. Examples include the Navigation Timing API and the Performance Observer API.

<!-- 【TODO】 -->
## IntersectionObserver API

### 构造函数

`IntersectionObserver()`

### 实例属性

`root`

`rootMargin`

`thresholds`

### 实例方法

`disconnect()`

`observe()`

`takeRecords()`

`unobserve()`

```js
const intersectionObserver = new IntersectionObserver((entries) => {
  // 如果 intersectionRatio 为 0，则目标在视野外，
  // 我们不需要做任何事情。
  if (entries[0].intersectionRatio <= 0) return;

  loadItems(10);
  console.log("Loaded new items");
});

// 开始监听
intersectionObserver.observe(document.querySelector(".scrollerFooter"));
```

## Fetch API

## Timers API

## Console API

## Geolocation API

## Web Storage API

## File API

## Performance API

## URL API

## HTML DOM

## 参考资料

[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

[The Web Platform: Browser technologies](https://html-now.github.io/)
