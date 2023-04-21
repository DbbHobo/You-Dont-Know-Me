# Module（Loader） 配置

`module` 通过配置 `Loader` 来定义如何处理模块。`webpack` 只能理解 `JavaScript` 和 `JSON` 文件，这是 `webpack` 开箱可用的自带能力。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

## 配置 Loader

`rules` 配置模块的读取和解析规则，通常用来配置 `Loader`。其类型是一个数组，数组里每一项都描述了如何去处理部分文件。 配置一项 `rules` 时大致通过以下方式：

1. 条件匹配：通过 `test` 、 `include` 、 `exclude` 三个配置项来命中 `Loader` 要应用规则的文件。
2. 应用规则：对选中后的文件通过 use 配置项来应用 `Loader`，可以只应用一个 `Loader` 或者按照从后往前的顺序应用一组 `Loader`，同时还可以分别给 `Loader` 传入参数。
3. 重置顺序：一组 `Loader` 的执行顺序默认是**从右到左**执行，通过 `enforce` 选项可以让其中一个 `Loader` 的执行顺序放到最前或者最后。

## 常见 Loader

- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试
- `svg-inline-loader`：将压缩后的 SVG 内容注入代码中
- `image-loader`：加载并且压缩图片文件
- `babel-loader`：把 ES6 转换成 ES5
- `sass-loader`：将 SCSS/SASS 代码转换成 CSS
- `css-loader`：加载 CSS，支持模块化、压缩、文件导入等特性
- `style-loader`：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码
- `vue-loader`：加载 Vue.js 单文件组件

### Loader 配置例子

```js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: "raw-loader",
      }
    ],
  },
};
```

## Loader开发

1. 开发
由于 `Webpack` 是运行在 `Node.js` 之上的，一个 `Loader` 其实就是一个 `Node.js` 模块，这个模块需要导出一个函数。这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。

一个最简单的 `Loader` 的源码如下：
```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

2. 本地调试
因为你需要确保编写的 `Loader` 的源码是在 `node_modules` 目录下。 为此你需要先把编写的 `Loader` 发布到 `Npm` 仓库后再安装到本地项目使用。解决以上问题的便捷方法有两种，分别如下：

- Npm link
`Npm link` 专门用于开发和调试本地 `Npm` 模块，能做到在不发布模块的情况下，把本地的一个正在开发的模块的源码链接到项目的 `node_modules` 目录下，让项目可以直接使用本地的 `Npm` 模块。 由于是通过软链接的方式实现的，编辑了本地的 `Npm` 模块代码，在项目中也能使用到编辑后的代码。

完成 `Npm link` 的步骤如下：

确保正在开发的本地 `Npm` 模块（也就是正在开发的 `Loader`）的 `package.json` 已经正确配置好；

在本地 `Npm` 模块根目录下执行 `npm link`，把本地模块注册到全局；

在项目根目录下执行 `npm link loader-name`，把第2步注册到全局的本地 `Npm` 模块链接到项目的 `node_moduels` 下，其中的 loader-name 是指在第1步中的 `package.json` 文件中配置的模块名称。

链接好 `Loader` 到项目后你就可以像使用一个真正的 `Npm` 模块一样使用本地的 `Loader` 了。

- resolveLoader
`resolveLoader` 用于配置 `Webpack` 如何寻找 `Loader`。 默认情况下只会去 `node_modules` 目录下寻找，为了让 `Webpack` 加载放在本地项目中的 `Loader` 需要修改 `resolveLoader.modules`。

假如本地的 `Loader` 在项目目录中的 `./loaders/loader-name` 中，则需要如下配置：
```js
module.exports = {
  resolveLoader:{
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules','./loaders/'],
  }
}
```
加上以上配置后， `Webpack` 会先去 `node_modules` 项目下寻找 `Loader`，如果找不到，会再去 `./loaders/` 目录下寻找。

3. 发布到npm

- 首先在`npmjs.com`注册一个`npm`账号，邮箱验证。
- 执行 `npm login` 进行登录
- 执行 `npm publish` 进行发布

[深入浅出 webpack](http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-4%E7%BC%96%E5%86%99Plugin.html)