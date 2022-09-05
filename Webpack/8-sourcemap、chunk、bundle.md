# webpack中的一些其他常见概念

### sourcemap

### chunk

`Chunk`不同于`entry`、 `output`、`module`这样的概念，它们对应着`Webpack`配置对象中的一个字段，`Chunk`没有单独的配置字段。

`Chunk`在`Webpack`里指一个代码块，那具体是指什么样的代码块呢？

- Chunk VS Module

`Chunk`是`Webpack`打包过程中，一堆`module`的集合。我们知道`Webpack`的打包是从一个入口文件开始，也可以说是入口模块，入口模块引用这其他模块，模块再引用模块。Webpack通过引用关系逐个打包模块，这些`module`就形成了一个`Chunk`。

如果我们有多个入口文件，可能会产出多条打包路径，一条路径就会形成一个`Chunk`。出了入口`entry`会产生`Chunk`，还有两种途径。

- Chunk VS Bundle

通常我们会弄混这两个概念，以为`Chunk`就是`Bundle`，`Bundle`就是我们最终输出的一个或多个打包文件。确实，大多数情况下，一个`Chunk`会生产一个`Bundle`。但有时候也不完全是一对一的关系，比如我们把`devtool`配置成`'source-map'`。然后只有一个入口文件，也不配置代码分割：
```js
 // webpack配置
 entry: {
    main: __dirname + "/app/main.js",
 },
 output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "[name].js", //打包后输出文件的文件名
  },
 devtool: 'source-map',
```
这样的配置，会产生一个`Chunk`，但是会产生两个`bundle`。

注意到`Chunk Names`那列，只有main这么一个Chunk，再看Asset这一列，产生了两个bundle，还有一个.map文件。

这就是`Chunk`和`Bundle`的区别，**Chunk是过程中的代码块**，**Bundle是结果的代码块**。

查看Webpack源码，发现有一个Chunk.js，点进去看：
```js
/**
 * A Chunk is a unit of encapsulation for Modules.
 * Chunks are "rendered" into bundles that get emitted when the build completes.
 */
class Chunk {
}
```
里面有一个Chunk类，这说明类`Webpack`在运行中，会生成`Chunk`对象，也能证明`Chunk`是过程中的代码块。

`Chunk`类上面的两句注释：一个`Chunk`是一些模块的封装单元。`Chunk`在构建完成就呈现为`bundle`。

我们来分析一下，下面代码会产生几个Chunk，其中main.js文件和two.js文件，都引用了同一个greeter.js文件。main.js中使用了react。
```js
module.exports = {
  entry: {
    main: __dirname + "/app/main.js",
    other: __dirname + "/app/two.js",
  },
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "[name].js", //打包后输出文件的文件名
    chunkFilename: '[name].js',
  },

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }

      },
    }
  }
}
```
答案是5个，两个入口分别产生一个， `runtimeChunk: "single"`会将`Webpack`在浏览器端运行时需要的代码单独抽离到一个文件，`commons`下的配置会产生一个`Chunk`，`vendor`下的配置会产生一个`Chunk`。

### hash