## webpack

### webpack 出现的背景

现在很多源代码无法直接运行，必须通过转换后才可以正常运行。构建就是做这件事情，把源代码转换成发布到线上的可执行 `JavaScript`、`CSS`、`HTML` 代码，包括如下内容。

- 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等。
- 文件优化：压缩 JavaS-cript、CSS、HTML 代码，压缩合并图片等。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。
- 构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。 构建给前端开发注入了更大的活力，解放了我们的生产力。

`Webpack` 是一个打包**模块化** `JavaScript` 的工具，在 `Webpack` 里一切文件皆**模块**，通过 `Loader` 转换文件，通过 `Plugin` 注入钩子，最后输出由多个模块组合成的文件。`Webpack` 专注于构建模块化项目。一切文件：`JavaScript`、`CSS`、`SCSS`、图片、模板，在 `Webpack` 眼中都是一个个模块，这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便 `Webpack` 对模块进行组合和打包。 经过 `Webpack` 的处理，最终会输出浏览器能使用的静态资源。

`Webpack` 是一个打包**模块化** `JavaScript` 的工具，它会从 main.js 出发，识别出源码中的模块化导入语句， 递归的寻找出入口文件的所有依赖，把入口和其所有依赖打包到一个单独的文件中。 从 Webpack2 开始，已经内置了对 `ES6`、`CommonJS`、`AMD` 模块化语句的支持。

### webpack 核心概念、工作流程

- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Resolve： 配置寻找模块的规则。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugins：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。

`Webpack` 启动后会从 `Entry` 里配置的 `Module` 开始递归解析 `Entry` 依赖的所有 `Module`。 每找到一个 `Module`， 就会根据配置的 `Loader` 去找出对应的转换规则，对 `Module` 进行转换后，再解析出当前 `Module` 依赖的 `Module`。 这些模块会以 `Entry` 为单位进行分组，一个 `Entry` 和其所有依赖的 `Module` 被分到一个组也就是一个 `Chunk`。最后 Webpack 会把所有 `Chunk` 转换成文件输出。 在整个流程中 `Webpack` 会在恰当的时机执行 `Plugin` 里定义的逻辑。

- 想让源文件加入到构建流程中去被 Webpack 控制，配置 entry。
- 想自定义输出文件的位置和名称，配置 output。
- 想自定义寻找依赖模块时的策略，配置 resolve。
- 想自定义解析和转换文件的策略，配置 module，通常是配置 module.rules 里的 Loader。
- 其它的大部分需求可能要通过 Plugin 去实现，配置 plugin。

### webpack 构建过程

`Webpack` 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

初始化参数：从配置文件和 `Shell` 语句中读取与合并参数，得出最终的参数

开始编译：用上一步得到的参数初始化 `Compiler` 对象，加载所有配置的插件，执行对象的 `run` 方法开始执行编译

确定入口：根据配置中的 `entry` 找出所有的入口文件

编译模块：从入口文件出发，调用所有配置的 `Loader` 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

完成模块编译：在经过第 4 步使用 `Loader` 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `Webpack` 提供的 API 改变 `Webpack` 的运行结果。

### npm 常用命令

```js
// -----安装模块-----
// 全局安装
npm install <package> -g

// 本地安装
npm install <package>

// 如果是用户会使用到的，这个命令后面需要加上--save，这样package.json中的dependencies会自动添加这个模块依赖
npm install <package> --save

// 如果仅仅是开发者使用，后面加上--save-dev就可以了，这样package.json中的devDependencies会自动添加这个模块依赖
npm install <package> --save-dev

// 如果安装指定版本，模块名需要加版本号
npm install <package>@1.0.0

// 常用的下载命令
[-P|--save-prod|-D|--save-dev|-O|--save-optional]
[-E|--save-exact]
[-B|--save-bundle]
[--no-save]
[--dry-run]

// 查看包信息
npm info <package>

// 查看当前项目下可执行的script
npm run
```

### package.json 文件

- "dependencies": These packages are required by your application in production.
- "devDependencies": These packages are only needed for development and testing.
- "scripts": scripts 字段是一个对象，每个属性对应一段 Shell 脚本,底层实现原理是通过调用 Shell 去运行脚本命令.

### package-lock.json 文件

### webpack 配置示例

```js
const path = require("path");

module.exports = {
  // entry 表示 入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
  // 类型可以是 string | object | array
  entry: "./app/entry", // 只有1个入口，入口只有1个文件
  entry: ["./app/entry1", "./app/entry2"], // 只有1个入口，入口有2个文件
  entry: {
    // 有2个入口
    a: "./app/entry-a",
    b: ["./app/entry-b1", "./app/entry-b2"],
  },

  // 如何输出结果：在 Webpack 经过一系列处理后，如何输出最终想要的代码。
  output: {
    // 输出文件存放的目录，必须是 string 类型的绝对路径。
    path: path.resolve(__dirname, "dist"),

    // 输出文件的名称
    filename: "bundle.js", // 完整的名称
    filename: "[name].js", // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: "[chunkhash].js", // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: "/assets/", // 放到指定目录下
    publicPath: "", // 放到根目录下
    publicPath: "https://cdn.example.com/", // 放到 CDN 上去

    // 导出库的名称，string 类型
    // 不填它时，默认输出格式是匿名的立即执行函数
    library: "MyLibrary",

    // 导出库的类型，枚举类型，默认是 var
    // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
    libraryTarget: "umd",

    // 是否包含有用的文件路径信息到生成的代码里去，boolean 类型
    pathinfo: true,

    // 附加 Chunk 的文件名称
    chunkFilename: "[id].js",
    chunkFilename: "[chunkhash].js",

    // JSONP 异步加载资源时的回调函数名称，需要和服务端搭配使用
    jsonpFunction: "myWebpackJsonp",

    // 生成的 Source Map 文件名称
    sourceMapFilename: "[file].map",

    // 浏览器开发者工具里显示的源码模块名称
    devtoolModuleFilenameTemplate: "webpack:///[resource-path]",

    // 异步加载跨域的资源时使用的方式
    crossOriginLoading: "use-credentials",
    crossOriginLoading: "anonymous",
    crossOriginLoading: false,
  },

  // 配置模块相关
  module: {
    rules: [
      // 配置 Loader
      {
        test: /\.jsx?$/, // 正则匹配命中要使用 Loader 的文件
        include: [
          // 只会命中这里面的文件
          path.resolve(__dirname, "app"),
        ],
        exclude: [
          // 忽略这里面的文件
          path.resolve(__dirname, "app/demo-files"),
        ],
        use: [
          // 使用那些 Loader，有先后次序，从后往前执行
          "style-loader", // 直接使用 Loader 的名称
          {
            loader: "css-loader",
            options: {
              // 给 html-loader 传一些参数
            },
          },
        ],
      },
    ],
    noParse: [
      // 不用解析和处理的模块
      /special-library\.js$/, // 用正则匹配
    ],
  },

  // 配置插件
  plugins: [],

  // 配置寻找模块的规则
  resolve: {
    modules: [
      // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      "node_modules",
      path.resolve(__dirname, "app"),
    ],
    extensions: [".js", ".json", ".jsx", ".css"], // 模块的后缀名
    alias: {
      // 模块别名配置，用于映射模块
      // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      module: "new-module",
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      "only-module$": "new-module",
    },
    alias: [
      // alias 还支持使用数组来更详细的配置
      {
        name: "module", // 老的模块
        alias: "new-module", // 新的模块
        // 是否是只映射模块，如果是 true 只有 'module' 会被映射，如果是 false 'module/inner/path' 也会被映射
        onlyModule: true,
      },
    ],
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ["package.json"], // 模块的描述文件
    mainFields: ["main"], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀
  },

  // 输出文件性能检查配置
  performance: {
    hints: "warning", // 有性能问题时输出警告
    hints: "error", // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function (assetFilename) {
      // 过滤要检查的文件
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    },
  },

  devtool: "source-map", // 配置 source-map 类型

  context: __dirname, // Webpack 使用的根目录，string 类型必须是绝对路径

  // 配置输出代码的运行环境
  target: "web", // 浏览器，默认
  target: "webworker", // WebWorker
  target: "node", // Node.js，使用 `require` 语句加载 Chunk 代码
  target: "async-node", // Node.js，异步加载 Chunk 代码
  target: "node-webkit", // nw.js
  target: "electron-main", // electron, 主线程
  target: "electron-renderer", // electron, 渲染线程

  externals: {
    // 使用来自 JavaScript 运行环境提供的全局变量
    jquery: "jQuery",
  },

  stats: {
    // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },

  devServer: {
    // DevServer 相关的配置
    proxy: {
      // 代理到后端服务接口
      "/api": "http://localhost:3000",
    },
    contentBase: path.join(__dirname, "public"), // 配置 DevServer HTTP 服务器的文件根目录
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    hot: true, // 是否开启模块热替换功能
    https: false, // 是否开启 HTTPS 模式
  },

  profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

  cache: false, // 是否启用缓存提升构建速度

  watch: true, // 是否开始
  watchOptions: {
    // 监听模式选项
    // 不监听的文件或文件夹，支持正则匹配。默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每隔1000毫秒询问一次
    poll: 1000,
  },
};
```
