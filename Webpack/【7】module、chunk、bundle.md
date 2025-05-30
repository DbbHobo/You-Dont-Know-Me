# webpack 中的一些常见概念

`Module`: Discrete chunks of functionality that provide a smaller surface area than a full program. Well-written modules provide solid abstractions and encapsulation boundaries which make up a coherent design and clear purpose.

`Chunk`: This webpack-specific term is used internally to manage the bundling process. Bundles are composed out of chunks, of which there are several types (e.g. entry and child). Typically, chunks directly correspond with the output bundles however, there are some configurations that don't yield a one-to-one relationship.

`Bundle`: Produced from a number of distinct modules, bundles contain the final versions of source files that have already undergone the loading and compilation process.

a chunk is a group of modules within the webpack process, a bundle is an emitted chunk or set of chunks.

## module

模块是 Web 应用程序的最小构建单元。在`Webpack`中，模块可以是`JavaScript`文件、`CSS`文件、图片文件、`JSON`文件等。每个模块可以依赖于其他模块，这些依赖关系被`Webpack`解析并构建出模块依赖图。`Webpack` 支持为转换生成的代码输出对应的 `Source Map` 文件，以方便在浏览器中能通过源码调试。 控制 `Source Map` 输出的 `Webpack` 配置项是 `devtool`，它有很多选项。

## chunk

`chunk`是一个 `Webpack` 中的术语。`chunk` 不同于 `entry`、 `output`、`module`这样的概念，它们对应着 `Webpack` 配置对象中的一个字段，`chunk`没有单独的配置字段。`chunk`在`Webpack`里指一个代码块。

`chunk` 是 `Webpack` 打包过程中，一堆 `module` 打包结果的集合。我们知道 `Webpack` 的打包是从一个入口文件开始，也可以说是入口模块，入口模块引用这其他模块，模块再引用模块。`Webpack` 通过引用关系逐个打包模块，这些 `module` 打包之后就形成了一个`chunk`。

如果我们有多个入口文件，可能会产出多条打包路径，一条路径就会形成一个 `chunk`。

- `Entry Chunk`：主入口生成的 Chunk（如 main.js）
- `Async Chunk`：懒加载（如 import()）时拆分出来的块
- `Vendor Chunk`：提取的第三方库（如 React、lodash）

`Webpack` 源码里面有一个 `chunk` 类，这说明类`Webpack`在运行中，会生成`chunk`对象，也能证明`chunk`是过程中的代码块。`chunk` 类上面的有两句注释：`chunk`是一些模块的封装单元。`chunk`在构建完成就呈现为`bundle`。

```js
/**
 * A Chunk is a unit of encapsulation for Modules.
 * Chunks are "rendered" into bundles that get emitted when the build completes.
 */
class chunk {}
```

来分析一下，下面代码会产生几个 `chunk`，其中 `main.js` 文件和 `two.js` 文件，都引用了同一个 `greeter.js` 文件。`main.js` 中使用了 `react`。

```js
module.exports = {
  entry: {
    main: __dirname + "/app/main.js",
    other: __dirname + "/app/two.js",
  },
  output: {
    path: __dirname + "/public", //打包后的文件存放的地方
    filename: "[name].js", //打包后输出文件的文件名
    chunkFilename: "[name].js",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true,
        },
      },
    },
  },
}
```

答案是 5 个，两个入口分别产生一个， `runtimeChunk: "single"`会将`Webpack`在浏览器端运行时需要的代码单独抽离到一个文件，`commons`下的配置会产生一个`chunk`，`vendor`下的配置会产生一个`chunk`。

## bundle

`Bundle`是`Webpack`最终输出的文件。每个`bundle`通常对应于一个或多个`chunk`。这些`bundle`是可以直接被浏览器加载的文件，通常是`JavaScript`、`CSS`或其他资源文件。`Chunk` 经过优化（如压缩、添加 Hash）后，输出为 `Bundle`。

通常我们会弄混 `chunk` 和 `bundle`，以为`chunk`就是`bundle`，`bundle`就是我们最终输出的一个或多个打包文件。确实，大多数情况下，一个`chunk`会生产一个`bundle`。但有时候也不完全是一对一的关系，比如我们把`devtool`配置成`'source-map'`。然后只有一个入口文件，也不配置代码分割：

```js
 entry: {
    main: __dirname + "/app/main.js",
 },
 output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "[name].js", //打包后输出文件的文件名
  },
 devtool: 'source-map',
```

这样的配置，会产生一个`chunk`，但是会产生两个`bundle`。注意到`Chunk Names`那列，只有 `main` 这么一个 `chunk`，再看 `Asset` 这一列，产生了两个 `bundle`，还有一个 `.map` 文件。这就是`chunk`和`bundle`的区别，**Chunk 是过程中的代码块**，**Bundle 是结果的代码块**。

## 参考资料

[What are module, chunk and bundle in webpack?](https://stackoverflow.com/questions/42523436/what-are-module-chunk-and-bundle-in-webpack)

[Day 8 of #100DaysOfCode: The relationship between bundle, chunk, and modules for Webpack?](https://dev.to/jenhsuan/day-8-of-100daysofcode-the-relationship-between-bundle-chunk-and-modules-for-webpack-3hni)
