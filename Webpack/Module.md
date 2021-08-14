## Module（Loader） 配置

`module` 通过配置 `Loader` 来定义如何处理模块。`webpack` 只能理解 `JavaScript` 和 `JSON` 文件，这是 `webpack` 开箱可用的自带能力。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

### 配置 Loader

rules 配置模块的读取和解析规则，通常用来配置 Loader。其类型是一个数组，数组里每一项都描述了如何去处理部分文件。 配置一项 rules 时大致通过以下方式：

1. 条件匹配：通过 `test` 、 `include` 、 `exclude` 三个配置项来命中 `Loader` 要应用规则的文件。
2. 应用规则：对选中后的文件通过 use 配置项来应用 `Loader`，可以只应用一个 `Loader` 或者按照从后往前的顺序应用一组 `Loader`，同时还可以分别给 `Loader` 传入参数。
3. 重置顺序：一组 `Loader` 的执行顺序默认是**从右到左**执行，通过 `enforce` 选项可以让其中一个 `Loader` 的执行顺序放到最前或者最后。

### 常见 Loader

- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- svg-inline-loader：将压缩后的 SVG 内容注入代码中
- image-loader：加载并且压缩图片文件
- babel-loader：把 ES6 转换成 ES5
- sass-loader：将 SCSS/SASS 代码转换成 CSS
- css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
- eslint-loader：通过 ESLint 检查 JavaScript 代码
- vue-loader：加载 Vue.js 单文件组件

### 例子

```js
const path = require("path");

module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
      },
    ],
  },
};
```
