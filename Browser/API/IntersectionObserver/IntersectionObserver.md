# IntersectionObserver

`IntersectionObserver` 接口提供了一种异步观察目标元素与其祖先元素或顶级文档视口（viewport）交叉状态的方法。其祖先元素或视口被称为根（root）。

`IntersectionObserver`则可以观察元素和浏览器视窗相交的情况。

```js
const observer = new IntersectionObserver(callback[, options])

const callback = (entries, observer) => {
  entries.forEach(entry => {
    // Do something with the intersection entry
  })
}

const target = document.querySelector('#target')

observer.observe(target,{
  root: null, // 默认是浏览器视口
  rootMargin: '0px',
  threshold: 0.1 // 当至少10%的图片进入视口时触发回调
})
```

## IntersectionObserver 的实例属性

- `root`

  用于检查可见性的祖先元素。默认情况下，它被设置为浏览器视口。

- `rootMargin`

  一个字符串，指定 root 周围的边距。它允许你扩展或缩小 root 的有效边界框，用来扩展或缩小视口的边界。

- `thresholds`

  一个介于 0 和 1 之间的数字或数字数组，表示目标可见性的百分比，在该百分比下应该触发回调函数。

## IntersectionObserver 的实例方法

- `disconnect()`
- `observe()`
- `takeRecords()`
- `unobserve()`

## 使用案例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IntersectionObserver Example</title>
    <style>
      .image-container {
        height: 200px;
        margin-bottom: 20px;
        background-color: #f3f3f3;
      }
      .lazy-image {
        width: 100%;
        height: 100%;
        display: block;
        opacity: 0;
        transition: opacity 0.5s;
      }
      .loaded {
        opacity: 1;
      }
    </style>
  </head>
  <body>
    <div class="image-container">
      <img
        data-src="https://via.placeholder.com/400"
        class="lazy-image"
        alt="Lazy Loaded Image"
      />
    </div>
    <div class="image-container">
      <img
        data-src="https://via.placeholder.com/400"
        class="lazy-image"
        alt="Lazy Loaded Image"
      />
    </div>
    <!-- More image containers as needed -->
    <script src="script.js"></script>
  </body>
</html>
```

```js
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll(".lazy-image")

  const options = {
    root: null, // 默认是浏览器视口
    rootMargin: "0px",
    threshold: 0.1, // 当至少10%的图片进入视口时触发回调
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.getAttribute("data-src")
        img.onload = () => {
          img.classList.add("loaded")
        }
        observer.unobserve(img) // 加载完成后停止观察
      }
    })
  }, options)

  lazyImages.forEach((image) => {
    imageObserver.observe(image)
  })
})
```

可能可以使用的场景如下：

- 懒加载图片或其他内容，随着用户滚动加载：随着用户滚动页面，懒加载图片或其他内容。
- 当元素进入视口时触发动画：当元素进入视口时，触发相应的动画效果。
- 实现无限滚动或分页：实现无限滚动或分页功能，加载更多内容以供用户浏览。
- 跟踪用户参与度和分析：跟踪用户的参与度和行为数据，以进行分析。

## 参考资料

[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)

[Get more comfortable with IntersectionObserver 🚦👀](https://dev.to/mattlewandowski93/get-more-comfortable-with-intersectionobserver-3i8k?context=digest)
