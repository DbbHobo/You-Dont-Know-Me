# Plugin

## Plugin 的使用
`Webpack` 是通过 `plugins` 属性来配置需要使用的插件列表的。 `plugins` 属性是一个**数组**，里面的每一项都是插件的一个实例，在实例化一个组件时可以通过构造函数传入这个组件支持的配置属性。

`Plugin` 的配置很简单，`plugins` 配置项接受一个数组，数组里每一项都是一个要使用的 `Plugin` 的实例，`Plugin` 需要的参数通过构造函数传入。

```js
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  plugins: [
    // 所有页面都会用到的公共代码提取到 common 代码块中
    new CommonsChunkPlugin({
      name: "common",
      chunks: ["a", "b"],
    }),
  ],
};
```

使用 `Plugin` 的难点在于掌握 `Plugin` 本身提供的配置项，而不是如何在 `Webpack` 中接入 `Plugin`。

## Plugin 原理
`Webpack` 通过 `Plugin` 机制让其更加灵活，以适应各种应用场景。 在 `Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 `API` 改变输出结果。

一个最基础的 `Plugin` 类的代码是这样的，它包含了构造函数，还有一个 `apply` 方法：

```js
class BasicPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象，compiler 对象注册各个广播事件的回调
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('The webpack build process is starting!');
    });
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

在使用这个 `Plugin` 时，相关配置代码如下：

```js
const BasicPlugin = require("./BasicPlugin.js");
module.export = {
  plugins: [new BasicPlugin(options)],
};
```

`Webpack` 启动后，在读取配置的过程中会先执行 `new BasicPlugin(options)` 初始化一个 `BasicPlugin` 实例。 在初始化 `compiler` 对象后，再调用 `basicPlugin.apply(compiler) `给插件实例传入 `compiler` 对象。 插件实例在获取到 `compiler` 对象后，就可以通过 `compiler.plugin(事件名称, 回调函数)` 监听到 `Webpack` 广播出来的事件。 并且可以通过 `compiler` 对象去操作 `Webpack`。

`Webpack` 通过 `Tapable` 来组织这条复杂的生产线。 `Webpack` 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 `Webpack` 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。`Webpack` 的事件流机制应用了**观察者模式**，和 `Node.js` 中的 `EventEmitter` 非常相似。 `Compiler` 和 `Compilation` 都继承自 `Tapable`，可以直接在 `Compiler` 和 `Compilation` 对象上**广播**和**监听**事件。

在开发 `Plugin` 时最常用的两个对象就是 `Compiler` 和 `Compilation`，它们是 `Plugin` 和 `Webpack` 之间的桥梁。 `Compiler` 和 `Compilation` 的含义如下：
- `Compiler` 对象包含了 `Webpack` 环境所有的的配置信息，包含 `options`，`loaders`，`plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是**全局唯一**的，可以简单地把它理解为 `Webpack` 实例；
- `Compilation` 对象包含了当前的**模块资源、编译生成资源、变化的文件**等。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建。`Compilation` 对象也提供了很多事件回调供插件做扩展。通过 `Compilation` 也能读取到 `Compiler` 对象。
- `Compiler` 和 `Compilation` 的区别在于：**`Compiler` 代表了整个 `Webpack` 从启动到关闭的生命周期，而 `Compilation` 只是代表了一次新的编译**。

```js
/**
* 广播出事件
* event-name 为事件名称，注意不要和现有的事件重名
* params 为附带的参数
*/
compiler.apply('event-name',params);

/**
* 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
* 同时函数中的 params 参数为广播事件时附带的参数。
*/
compiler.plugin('event-name',function(params) {

});
```
同理，`compilation.apply` 和 `compilation.plugin` 使用方法和上面一致。

## Plugin 开发和调试
在项目的开发过程中，为了方便资源的共享，创建了 `npm` 私有包。在开发私有包的时候，频繁的发版上线很繁琐，如何在本地项目直接访问 `npm` 私有包。进入 `npmPackage`, 执行下面代码：

```shell
npm link <packageName>
```

执行该命令后，`npmPackage` 会根据 `package.json` 中的配置链接到全局, `{prefix}/lib/node_modules/<packageName>` 可以理解为一个快捷方式。进入本地项目,连接到 `npmPackage` 的名字，取自 `package.json` 中的 `name` 字段，导入私有包：

```js
import sth from <packageName>
```

使用 `npmPackage`,当修改 `npmPackage` 中的代码，就能实时同步到本地项目的响应。最后，如果要取消链接：

```shell
npm unlink <packageName>
```

## 常用广播事件钩子
插件可以用来修改输出文件、增加输出文件、甚至可以提升 `Webpack` 性能等等，总之插件通过调用 `Webpack` 提供的钩子能完成很多事情。除了 `compiler` 和 `compilation` 对象会提供钩子以外，还有`ContextModuleFactory Hooks`、`JavascriptParser Hooks`、`NormalModuleFactory Hooks`等等。 由于 `Webpack` 提供的钩子非常多，有很多钩子很少用的上，下面来介绍一些常用的广播事件钩子，这些广播事件钩子也代表了 `Webpack` 的工作流程：

### compiler 钩子
```js
compiler.hooks.someHook.tap('MyPlugin', (params) => {
  /* ... */
});
```

- `environment`
  
  在编译器准备环境时调用，时机就在配置文件中初始化插件之后。

- `entryOption`

  在 `webpack` 选项中的 `entry` 被处理过之后调用。回调参数：`context`, `entry`。
```js
compiler.hooks.entryOption.tap('MyPlugin', (context, entry) => {
  /* ... */
});
```
- `afterPlugins`
  
  在初始化内部插件集合完成设置之后调用。回调参数：`compiler`。

- `initialize`
  
  当编译器对象被初始化时调用。

- `beforeRun`
  在开始执行一次构建之前调用，`compiler.run` 方法开始执行后立刻进行调用。回调参数：`compiler`。

- `run`
  在开始读取 `records` 之前调用。回调参数：`compiler`。

- `watchRun`
  
  在监听模式下，一个新的 `compilation` 触发之后，但在 `compilation` 实际开始之前执行。回调参数：`compiler`。

- `beforeCompile`
  
  在创建 `compilation parameter` 之后 `compilation` 创建之前执行。回调参数：`compilationParams`。

  初始化 `compilationParams` 变量的示例如下：
```json
compilationParams = {
  normalModuleFactory,
  contextModuleFactory,
};
```
  此钩子可用于添加/修改 `compilation parameter`：
```js
compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
  params['MyPlugin - data'] = 'important stuff my plugin will use later';
  callback();
});
```
- `compile`
  
  `beforeCompile` 之后立即调用，但在一个新的 `compilation` 创建之前。这个钩子不会被复制到子编译器。回调参数：`compilationParams`。

- `thisCompilation`
  初始化 `compilation` 时调用，在触发 `compilation` 事件之前调用。这个钩子不会被复制到子编译器。回调参数：`compilation`, `compilationParams`。

- `compilation`
  
  `compilation` 创建之后执行。回调参数：`compilation`, `compilationParams`。

- `make`
  `compilation` 结束之前执行。这个钩子不会被复制到子编译器。回调参数：`compilation`。

- `afterCompile`
  
  `compilation` 结束和封印之后执行。回调参数：`compilation`。

- `shouldEmit`

在输出 `asset` 之前调用。返回一个布尔值，告知**是否输出**。回调参数：`compilation`。
```js
compiler.hooks.shouldEmit.tap('MyPlugin', (compilation) => {
  // 返回 true 以输出 output 结果，否则返回 false
  return true;
});
```

- `emit`

输出 `asset` 到 `output` 目录**之前**执行。这个钩子不会被复制到子编译器。回调参数：`compilation`。

- `afterEmit`

输出 `asset` 到 `output` 目录**之后**执行。这个钩子不会被复制到子编译器。回调参数：`compilation`。

### compilation 钩子
```js
compilation.hooks.someHook.tap(/* ... */);
```

- `buildModule`
  
  在模块构建开始之前触发，可以用来修改模块。回调参数：`module`。
```js
compilation.hooks.buildModule.tap(
  'SourceMapDevToolModuleOptionsPlugin',
  (module) => {
    module.useSourceMap = true;
  }
);
```

其余常用钩子可查询[官方文档](https://webpack.docschina.org/api/compilation-hooks/)

## Plugin常见开发示例
1. 读取输出资源、代码块、模块及其依赖 - `emit`

有些插件可能需要读取 `Webpack` 的处理结果，例如输出资源、代码块、模块及其依赖，以便做下一步处理。

**在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。** 插件代码如下：
```js
class Plugin {
  apply(compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function (chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function (module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function (filepath) {
          });
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    })
  }
}
```

2. 监听文件变化 - `watch-run`
`Webpack` 会从配置的入口模块出发，依次找出所有的依赖模块，当入口模块或者其依赖的模块发生变化时， 就会触发一次新的 `Compilation`。

在开发插件时经常需要知道是哪个文件发生变化导致了新的 `Compilation`，为此可以使用如下代码：

```js
// 当依赖的文件发生变化时会触发 watch-run 事件
compiler.plugin('watch-run', (watching, callback) => {
    // 获取发生变化的文件列表
    const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
    // changedFiles 格式为键值对，键为发生变化的文件路径。
    if (changedFiles[filePath] !== undefined) {
      // filePath 对应的文件发生了变化
    }
    callback();
});
```

默认情况下 `Webpack` 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 `HTML` 文件。 由于 `JavaScript` 文件不会去导入 `HTML` 文件，`Webpack` 就不会监听 `HTML` 文件的变化，编辑 `HTML` 文件时就不会重新触发新的 `Compilation`。 为了监听 `HTML` 文件的变化，我们需要把 `HTML` 文件加入到依赖列表中，为此可以使用如下代码：
```js
compiler.plugin('after-compile', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
    compilation.fileDependencies.push(filePath);
    callback();
});
```

- 修改输出资源 - `emit`

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 `emit` 事件，因为发生 `emit` 事件时所有模块的转换和代码块对应的文件已经生成好， 需要输出的资源即将输出，因此 `emit` 事件是修改 `Webpack` 输出资源的最后时机。

所有需要输出的资源会存放在 `compilation.assets` 中，`compilation.assets` 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。设置 `compilation.assets` 的代码如下：

```js
compiler.plugin('emit', (compilation, callback) => {
  // 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
      },
    // 返回文件大小
      size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  };
  callback();
});
```

读取 `compilation.assets` 的代码如下：

```js
compiler.plugin('emit', (compilation, callback) => {
  // 读取名称为 fileName 的输出资源
  const asset = compilation.assets[fileName];
  // 获取输出资源的内容
  asset.source();
  // 获取输出资源的文件大小
  asset.size();
  callback();
});
```

- 判断 `Webpack` 使用了哪些插件

在开发一个插件时可能需要根据当前配置是否使用了其它某个插件而做下一步决定，因此需要读取 `Webpack` 当前的插件配置情况。 以判断当前是否使用了 `ExtractTextPlugin` 为例，可以使用如下代码：

```js
// 判断当前配置使用使用了 ExtractTextPlugin，
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find(plugin=>plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```

## Loader 和 Plugin 区别

- `Loader` 本质就是一个**函数**，在该函数中对接收到的内容进行转换，返回转换后的结果。
- 因为 `Webpack` 只认识 `JavaScript`，所以 `Loader` 就成了翻译官，对其他类型的资源进行转译的预处理工作。
- `Plugin` 就是插件，基于事件流框架 `Tapable`，插件可以扩展 `Webpack` 的功能，在 `Webpack` 运行的生命周期中会广播出许多事件，`Plugin` 可以监听这些事件，在合适的时机通过 `Webpack` 提供的 API 改变输出结果。
- `Loader` 在 `module.rules` 中配置，作为模块的解析规则，类型为**数组**。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
- `Plugin` 在 `plugins` 中单独配置，类型为**数组**，每一项是一个 `Plugin` 的实例，参数都通过构造函数传入。


## 常见 Plugin

- define-plugin：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
- ignore-plugin：忽略部分文件
- html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
- web-webpack-plugin：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
- uglifyjs-webpack-plugin：不支持 ES6 压缩 (Webpack4 以前)
- terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
- webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代 extract-text-webpack-plugin)
- serviceworker-webpack-plugin：为网页应用增加离线缓存功能
- clean-webpack-plugin: 目录清理
- ModuleConcatenationPlugin: 开启 Scope Hoisting
- speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
- webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
- webpack-dashboard：可以更友好的展示相关打包信息。
- webpack-merge：提取公共配置，减少重复配置代码
- speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
- size-plugin：监控资源体积变化，尽早发现问题
- HotModuleReplacementPlugin：模块热替换

## 参考资料
[深入浅出 webpack](http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-4%E7%BC%96%E5%86%99Plugin.html)

[compiler 钩子](https://webpack.docschina.org/api/compiler-hooks/)