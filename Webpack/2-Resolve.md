## Resolve 配置

`Webpack` 在启动后会从配置的入口模块出发找出所有依赖的模块，`Resolve` 配置 `Webpack` 如何寻找模块所对应的文件。 `Webpack` 内置 `JavaScript` 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你也可以根据自己的需要修改默认的规则。

### resolve.alias

```js
resolve: {
  alias: {
    components: "./src/components/";
  }
}
```

当你通过 `import Button from 'components/button'` 导入时，实际上被 `alias` 等价替换成了 `import Button from './src/components/button'`。所以 `alias` 配置的含义是把导入语句里的 `components` 关键字替换成 `./src/components/`。

### resolve.extensions

在导入语句没带文件后缀时，`Webpack` 会自动带上后缀后去尝试访问文件是否存在。 `resolve.extensions` 用于配置在尝试过程中用到的后缀列表，默认是：

```js
extensions: [".js", ".json"];
```

也就是说当遇到 `require('./data')` 这样的导入语句时，Webpack 会先去寻找 `./data.js` 文件，如果该文件不存在就去寻找 `./data.json` 文件， 如果还是找不到就报错。

假如你想让 `Webpack` 优先使用目录下的 `TypeScript` 文件，可以这样配置：

```js
extensions: [".ts", ".js", ".json"];
```

### resolve.modules

`resolve.modules` 配置 `Webpack` 去哪些目录下寻找第三方模块，默认是只会去 `node_modules` 目录下寻找。 有时你的项目里会有一些模块会大量被其它模块依赖和导入，由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，就像这样 `import '../../../components/button'` 这时你可以利用 `modules` 配置项优化，假如那些被大量导入的模块都在 `./src/components` 目录下，把 `modules` 配置成

```js
modules: ["./src/components", "node_modules"];
```

后，你可以简单通过 `import 'button'` 导入。

### enforceExtension

`resolve.enforceExtension` 如果配置为 true 所有导入语句都必须要带文件后缀， 例如开启前 `import './foo'` 能正常工作，开启后就必须写成 `import './foo.js'`
