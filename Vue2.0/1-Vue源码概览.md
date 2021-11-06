## Vue 项目结构

```
src
├── compiler        # 编译相关
├── core            # 核心代码
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

### compiler

compiler 目录包含 `Vue.js` 所有编译相关的代码。它包括把**模板解析成 ast 语法树，ast 语法树优化，代码生成**等功能。

编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 `Vue.js`。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

### core

core 目录包含了 `Vue.js` 的核心代码，包括**内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数**等等。

### platform

`Vue.js` 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 `Vue.js` 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 `Vue.js`。

### server

`Vue.js` 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。这部分代码是跑在服务端的 `Node.js`，不要和跑在浏览器端的 `Vue.js` 混为一谈。

服务端渲染主要的工作是把组件渲染为服务器端的 `HTML` 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

### sfc

通常我们开发 `Vue.js` 都会借助 `webpack` 构建， 然后通过 .vue 单文件来编写组件。

这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

### shared

`Vue.js` 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 `Vue.js` 和服务端的 `Vue.js` 所共享的。

## Vue 的入口

`src/platforms/web/entry-runtime-with-compiler.js` => `src/platforms/web/runtime/index.js` => `src/core/index.js` => `src/core/instance/index.js` 溯源之后我们发现这个用函数实现的 Vue 类：

```js
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
```

为何 `Vue` 不用 ES6 的 `Class` 去实现呢？我们往后看这里有很多 `xxxMixin` 的函数调用，并把 `Vue` 当参数传入，它们的功能都是给 `Vue` 的 `prototype` 上扩展一些方法，`Vue` 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 `Class` 难以实现的。这么做的好处是非常方便代码的维护和管理，这种编程技巧也非常值得我们去学习。

Vue.js 在整个初始化过程中，除了给它的原型 `prototype` 上扩展方法，还会给 `Vue` 这个对象本身扩展全局的静态方法，它的定义在 `src/core/global-api/index.js` 中：

```js
export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}
```

`Vue` 本质上就是一个用 `Function` 实现的 `Class`，然后它的原型 `prototype` 以及它本身都扩展了一系列的方法和属性。

## runtime + compiler 和 runtime-only

- runtime-compiler

`template -> ast -> render -> virtual dom -> UI`

首先将 vue 中的 `template` 模板进行解析解析成 abstract syntax tree （ast）抽象语法树，将抽象语法树在编译成 `render` 函数，将 `render` 函数再翻译成 `virtual dom`（虚拟 dom），将虚拟 dom 显示在浏览器上。

- runtime-only

`render -> virtual dom -> UI`

可以看出它省略了从 `template -> ast -> render` 的过程，所以 `runtime-only` 比 `runtime-compiler` 更快，代码量更少。`runtime-only` 模式中不是没有写 `template` ，只是把 `template` 放在了.vue 的文件中了，并有一个叫`vue-template-compiler` 的开发依赖时将.vue 文件中的 `template` 解析成 `render` 函数。 因为是开发依赖，不在最后生产中，所以最后生产出来的运行的代码没有 `template`。

[Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/directory.html)
