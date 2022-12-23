## Vue-Router 路由原理

### Vue-Router 的使用

```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```

```js
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

Vue.use(VueRouter);

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: "<div>foo</div>" };
const Bar = { template: "<div>bar</div>" };

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: "/foo", component: Foo },
  { path: "/bar", component: Bar },
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  el: "#app",
  render(h) {
    return h(App);
  },
  router,
});
```

### Vue-Router 注册安装

可以看到路由的使用，首先导入 `VueRouter` 模块，使用 `Vue.use` 注册这个插件，然后实例化一个 `VueRouter` 对象，并在 `new Vue` 的时候把这个路由对象传进去。

`Vue` 提供了 `Vue.use` 的全局 API 来注册插件，会判断 `plugin` 有没有定义 `install` 方法，如果有的话则调用该方法，并且该方法执行的第一个参数是 `Vue`。每个插件都需要实现一个静态的 `install` 方法，当我们执行 `Vue.use` 注册插件的时候，就会执行这个 `install` 方法，并且在这个 `install` 方法的第一个参数我们可以拿到 `Vue` 对象，这样的好处就是作为插件的编写方不需要再额外去 `import Vue` 了。

`Vue-Router` 的入口文件是 `src/index.js`，其中定义了 `VueRouter` 类，也实现了 `install` 的静态方法：

```js
export let _Vue;
export function install(Vue) {
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  const isDef = (v) => v !== undefined;

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (
      isDef(i) &&
      isDef((i = i.data)) &&
      isDef((i = i.registerRouteInstance))
    ) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router; //VueRouter实例
        this._router.init(this);//调用VueRouter实例的init方法
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });

  // 给 Vue 原型上定义了 $router 和 $route 2 个属性
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });

  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    },
  });

  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);

  const strats = Vue.config.optionMergeStrategies;
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate =
    strats.created;
}
```

`install` 方法最重要的一步就是利用 `Vue.mixin` 去把 `beforeCreate` 和 `destroyed` 钩子函数注入到每一个组件中，给 `Vue` 原型上定义了 `$router` 和 `$route` 2 个属性。

先看混入的 `beforeCreate` 钩子函数，对于根 `Vue` 实例而言，执行该钩子函数时定义了 `this._routerRoot` 表示它自身；`this._router` 表示 `VueRouter` 的实例 `router`，它是在 `new Vue` 的时候传入的；另外执行了 `this._router.init()` 方法初始化 `router`，然后用 `defineReactive` 方法把 `this._route` 变成响应式对象。而对于子组件而言，由于组件是树状结构，在遍历组件树的过程中，它们在执行该钩子函数的时候 `this._routerRoot` 始终指向的离它最近的传入了 `router` 对象作为配置而实例化的父实例。

### Vue.mixin

```js
export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
```

它的实现实际上非常简单，就是把要混入的对象通过 `mergeOptions` 合并到 `Vue` 的 `options` 中，由于每个组件的构造函数都会在 `extend` 阶段合并 `Vue.options` 到自身的 `options` 中，所以也就相当于每个组件都定义了 `mixin` 定义的选项。

### VueRouter 类

先看它的构造函数：

```js
constructor (options: RouterOptions = {}) {
  this.app = null
  this.apps = []
  this.options = options
  this.beforeHooks = []
  this.resolveHooks = []
  this.afterHooks = []
  this.matcher = createMatcher(options.routes || [], this)

  let mode = options.mode || 'hash'
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base)
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `invalid mode: ${mode}`)
      }
  }
}
```

- `this.app` 表示根 `Vue` 实例
- `this.apps` 保存持有 `$options.router` 属性的 `Vue` 实例
- `this.options` 保存传入的路由配置
- `this.beforeHooks`、 `this.resolveHooks`、`this.afterHooks` 表示一些钩子函数
- `this.matcher` 表示路由匹配器
- `this.fallback` 表示在浏览器不支持 `history.pushState` 的情况下，根据传入的 `fallback` 配置参数，决定是否回退到 `hash` 模式
- `this.mode` 表示路由创建的模式
- `this.history`表示路由历史的具体的实现实例，它是根据 `this.mode` 的不同实现不同，它有 `History` 基类，然后不同的 `history` 实现都是继承 `History`

然后是实例化组件的时候在 `beforeCreate` 生命周期调动 `VueRouter` 的 `init` 方法如下：

```js
init (app: any) {
  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
    `before creating root instance.`
  )

  this.apps.push(app)

  if (this.app) {
    return
  }

  this.app = app

  const history = this.history

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation())
  } else if (history instanceof HashHistory) {
    const setupHashListener = () => {
      history.setupListeners()
    }
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    )
  }

  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}
```
在 `init` 方法中执行了 `history.transitionTo` 方法定义在 History 基类中，然后在 `transitionTo` 中执行了`this.router.match`，实际上是调用了 `this.matcher.match` 方法去做匹配：
```js
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const route = this.router.match(location, this.current)
    this.confirmTransition(route, () => {
      this.updateRoute(route)
      onComplete && onComplete(route)
      this.ensureURL()

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => { cb(route) })
      }
    }, err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => { cb(err) })
      }
    })
  }
```

### Matcher

`createMatcher` 接收 2 个参数，一个是 `router`，它是我们 `new VueRouter` 返回的实例，一个是 `routes`，它是用户定义的路由配置，最终返回`return {match,addRoutes}`两个方法：
```js
declare type Location = {
  _normalized?: boolean;
  name?: string;
  path?: string;
  hash?: string;
  query?: Dictionary<string>;
  params?: Dictionary<string>;
  append?: boolean;
  replace?: boolean;
}
declare type Route = {
  path: string;
  name: ?string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: Array<RouteRecord>;
  redirectedFrom?: string;
  meta?: any;
}

export type Matcher = {
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
  addRoutes: (routes: Array<RouteConfig>) => void;
};

export function createMatcher (
  routes: Array<RouteConfig>,
  router: VueRouter
): Matcher {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location

    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location)
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, `named route "${name}"`)
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record: RouteRecord,
    location: Location
  ): Route {
    const originalRedirect = record.redirect
    let redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect

    if (typeof redirect === 'string') {
      redirect = { path: redirect }
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, `invalid redirect option: ${JSON.stringify(redirect)}`
        )
      }
      return _createRoute(null, location)
    }

    const re: Object = redirect
    const { name, path } = re
    let { query, hash, params } = location
    query = re.hasOwnProperty('query') ? re.query : query
    hash = re.hasOwnProperty('hash') ? re.hash : hash
    params = re.hasOwnProperty('params') ? re.params : params

    if (name) {
      // resolved named direct
      const targetRecord = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, `redirect failed: named route "${name}" not found.`)
      }
      return match({
        _normalized: true,
        name,
        query,
        hash,
        params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      const rawPath = resolveRecordPath(path, record)
      // 2. resolve params
      const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`)
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query,
        hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`)
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record: RouteRecord,
    location: Location,
    matchAs: string
  ): Route {
    const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`)
    const aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    })
    if (aliasedMatch) {
      const matched = aliasedMatch.matched
      const aliasedRecord = matched[matched.length - 1]
      location.params = aliasedMatch.params
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match,
    addRoutes
  }
}
```

### 路由切换

当我们点击 `router-link` 的时候，实际上最终会执行 `router.push`，如下：
```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.history.push(location, onComplete, onAbort)
}
```
`this.history.push` 函数，这个函数是子类实现的，不同模式下该函数的实现略有不同，我们来看一下平时使用比较多的 `hash` 模式该函数的实现，在 `src/history/hash.js` 中：
```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```
`push` 函数会先执行 `this.transitionTo` 做路径切换，在切换完成的回调函数中，执行 `pushHash` 函数，`pushState` 会调用浏览器原生的 `history` 的 `pushState` 接口或者 `replaceState` 接口，更新浏览器的 `url` 地址，并把当前 `url` 压入历史栈中：
```js
function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}
```
然后在 `history` 的初始化中，会设置一个监听器，监听历史栈的变化，监听`hashchange`事件：
```js
setupListeners () {
  const router = this.router
  const expectScroll = router.options.scrollBehavior
  const supportsScroll = supportsPushState && expectScroll

  if (supportsScroll) {
    setupScroll()
  }

  window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', () => {
    const current = this.current
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      if (supportsScroll) {
        handleScroll(this.router, route, current, true)
      }
      if (!supportsPushState) {
        replaceHash(route.fullPath)
      }
    })
  })
}
```
当点击浏览器返回按钮的时候，如果已经有 `url` 被压入历史栈，则会触发 `popstate` 事件，然后拿到当前要跳转的 `hash`，执行 `transtionTo` 方法做一次路径转换。

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### $router和$route

- $router
    - 全局的路由实例，是router构造方法的实例。
    - `$route.path` 字符串，等于当前路由对象的路径，会被解析为绝对路径，如 `“/index/”` 。
    - `$route.params` 对象，包含路由中的动态片段和全匹配片段的键值对
    - `$route.query` 对象，包含路由中查询参数的键值对。例如，对于 `/index?id=1` ，会得到 `$route.query.id == 1`。

- $route
    - 表示当前激活的路由的状态信息，包含了当前 `URL` 解析得到的信息，还有 `URL` 匹配到的 `route records`（路由记录）。
    - `$route.router` 路由规则所属的路由器（以及其所属的组件）。
    - `$route.matched` 数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。
    - `$route.name` 当前路径的名字，如果没有使用具名路径，则名字为空。