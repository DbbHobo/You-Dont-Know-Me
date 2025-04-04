# vue-router

## vue-router 的使用

### 路由注册和调用

路由器实例是通过调用 `createRouter()` 函数创建的:

这里的 `routes` 选项定义了一组路由，把 `URL` 路径映射到组件。其中，由 `component` 参数指定的组件就是先前在 `App.vue` 中被 `<RouterView>` 渲染的组件。这些路由组件通常被称为视图，但本质上它们只是普通的 `Vue` 组件。

```js
import { createWebHashHistory, createRouter } from "vue-router"

import HomeView from "./HomeView.vue"
import AboutView from "./AboutView.vue"

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
```

在这个 `template` 中使用了两个由 `Vue Router` 提供的组件: `RouterLink` 和 `RouterView`

```vue
<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
```

通常我们使用 `vue-router` 是在创建 `App` 实例之后调用 `use` 方法将其当做插件调用，然后就会进入 `vue-router` 的 `install` 方法：

```ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)
// 【使用pinia和vue-router插件】
app.use(createPinia())
app.use(router)
app.mount("#app")

// 【packages/runtime-core/src/apiCreateApp.ts】
const installedPlugins = new WeakSet()

const app: App = (context.app = {
  _uid: uid++,
  _component: rootComponent as ConcreteComponent,
  _props: rootProps,
  _container: null,
  _context: context,
  _instance: null,

  version,

  get config() {
    return context.config
  },

  set config(v) {
    if (__DEV__) {
      warn(`app.config cannot be replaced. Modify individual options instead.`)
    }
  },
  // 【使用插件的入口，会调用插件的install方法，所有使用的插件保存在installedPlugins中】
  use(plugin: Plugin, ...options: any[]) {
    if (installedPlugins.has(plugin)) {
      __DEV__ && warn(`Plugin has already been applied to target app.`)
    } else if (plugin && isFunction(plugin.install)) {
      installedPlugins.add(plugin)
      plugin.install(app, ...options)
    } else if (isFunction(plugin)) {
      installedPlugins.add(plugin)
      plugin(app, ...options)
    } else if (__DEV__) {
      warn(
        `A plugin must either be a function or an object with an "install" ` +
          `function.`
      )
    }
    return app
  },

  mixin(mixin: ComponentOptions) {
    //【...省略】
  },

  component(name: string, component?: Component): any {
    //【...省略】
  },

  directive(name: string, directive?: Directive) {
    //【...省略】
  },

  mount(
    rootContainer: HostElement,
    isHydrate?: boolean,
    namespace?: boolean | ElementNamespace
  ): any {
    //【...省略】
  },

  onUnmount(cleanupFn: () => void) {
    //【...省略】
  },

  unmount() {
    //【...省略】
  },

  provide(key, value) {
    //【...省略】
  },

  runWithContext(fn) {
    //【...省略】
  },
})
```

路由逻辑中有两个重要的对象 `router` 实例、`route` 实例，前者提供了路由相关的许多方法，后者是对当前正在访问的路由的描述。

### 获取路由实例

可以用 `this` 访问当前组件并访问继承的`$router`：

```js
export default {
  methods: {
    goToAbout() {
      this.$router.push("/about")
    },
  },
}
```

可以通过 `useRouter()` 和 `useRoute()` 来访问路由器实例和当前路由实例：

```vue
<script setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const search = computed({
  get() {
    return route.query.search ?? ""
  },
  set(search) {
    router.replace({ query: { search } })
  },
})
</script>
```

通过调用 `inject` 注入一个由整个应用 (通过 `app.provide()`) 在注册 `vue-router` 插件时提供的 `routerKey` 和 `routeLocationKey`。

```ts
// 【packages/router/src/useApi.ts】
/**
 * Returns the router instance. Equivalent to using `$router` inside
 * templates.
 */
export function useRouter(): Router {
  return inject(routerKey)!
}

/**
 * Returns the current route location. Equivalent to using `$route` inside
 * templates.
 */
export function useRoute<Name extends keyof RouteMap = keyof RouteMap>(
  _name?: Name
): RouteLocationNormalizedLoaded<Name> {
  return inject(routeLocationKey)!
}
```

### 常用路由方法

- `router.push()` 跳转到新路由（添加历史记录）
- `router.replace()` 替换当前路由（不添加历史记录）
- `router.go(n)` 在 history 记录中前进或后退 n 步
- `router.back()` 返回上一个历史记录
- `router.forward()` 前进到下一个历史记录
- `router.currentRoute` 获取当前路由对象
- `router.addRoute()` 动态添加路由
- `router.removeRoute()` 删除动态路由
- `router.isReady()` 等待路由初始化完成
- `router.beforeEach()` 全局前置守卫（导航守卫）
- `router.afterEach()` 全局后置守卫（如埋点、修改标题）

- `route.path` 当前路径（如 "/user/123"）
- `route.params` 动态参数
- `route.query` URL 查询参数
- `route.name` 路由名称

## router 实例

**全局唯一的路由器实例**将被暴露为 `$router`，由 `createRouter` 创建的，创建过程如下：

```ts
import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
})

export default router
```

`router` 实例是由 `createRouter` 创建的，其中 `currentRoute` 属性就是对应的当前路由 `route` 实例，还包括了 `addRoute`/`removeRoute`/`getRoutes`/`push`/`replace`/`go`/`back` 等等一系列方法提供给用户去调用并进行导航的切换等功能：

```ts
// 【packages/router/src/router.ts】
/**
 * Creates a Router instance that can be used by a Vue app.
 *
 * @param options - {@link RouterOptions}
 */
export function createRouter(options: RouterOptions): Router {
  const matcher = createRouterMatcher(options.routes, options)
  const parseQuery = options.parseQuery || originalParseQuery
  const stringifyQuery = options.stringifyQuery || originalStringifyQuery
  const routerHistory = options.history
  if (__DEV__ && !routerHistory)
    throw new Error(
      'Provide the "history" option when calling "createRouter()":' +
        " https://router.vuejs.org/api/interfaces/RouterOptions.html#history"
    )

  const beforeGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
  const beforeResolveGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
  const afterGuards = useCallbacks<NavigationHookAfter>()
  const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
    START_LOCATION_NORMALIZED
  )
  let pendingLocation: RouteLocation = START_LOCATION_NORMALIZED

  // leave the scrollRestoration if no scrollBehavior is provided
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual"
  }

  const normalizeParams = applyToParams.bind(
    null,
    (paramValue) => "" + paramValue
  )
  const encodeParams = applyToParams.bind(null, encodeParam)
  const decodeParams: (params: RouteParams | undefined) => RouteParams =
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)

  function addRoute(
    parentOrRoute: NonNullable<RouteRecordNameGeneric> | RouteRecordRaw,
    route?: RouteRecordRaw
  ) {
    //【...省略】
  }

  function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
    //【...省略】
  }

  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record)
  }

  function hasRoute(name: NonNullable<RouteRecordNameGeneric>): boolean {
    return !!matcher.getRecordMatcher(name)
  }

  function resolve(
    rawLocation: RouteLocationRaw,
    currentLocation?: RouteLocationNormalizedLoaded
  ): RouteLocationResolved {
    //【...省略】
  }

  function locationAsObject(
    to: RouteLocationRaw | RouteLocationNormalized
  ): Exclude<RouteLocationRaw, string> | RouteLocationNormalized {
    return typeof to === "string"
      ? parseURL(parseQuery, to, currentRoute.value.path)
      : assign({}, to)
  }

  function checkCanceledNavigation(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): NavigationFailure | void {
    if (pendingLocation !== to) {
      return createRouterError<NavigationFailure>(
        ErrorTypes.NAVIGATION_CANCELLED,
        {
          from,
          to,
        }
      )
    }
  }

  function push(to: RouteLocationRaw) {
    return pushWithRedirect(to)
  }

  function replace(to: RouteLocationRaw) {
    return push(assign(locationAsObject(to), { replace: true }))
  }

  function handleRedirectRecord(to: RouteLocation): RouteLocationRaw | void {
    //【...省略】
  }

  function pushWithRedirect(
    to: RouteLocationRaw | RouteLocation,
    redirectedFrom?: RouteLocation
  ): Promise<NavigationFailure | void | undefined> {
    //【...省略】
  }

  /**
   * Helper to reject and skip all navigation guards if a new navigation happened
   * @param to
   * @param from
   */
  function checkCanceledNavigationAndReject(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<void> {
    const error = checkCanceledNavigation(to, from)
    return error ? Promise.reject(error) : Promise.resolve()
  }

  function runWithContext<T>(fn: () => T): T {
    const app: App | undefined = installedApps.values().next().value
    // support Vue < 3.3
    return app && typeof app.runWithContext === "function"
      ? app.runWithContext(fn)
      : fn()
  }

  // TODO: refactor the whole before guards by internally using router.beforeEach

  function navigate(
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded
  ): Promise<any> {
    //【...省略】
  }

  function triggerAfterEach(
    to: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded,
    failure?: NavigationFailure | void
  ): void {
    // navigation is confirmed, call afterGuards
    // TODO: wrap with error handlers
    afterGuards
      .list()
      .forEach((guard) => runWithContext(() => guard(to, from, failure)))
  }

  /**
   * - Cleans up any navigation guards
   * - Changes the url if necessary
   * - Calls the scrollBehavior
   */
  function finalizeNavigation(
    toLocation: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded,
    isPush: boolean,
    replace?: boolean,
    data?: HistoryState
  ): NavigationFailure | void {
    //【...省略】
  }

  let removeHistoryListener: undefined | null | (() => void)
  // attach listener to history to trigger navigations
  function setupListeners() {
    //【...省略】
  }

  // Initialization and Errors

  let readyHandlers = useCallbacks<OnReadyCallback>()
  let errorListeners = useCallbacks<_ErrorListener>()
  let ready: boolean

  /**
   * Trigger errorListeners added via onError and throws the error as well
   *
   * @param error - error to throw
   * @param to - location we were navigating to when the error happened
   * @param from - location we were navigating from when the error happened
   * @returns the error as a rejected promise
   */
  function triggerError(
    error: any,
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded
  ): Promise<unknown> {
    //【...省略】
  }

  function isReady(): Promise<void> {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve()
    return new Promise((resolve, reject) => {
      readyHandlers.add([resolve, reject])
    })
  }

  /**
   * Mark the router as ready, resolving the promised returned by isReady(). Can
   * only be called once, otherwise does nothing.
   * @param err - optional error
   */
  function markAsReady<E = any>(err: E): E
  function markAsReady<E = any>(): void
  function markAsReady<E = any>(err?: E): E | void {
    if (!ready) {
      // still not ready if an error happened
      ready = !err
      setupListeners()
      readyHandlers
        .list()
        .forEach(([resolve, reject]) => (err ? reject(err) : resolve()))
      readyHandlers.reset()
    }
    return err
  }

  // Scroll behavior
  function handleScroll(
    to: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded,
    isPush: boolean,
    isFirstNavigation: boolean
  ): // the return is not meant to be used
  Promise<unknown> {
    const { scrollBehavior } = options
    if (!isBrowser || !scrollBehavior) return Promise.resolve()

    const scrollPosition: _ScrollPositionNormalized | null =
      (!isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0))) ||
      ((isFirstNavigation || !isPush) &&
        (history.state as HistoryState) &&
        history.state.scroll) ||
      null

    return nextTick()
      .then(() => scrollBehavior(to, from, scrollPosition))
      .then((position) => position && scrollToPosition(position))
      .catch((err) => triggerError(err, to, from))
  }

  const go = (delta: number) => routerHistory.go(delta)

  let started: boolean | undefined
  const installedApps = new Set<App>()

  const router: Router = {
    currentRoute,
    listening: true,

    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve,
    options,

    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),

    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,

    onError: errorListeners.add,
    isReady,

    install(app: App) {
      const router = this
      app.component("RouterLink", RouterLink)
      app.component("RouterView", RouterView)

      app.config.globalProperties.$router = router
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute),
      })

      // this initial navigation is only necessary on client, on server it doesn't
      // make sense because it will create an extra unnecessary navigation and could
      // lead to problems
      if (
        isBrowser &&
        // used for the initial navigation client side to avoid pushing
        // multiple times when the router is used in multiple apps
        !started &&
        currentRoute.value === START_LOCATION_NORMALIZED
      ) {
        // see above
        started = true
        push(routerHistory.location).catch((err) => {
          if (__DEV__) warn("Unexpected error when starting the router:", err)
        })
      }

      const reactiveRoute = {} as RouteLocationNormalizedLoaded
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key as keyof RouteLocationNormalized],
          enumerable: true,
        })
      }

      app.provide(routerKey, router)
      app.provide(routeLocationKey, shallowReactive(reactiveRoute))
      app.provide(routerViewLocationKey, currentRoute)

      const unmountApp = app.unmount
      installedApps.add(app)
      app.unmount = function () {
        installedApps.delete(app)
        // the router is not attached to an app anymore
        if (installedApps.size < 1) {
          // invalidate the current navigation
          pendingLocation = START_LOCATION_NORMALIZED
          removeHistoryListener && removeHistoryListener()
          removeHistoryListener = null
          currentRoute.value = START_LOCATION_NORMALIZED
          started = false
          ready = false
        }
        unmountApp()
      }

      // TODO: this probably needs to be updated so it can be used by vue-termui
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
        addDevtools(app, router, matcher)
      }
    },
  }

  // TODO: type this as NavigationGuardReturn or similar instead of any
  function runGuardQueue(guards: Lazy<any>[]): Promise<any> {
    return guards.reduce(
      (promise, guard) => promise.then(() => runWithContext(guard)),
      Promise.resolve()
    )
  }

  return router
}
```

`router` 的 `install` 方法做了如下操作：

1. 注册全局组件 `RouterLink` 和 `RouterView`；
2. 注册全局属性 `$router` 和 `$route`，对应的是全局的 `router` 实例对象和当前路由 `route` 实例对象；
3. 依赖注入 `routerKey`、`routeLocationKey`、`routerViewLocationKey`；
4. 应用卸载之前对路由卸载的处理；

```ts
// 【packages/router/src/router.ts】
export function createRouter(options: RouterOptions): Router {
  //【...省略】
  const router: Router = {
    currentRoute,
    listening: true,

    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve,
    options,

    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),

    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,

    onError: errorListeners.add,
    isReady,

    install(app: App) {
      const router = this
      // 【全局注册RouterLink、RouterView组件】
      app.component("RouterLink", RouterLink)
      app.component("RouterView", RouterView)
      // 【为app实例添加$router和$route属性，$route要先解包】
      app.config.globalProperties.$router = router
      Object.defineProperty(app.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute),
      })

      // this initial navigation is only necessary on client, on server it doesn't
      // make sense because it will create an extra unnecessary navigation and could
      // lead to problems
      if (
        isBrowser &&
        // used for the initial navigation client side to avoid pushing
        // multiple times when the router is used in multiple apps
        !started &&
        currentRoute.value === START_LOCATION_NORMALIZED
      ) {
        // see above
        started = true
        // 【初始化跳到初始路由】
        push(routerHistory.location).catch((err) => {
          if (__DEV__) warn("Unexpected error when starting the router:", err)
        })
      }

      const reactiveRoute = {} as RouteLocationNormalizedLoaded
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key as keyof RouteLocationNormalized],
          enumerable: true,
        })
      }
      // 【依赖注入routerKey、routeLocationKey、routerViewLocationKey】
      app.provide(routerKey, router)
      app.provide(routeLocationKey, shallowReactive(reactiveRoute))
      app.provide(routerViewLocationKey, currentRoute)

      // 【app实例卸载之前将vue-router组件也卸载并且销毁相关数据】
      const unmountApp = app.unmount
      installedApps.add(app)
      app.unmount = function () {
        installedApps.delete(app)
        // the router is not attached to an app anymore
        if (installedApps.size < 1) {
          // invalidate the current navigation
          pendingLocation = START_LOCATION_NORMALIZED
          removeHistoryListener && removeHistoryListener()
          removeHistoryListener = null
          currentRoute.value = START_LOCATION_NORMALIZED
          started = false
          ready = false
        }
        unmountApp()
      }

      // TODO: this probably needs to be updated so it can be used by vue-termui
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
        addDevtools(app, router, matcher)
      }
    },
  }
  return router
}
```

### router.go() & router.back() & router.forward() & router.push() & router.replace()

可以看到这几个路由跳转方法最终进入了`pushWithRedirect`方法，本质会去调用 `routerHistory` 的方法也就是 `window.history` 对象上的方法 `pushState`/`replaceState`：

```ts
// 【packages/router/src/router.ts】
const router: Router = {
  //【...省略】

  currentRoute,
  push,
  replace,
  go,
  // 【back实质就是go(-1)，回到上一页】
  back: () => go(-1),
  // 【forward实质就是go(1)，去下一页】
  forward: () => go(1),

  //【...省略】
}

// 【调用routerHistory对象的go方法】
const go = (delta: number) => routerHistory.go(delta)

// 【调用pushWithRedirect方法】
function push(to: RouteLocationRaw) {
  return pushWithRedirect(to)
}
// 【跳转地址可以是字符串也可以是一个对象，replace: true表明是replace】
function replace(to: RouteLocationRaw) {
  return push(assign(locationAsObject(to), { replace: true }))
}

function pushWithRedirect(
  to: RouteLocationRaw | RouteLocation,
  redirectedFrom?: RouteLocation
): Promise<NavigationFailure | void | undefined> {
  const targetLocation: RouteLocation = (pendingLocation = resolve(to))
  const from = currentRoute.value
  const data: HistoryState | undefined = (to as RouteLocationOptions).state
  const force: boolean | undefined = (to as RouteLocationOptions).force
  // to could be a string where `replace` is a function
  const replace = (to as RouteLocationOptions).replace === true

  const shouldRedirect = handleRedirectRecord(targetLocation)

  if (shouldRedirect)
    return pushWithRedirect(
      assign(locationAsObject(shouldRedirect), {
        state:
          typeof shouldRedirect === "object"
            ? assign({}, data, shouldRedirect.state)
            : data,
        force,
        replace,
      }),
      // keep original redirectedFrom if it exists
      redirectedFrom || targetLocation
    )

  // if it was a redirect we already called `pushWithRedirect` above
  const toLocation = targetLocation as RouteLocationNormalized

  toLocation.redirectedFrom = redirectedFrom
  let failure: NavigationFailure | void | undefined

  if (!force && isSameRouteLocation(stringifyQuery, from, targetLocation)) {
    failure = createRouterError<NavigationFailure>(
      ErrorTypes.NAVIGATION_DUPLICATED,
      { to: toLocation, from }
    )
    // trigger scroll to allow scrolling to the same anchor
    handleScroll(
      from,
      from,
      // this is a push, the only way for it to be triggered from a
      // history.listen is with a redirect, which makes it become a push
      true,
      // This cannot be the first navigation because the initial location
      // cannot be manually navigated to
      false
    )
  }

  return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
    .catch((error: NavigationFailure | NavigationRedirectError) =>
      isNavigationFailure(error)
        ? // navigation redirects still mark the router as ready
          isNavigationFailure(error, ErrorTypes.NAVIGATION_GUARD_REDIRECT)
          ? error
          : markAsReady(error) // also returns the error
        : // reject any unknown error
          triggerError(error, toLocation, from)
    )
    .then((failure: NavigationFailure | NavigationRedirectError | void) => {
      if (failure) {
        if (
          isNavigationFailure(failure, ErrorTypes.NAVIGATION_GUARD_REDIRECT)
        ) {
          if (
            __DEV__ &&
            // we are redirecting to the same location we were already at
            isSameRouteLocation(
              stringifyQuery,
              resolve(failure.to),
              toLocation
            ) &&
            // and we have done it a couple of times
            redirectedFrom &&
            // @ts-expect-error: added only in dev
            (redirectedFrom._count = redirectedFrom._count
              ? // @ts-expect-error
                redirectedFrom._count + 1
              : 1) > 30
          ) {
            warn(
              `Detected a possibly infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow.\n Are you always returning a new location within a navigation guard? That would lead to this error. Only return when redirecting or aborting, that should fix this. This might break in production if not fixed.`
            )
            return Promise.reject(
              new Error("Infinite redirect in navigation guard")
            )
          }

          return pushWithRedirect(
            // keep options
            assign(
              {
                // preserve an existing replacement but allow the redirect to override it
                replace,
              },
              locationAsObject(failure.to),
              {
                state:
                  typeof failure.to === "object"
                    ? assign({}, data, failure.to.state)
                    : data,
                force,
              }
            ),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          )
        }
      } else {
        // if we fail we don't finalize the navigation
        failure = finalizeNavigation(
          toLocation as RouteLocationNormalizedLoaded,
          from,
          true,
          replace,
          data
        )
      }
      triggerAfterEach(
        toLocation as RouteLocationNormalizedLoaded,
        from,
        failure
      )
      return failure
    })
}

/**
 * - Cleans up any navigation guards
 * - Changes the url if necessary
 * - Calls the scrollBehavior
 */
function finalizeNavigation(
  toLocation: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
  isPush: boolean,
  replace?: boolean,
  data?: HistoryState
): NavigationFailure | void {
  // a more recent navigation took place
  const error = checkCanceledNavigation(toLocation, from)
  if (error) return error

  // only consider as push if it's not the first navigation
  const isFirstNavigation = from === START_LOCATION_NORMALIZED
  const state: Partial<HistoryState> | null = !isBrowser ? {} : history.state

  // change URL only if the user did a push/replace and if it's not the initial navigation because
  // it's just reflecting the url
  if (isPush) {
    // on the initial navigation, we want to reuse the scroll position from
    // history state if it exists
    if (replace || isFirstNavigation)
      routerHistory.replace(
        toLocation.fullPath,
        assign(
          {
            scroll: isFirstNavigation && state && state.scroll,
          },
          data
        )
      )
    else routerHistory.push(toLocation.fullPath, data)
  }

  // accept current navigation
  currentRoute.value = toLocation
  handleScroll(toLocation, from, isPush, isFirstNavigation)

  markAsReady()
}
```

### router.beforeEach() & router.afterEach() & router.beforeResolve()

可以看到这几个全局守卫相关 API 最终调用的是 `useCallbacks` 去添加用户在这些钩子上的回调任务然后在一定的时机去执行：

```ts
// 【packages/router/src/router.ts】
const router: Router = {
  //【...省略】

  beforeEach: beforeGuards.add,
  beforeResolve: beforeResolveGuards.add,
  afterEach: afterGuards.add,

  //【...省略】
}

const beforeGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
const beforeResolveGuards = useCallbacks<NavigationGuardWithThis<undefined>>()
const afterGuards = useCallbacks<NavigationHookAfter>()

// 【packages/router/src/utils/callbacks.ts】
/**
 * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
 */
export function useCallbacks<T>() {
  let handlers: T[] = []

  function add(handler: T): () => void {
    handlers.push(handler)
    return () => {
      const i = handlers.indexOf(handler)
      if (i > -1) handlers.splice(i, 1)
    }
  }

  function reset() {
    handlers = []
  }

  return {
    add,
    list: () => handlers.slice(),
    reset,
  }
}
```

路由守卫相关的回调触发时机本质是在路由进行切换的时候，可以看到在 `pushWithRedirect` 的逻辑中有序调用了各个路由守卫的回调如下：

`pushWithRedirect` => `navigate` => `beforeGuards.list()`

`pushWithRedirect` => `navigate` => `beforeResolve.list()`

```ts
// 【packages/router/src/router.ts】
function navigate(
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded
): Promise<any> {
  let guards: Lazy<any>[]

  const [leavingRecords, updatingRecords, enteringRecords] =
    extractChangingRecords(to, from)

  // all components here have been resolved once because we are leaving
  guards = extractComponentsGuards(
    leavingRecords.reverse(),
    "beforeRouteLeave",
    to,
    from
  )

  // leavingRecords is already reversed
  for (const record of leavingRecords) {
    record.leaveGuards.forEach((guard) => {
      guards.push(guardToPromiseFn(guard, to, from))
    })
  }

  const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(
    null,
    to,
    from
  )

  guards.push(canceledNavigationCheck)

  // run the queue of per route beforeRouteLeave guards
  return (
    runGuardQueue(guards)
      .then(() => {
        // check global guards beforeEach
        guards = []
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from))
        }
        guards.push(canceledNavigationCheck)

        return runGuardQueue(guards)
      })
      .then(() => {
        // check in components beforeRouteUpdate
        guards = extractComponentsGuards(
          updatingRecords,
          "beforeRouteUpdate",
          to,
          from
        )

        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from))
          })
        }
        guards.push(canceledNavigationCheck)

        // run the queue of per route beforeEnter guards
        return runGuardQueue(guards)
      })
      .then(() => {
        // check the route beforeEnter
        guards = []
        for (const record of enteringRecords) {
          // do not trigger beforeEnter on reused views
          if (record.beforeEnter) {
            if (isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from))
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from))
            }
          }
        }
        guards.push(canceledNavigationCheck)

        // run the queue of per route beforeEnter guards
        return runGuardQueue(guards)
      })
      .then(() => {
        // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>

        // clear existing enterCallbacks, these are added by extractComponentsGuards
        to.matched.forEach((record) => (record.enterCallbacks = {}))

        // check in-component beforeRouteEnter
        guards = extractComponentsGuards(
          enteringRecords,
          "beforeRouteEnter",
          to,
          from,
          runWithContext
        )
        guards.push(canceledNavigationCheck)

        // run the queue of per route beforeEnter guards
        return runGuardQueue(guards)
      })
      .then(() => {
        // check global guards beforeResolve
        guards = []
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from))
        }
        guards.push(canceledNavigationCheck)

        return runGuardQueue(guards)
      })
      // catch any navigation canceled
      .catch((err) =>
        isNavigationFailure(err, ErrorTypes.NAVIGATION_CANCELLED)
          ? err
          : Promise.reject(err)
      )
  )
}
```

`pushWithRedirect` => `triggerAfterEach` => `afterGuards.list()`

```ts
// 【packages/router/src/router.ts】
function triggerAfterEach(
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded,
  failure?: NavigationFailure | void
): void {
  // navigation is confirmed, call afterGuards
  // TODO: wrap with error handlers
  afterGuards
    .list()
    .forEach((guard) => runWithContext(() => guard(to, from, failure)))
}
```

假设从路由 A 跳转到路由 B，且两者使用不同组件：

1. 全局 `beforeEach` →
2. 组件 A 的 `beforeRouteLeave` →
3. 全局 `beforeResolve` →
4. 全局 `afterEach` →
5. 组件 B 的 `beforeRouteEnter`（在导航确认后触发，可访问组件实例）

### router.addRoute() & router.removeRoute() & router.clearRoutes() & router.hasRoute() & router.getRoutes()

这一系列路由相关 API 有一个很重要的前置对象就是 `matcher`，在 `createRouter` 方法的第一步就已经创建，它主要的任务就是在用户提供的 `routes` 中去寻找、添加、删除路由：

```ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
})

// 【packages/router/src/router.ts】
export function createRouter(options: RouterOptions): Router {
  // 【routes是用户提供的一个数组，包含了路径和对应的组件信息等，matcher将routes存储于matcherMap中，然后在这个matcherMap中去匹配寻找、添加、删除等操作】
  const matcher = createRouterMatcher(options.routes, options)

  //【...省略】
  const router: Router = {
    //【...省略】

    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,

    //【...省略】
  }
  return router
}

// 【packages/router/src/matcher/index.ts】
/**
 * Creates a Router Matcher.
 *
 * @internal
 * @param routes - array of initial routes
 * @param globalOptions - global route options
 */
export function createRouterMatcher(
  routes: Readonly<RouteRecordRaw[]>,
  globalOptions: PathParserOptions
): RouterMatcher {
  // normalized ordered array of matchers
  const matchers: RouteRecordMatcher[] = []
  const matcherMap = new Map<
    NonNullable<RouteRecordNameGeneric>,
    RouteRecordMatcher
  >()
  globalOptions = mergeOptions(
    { strict: false, end: true, sensitive: false } as PathParserOptions,
    globalOptions
  )

  function getRecordMatcher(name: NonNullable<RouteRecordNameGeneric>) {
    return matcherMap.get(name)
  }

  function addRoute(
    record: RouteRecordRaw,
    parent?: RouteRecordMatcher,
    originalRecord?: RouteRecordMatcher
  ) {
    // used later on to remove by name
    const isRootAdd = !originalRecord
    const mainNormalizedRecord = normalizeRouteRecord(record)
    if (__DEV__) {
      checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent)
    }
    // we might be the child of an alias
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record
    const options: PathParserOptions = mergeOptions(globalOptions, record)
    // generate an array of records to correctly handle aliases
    const normalizedRecords: RouteRecordNormalized[] = [mainNormalizedRecord]
    if ("alias" in record) {
      const aliases =
        typeof record.alias === "string" ? [record.alias] : record.alias!
      for (const alias of aliases) {
        normalizedRecords.push(
          // we need to normalize again to ensure the `mods` property
          // being non enumerable
          normalizeRouteRecord(
            assign({}, mainNormalizedRecord, {
              // this allows us to hold a copy of the `components` option
              // so that async components cache is hold on the original record
              components: originalRecord
                ? originalRecord.record.components
                : mainNormalizedRecord.components,
              path: alias,
              // we might be the child of an alias
              aliasOf: originalRecord
                ? originalRecord.record
                : mainNormalizedRecord,
              // the aliases are always of the same kind as the original since they
              // are defined on the same record
            })
          )
        )
      }
    }

    let matcher: RouteRecordMatcher
    let originalMatcher: RouteRecordMatcher | undefined

    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord
      // Build up the path for nested routes if the child isn't an absolute
      // route. Only add the / delimiter if the child path isn't empty and if the
      // parent path doesn't have a trailing slash
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path
        const connectingSlash =
          parentPath[parentPath.length - 1] === "/" ? "" : "/"
        normalizedRecord.path =
          parent.record.path + (path && connectingSlash + path)
      }

      if (__DEV__ && normalizedRecord.path === "*") {
        throw new Error(
          'Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
            "See more at https://router.vuejs.org/guide/migration/#Removed-star-or-catch-all-routes."
        )
      }

      // create the object beforehand, so it can be passed to children
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options)

      if (__DEV__ && parent && path[0] === "/")
        checkMissingParamsInAbsolutePath(matcher, parent)

      // if we are an alias we must tell the original record that we exist,
      // so we can be removed
      if (originalRecord) {
        originalRecord.alias.push(matcher)
        if (__DEV__) {
          checkSameParams(originalRecord, matcher)
        }
      } else {
        // otherwise, the first record is the original and others are aliases
        originalMatcher = originalMatcher || matcher
        if (originalMatcher !== matcher) originalMatcher.alias.push(matcher)

        // remove the route if named and only for the top record (avoid in nested calls)
        // this works because the original record is the first one
        if (isRootAdd && record.name && !isAliasRecord(matcher)) {
          if (__DEV__) {
            checkSameNameAsAncestor(record, parent)
          }
          removeRoute(record.name)
        }
      }

      // Avoid adding a record that doesn't display anything. This allows passing through records without a component to
      // not be reached and pass through the catch all route
      if (isMatchable(matcher)) {
        insertMatcher(matcher)
      }

      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children
        for (let i = 0; i < children.length; i++) {
          addRoute(
            children[i],
            matcher,
            originalRecord && originalRecord.children[i]
          )
        }
      }

      // if there was no original record, then the first one was not an alias and all
      // other aliases (if any) need to reference this record when adding children
      originalRecord = originalRecord || matcher

      // TODO: add normalized records for more flexibility
      // if (parent && isAliasRecord(originalRecord)) {
      //   parent.children.push(originalRecord)
      // }
    }

    return originalMatcher
      ? () => {
          // since other matchers are aliases, they should be removed by the original matcher
          removeRoute(originalMatcher!)
        }
      : noop
  }

  function removeRoute(
    matcherRef: NonNullable<RouteRecordNameGeneric> | RouteRecordMatcher
  ) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef)
      if (matcher) {
        matcherMap.delete(matcherRef)
        matchers.splice(matchers.indexOf(matcher), 1)
        matcher.children.forEach(removeRoute)
        matcher.alias.forEach(removeRoute)
      }
    } else {
      const index = matchers.indexOf(matcherRef)
      if (index > -1) {
        matchers.splice(index, 1)
        if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name)
        matcherRef.children.forEach(removeRoute)
        matcherRef.alias.forEach(removeRoute)
      }
    }
  }

  function getRoutes() {
    return matchers
  }

  function insertMatcher(matcher: RouteRecordMatcher) {
    const index = findInsertionIndex(matcher, matchers)
    matchers.splice(index, 0, matcher)
    // only add the original record to the name map
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher)
  }

  function resolve(
    location: Readonly<MatcherLocationRaw>,
    currentLocation: Readonly<MatcherLocation>
  ): MatcherLocation {
    let matcher: RouteRecordMatcher | undefined
    let params: PathParams = {}
    let path: MatcherLocation["path"]
    let name: MatcherLocation["name"]

    if ("name" in location && location.name) {
      matcher = matcherMap.get(location.name)

      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
        })

      // warn if the user is passing invalid params so they can debug it better when they get removed
      if (__DEV__) {
        const invalidParams: string[] = Object.keys(
          location.params || {}
        ).filter(
          (paramName) => !matcher!.keys.find((k) => k.name === paramName)
        )

        if (invalidParams.length) {
          warn(
            `Discarded invalid param(s) "${invalidParams.join(
              '", "'
            )}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`
          )
        }
      }

      name = matcher.record.name
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys
            .filter((k) => !k.optional)
            .concat(
              matcher.parent
                ? matcher.parent.keys.filter((k) => k.optional)
                : []
            )
            .map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location.params &&
          paramsFromLocation(
            location.params,
            matcher.keys.map((k) => k.name)
          )
      )
      // throws if cannot be stringified
      path = matcher.stringify(params)
    } else if (location.path != null) {
      // no need to resolve the path with the matcher as it was provided
      // this also allows the user to control the encoding
      path = location.path

      if (__DEV__ && !path.startsWith("/")) {
        warn(
          `The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://github.com/vuejs/router/issues/new/choose.`
        )
      }

      matcher = matchers.find((m) => m.re.test(path))
      // matcher should have a value after the loop

      if (matcher) {
        // we know the matcher works because we tested the regexp
        params = matcher.parse(path)!
        name = matcher.record.name
      }
      // location is a relative path
    } else {
      // match by name or path of current route
      matcher = currentLocation.name
        ? matcherMap.get(currentLocation.name)
        : matchers.find((m) => m.re.test(currentLocation.path))
      if (!matcher)
        throw createRouterError<MatcherError>(ErrorTypes.MATCHER_NOT_FOUND, {
          location,
          currentLocation,
        })
      name = matcher.record.name
      // since we are navigating to the same location, we don't need to pick the
      // params like when `name` is provided
      params = assign({}, currentLocation.params, location.params)
      path = matcher.stringify(params)
    }

    const matched: MatcherLocation["matched"] = []
    let parentMatcher: RouteRecordMatcher | undefined = matcher
    while (parentMatcher) {
      // reversed order so parents are at the beginning

      matched.unshift(parentMatcher.record)
      parentMatcher = parentMatcher.parent
    }

    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched),
    }
  }

  // add initial routes
  routes.forEach((route) => addRoute(route))

  function clearRoutes() {
    matchers.length = 0
    matcherMap.clear()
  }

  return {
    addRoute,
    resolve,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher,
  }
}
```

`router.addRoute` 本质调用了 `matcher.addRoute`
`router.removeRoute` 本质调用了 `matcher.removeRoute`
`router.getRoutes` 本质调用了 `matcher.getRoutes()`
`router.hasRoute` 本质调用了 `matcher.getRecordMatcher()`
`router.clearRoutes` 本质调用了 `matcher.clearRoutes()`

```ts
// 【packages/router/src/router.ts】
function addRoute(
  parentOrRoute: NonNullable<RouteRecordNameGeneric> | RouteRecordRaw,
  route?: RouteRecordRaw
) {
  let parent: Parameters<(typeof matcher)["addRoute"]>[1] | undefined
  let record: RouteRecordRaw
  if (isRouteName(parentOrRoute)) {
    parent = matcher.getRecordMatcher(parentOrRoute)
    if (__DEV__ && !parent) {
      warn(
        `Parent route "${String(
          parentOrRoute
        )}" not found when adding child route`,
        route
      )
    }
    record = route!
  } else {
    record = parentOrRoute
  }

  return matcher.addRoute(record, parent)
}

function removeRoute(name: NonNullable<RouteRecordNameGeneric>) {
  const recordMatcher = matcher.getRecordMatcher(name)
  if (recordMatcher) {
    matcher.removeRoute(recordMatcher)
  } else if (__DEV__) {
    warn(`Cannot remove non-existent route "${String(name)}"`)
  }
}

function getRoutes() {
  return matcher.getRoutes().map((routeMatcher) => routeMatcher.record)
}

function hasRoute(name: NonNullable<RouteRecordNameGeneric>): boolean {
  return !!matcher.getRecordMatcher(name)
}
```

## route 实例

**当前路由**会被暴露为 `$route`，`route` 实例其实就是一个`ref`响应式对象，调用`shallowRef`处理 `START_LOCATION_NORMALIZED` 对象获得，初始化过程如下：

````ts
// 【packages/router/src/router.ts】
const currentRoute = shallowRef<RouteLocationNormalizedLoaded>(
  START_LOCATION_NORMALIZED
)
// 【packages/router/src/location.ts】
/**
 * Initial route location where the router is. Can be used in navigation guards
 * to differentiate the initial navigation.
 *
 * @example
 * ```js
 * import { START_LOCATION } from 'vue-router'
 *
 * router.beforeEach((to, from) => {
 *   if (from === START_LOCATION) {
 *     // initial navigation
 *   }
 * })
 * ```
 */
export const START_LOCATION_NORMALIZED: RouteLocationNormalizedLoaded = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: undefined,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: undefined,
}
````

## RouterLink

`RouterLink` 组件创建过程中会根据入参 `props` 调用 `useLink` 方法创建一个对应的 `link` 实例对象：

```ts
// 【packages/router/src/RouterLink.ts】
export const RouterLinkImpl = /*#__PURE__*/ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String as PropType<RouterLinkProps["ariaCurrentValue"]>,
      default: "page",
    },
  },

  useLink,

  setup(props, { slots }) {
    const link = reactive(useLink(props))
    const { options } = inject(routerKey)!

    const elClass = computed(() => ({
      [getLinkClass(
        props.activeClass,
        options.linkActiveClass,
        "router-link-active"
      )]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(
        props.exactActiveClass,
        options.linkExactActiveClass,
        "router-link-exact-active"
      )]: link.isExactActive,
    }))

    // 【实际渲染的是一个a链接，点击会调用link.navigate方法】
    return () => {
      const children = slots.default && preferSingleVNode(slots.default(link))
      return props.custom
        ? children
        : h(
            "a",
            {
              "aria-current": link.isExactActive
                ? props.ariaCurrentValue
                : null,
              href: link.href,
              // this would override user added attrs but Vue will still add
              // the listener, so we end up triggering both
              onClick: link.navigate,
              class: elClass.value,
            },
            children
          )
    }
  },
})
```

`useLink` 方法用于创建一个 `link` 对象，其中可以看到 `link.navigate` 实质上最终调用的是全局 `router` 实例的 `replace` 或者 `push` 方法

```ts
// 【packages/router/src/RouterLink.ts】
// TODO: we could allow currentRoute as a prop to expose `isActive` and
// `isExactActive` behavior should go through an RFC
/**
 * Returns the internal behavior of a {@link RouterLink} without the rendering part.
 *
 * @param props - a `to` location and an optional `replace` flag
 */
export function useLink<Name extends keyof RouteMap = keyof RouteMap>(
  props: UseLinkOptions<Name>
): UseLinkReturn<Name> {
  const router = inject(routerKey)!
  const currentRoute = inject(routeLocationKey)!

  let hasPrevious = false
  let previousTo: unknown = null

  const route = computed(() => {
    const to = unref(props.to)

    if (__DEV__ && (!hasPrevious || to !== previousTo)) {
      if (!isRouteLocation(to)) {
        if (hasPrevious) {
          warn(
            `Invalid value for prop "to" in useLink()\n- to:`,
            to,
            `\n- previous to:`,
            previousTo,
            `\n- props:`,
            props
          )
        } else {
          warn(
            `Invalid value for prop "to" in useLink()\n- to:`,
            to,
            `\n- props:`,
            props
          )
        }
      }

      previousTo = to
      hasPrevious = true
    }

    return router.resolve(to)
  })

  const activeRecordIndex = computed<number>(() => {
    const { matched } = route.value
    const { length } = matched
    const routeMatched: RouteRecord | undefined = matched[length - 1]
    const currentMatched = currentRoute.matched
    if (!routeMatched || !currentMatched.length) return -1
    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    )
    if (index > -1) return index
    // possible parent record
    const parentRecordPath = getOriginalPath(
      matched[length - 2] as RouteRecord | undefined
    )
    return (
      // we are dealing with nested routes
      length > 1 &&
        // if the parent and matched route have the same path, this link is
        // referring to the empty child. Or we currently are on a different
        // child of the same parent
        getOriginalPath(routeMatched) === parentRecordPath &&
        // avoid comparing the child with its parent
        currentMatched[currentMatched.length - 1].path !== parentRecordPath
        ? currentMatched.findIndex(
            isSameRouteRecord.bind(null, matched[length - 2])
          )
        : index
    )
  })

  const isActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      includesParams(currentRoute.params, route.value.params)
  )
  const isExactActive = computed<boolean>(
    () =>
      activeRecordIndex.value > -1 &&
      activeRecordIndex.value === currentRoute.matched.length - 1 &&
      isSameRouteLocationParams(currentRoute.params, route.value.params)
  )

  function navigate(
    e: MouseEvent = {} as MouseEvent
  ): Promise<void | NavigationFailure> {
    if (guardEvent(e)) {
      const p = router[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop)
      if (
        props.viewTransition &&
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        document.startViewTransition(() => p)
      }
      return p
    }
    return Promise.resolve()
  }

  // devtools only
  if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser) {
    const instance = getCurrentInstance()
    if (instance) {
      const linkContextDevtools: UseLinkDevtoolsContext = {
        route: route.value,
        isActive: isActive.value,
        isExactActive: isExactActive.value,
        error: null,
      }

      // @ts-expect-error: this is internal
      instance.__vrl_devtools = instance.__vrl_devtools || []
      // @ts-expect-error: this is internal
      instance.__vrl_devtools.push(linkContextDevtools)
      watchEffect(
        () => {
          linkContextDevtools.route = route.value
          linkContextDevtools.isActive = isActive.value
          linkContextDevtools.isExactActive = isExactActive.value
          linkContextDevtools.error = isRouteLocation(unref(props.to))
            ? null
            : 'Invalid "to" value'
        },
        { flush: "post" }
      )
    }
  }

  /**
   * NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
   */
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate,
  }
}
```

## RouterView

`RouterView` 组件主要是根据路径匹配对应的路由实例，获取对应需要展示的组件，然后将组件当做插槽内容渲染出来：

```ts
// 【packages/router/src/RouterView.ts】
export const RouterViewImpl = /*#__PURE__*/ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String as PropType<string>,
      default: "default",
    },
    route: Object as PropType<RouteLocationNormalizedLoaded>,
  },

  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },

  setup(props, { attrs, slots }) {
    __DEV__ && warnDeprecatedUsage()
    // 【获取当前路由route对象】
    const injectedRoute = inject(routerViewLocationKey)!
    const routeToDisplay = computed<RouteLocationNormalizedLoaded>(
      () => props.route || injectedRoute.value
    )
    const injectedDepth = inject(viewDepthKey, 0)
    // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
    // that are used to reuse the `path` property
    const depth = computed<number>(() => {
      let initialDepth = unref(injectedDepth)
      const { matched } = routeToDisplay.value
      let matchedRoute: RouteLocationMatched | undefined
      while (
        (matchedRoute = matched[initialDepth]) &&
        !matchedRoute.components
      ) {
        initialDepth++
      }
      return initialDepth
    })
    const matchedRouteRef = computed<RouteLocationMatched | undefined>(
      () => routeToDisplay.value.matched[depth.value]
    )

    provide(
      viewDepthKey,
      computed(() => depth.value + 1)
    )
    provide(matchedRouteKey, matchedRouteRef)
    provide(routerViewLocationKey, routeToDisplay)

    const viewRef = ref<ComponentPublicInstance>()
    // 【侦听器监听viewRef.value/matchedRouteRef.value/props.name】
    // watch at the same time the component instance, the route record we are
    // rendering, and the name
    watch(
      () => [viewRef.value, matchedRouteRef.value, props.name] as const,
      ([instance, to, name], [oldInstance, from, oldName]) => {
        // copy reused instances
        if (to) {
          // this will update the instance for new instances as well as reused
          // instances when navigating to a new route
          to.instances[name] = instance
          // the component instance is reused for a different route or name, so
          // we copy any saved update or leave guards. With async setup, the
          // mounting component will mount before the matchedRoute changes,
          // making instance === oldInstance, so we check if guards have been
          // added before. This works because we remove guards when
          // unmounting/deactivating components
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards
            }
          }
        }

        // trigger beforeRouteEnter next callbacks
        if (
          instance &&
          to &&
          // if there is no instance but to and from are the same this might be
          // the first visit
          (!from || !isSameRouteRecord(to, from) || !oldInstance)
        ) {
          ;(to.enterCallbacks[name] || []).forEach((callback) =>
            callback(instance)
          )
        }
      },
      { flush: "post" }
    )

    return () => {
      const route = routeToDisplay.value
      // we need the value at the time we render because when we unmount, we
      // navigated to a different location so the value is different
      const currentName = props.name
      const matchedRoute = matchedRouteRef.value
      // 【根据路径匹配到的路由对应的组件】
      const ViewComponent =
        matchedRoute && matchedRoute.components![currentName]

      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route })
      }

      // props from route configuration
      const routePropsOption = matchedRoute.props[currentName]
      const routeProps = routePropsOption
        ? routePropsOption === true
          ? route.params
          : typeof routePropsOption === "function"
          ? routePropsOption(route)
          : routePropsOption
        : null

      const onVnodeUnmounted: VNodeProps["onVnodeUnmounted"] = (vnode) => {
        // remove the instance reference to prevent leak
        if (vnode.component!.isUnmounted) {
          matchedRoute.instances[currentName] = null
        }
      }

      const component = h(
        ViewComponent,
        assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef,
        })
      )

      if (
        (__DEV__ || __FEATURE_PROD_DEVTOOLS__) &&
        isBrowser &&
        component.ref
      ) {
        // TODO: can display if it's an alias, its props
        const info: RouterViewDevtoolsContext = {
          depth: depth.value,
          name: matchedRoute.name,
          path: matchedRoute.path,
          meta: matchedRoute.meta,
        }

        const internalInstances = isArray(component.ref)
          ? component.ref.map((r) => r.i)
          : [component.ref.i]

        internalInstances.forEach((instance) => {
          // @ts-expect-error
          instance.__vrv_devtools = info
        })
      }

      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) ||
        component
      )
    }
  },
})
```

## History

`createWebHistory` 方法创建了一个 `routerHistory` 对象，用于后续操作，其中有两个重要的方法 `useHistoryStateNavigation` 和 `useHistoryListeners`：

```ts
// 【packages/router/src/history/html5.ts】
/**
 * Creates an HTML5 history. Most common history for single page applications.
 *
 * @param base -
 */
export function createWebHistory(base?: string): RouterHistory {
  base = normalizeBase(base)

  const historyNavigation = useHistoryStateNavigation(base)
  const historyListeners = useHistoryListeners(
    base,
    historyNavigation.state,
    historyNavigation.location,
    historyNavigation.replace
  )
  function go(delta: number, triggerListeners = true) {
    if (!triggerListeners) historyListeners.pauseListeners()
    history.go(delta)
  }

  const routerHistory: RouterHistory = assign(
    {
      // it's overridden right after
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base),
    },

    historyNavigation,
    historyListeners
  )

  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value,
  })

  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value,
  })

  return routerHistory
}
```

`useHistoryStateNavigation`返回对象有 `location`、`state`、`push`、`replace`，前面两个属性其实取自浏览器`window`对象，后面两个方法实质上是调用了`window.history`的 API 进行处理：

```ts
// 【packages/router/src/history/html5.ts】
function useHistoryStateNavigation(base: string) {
  const { history, location } = window

  // private variables
  const currentLocation: ValueContainer<HistoryLocation> = {
    value: createCurrentLocation(base, location),
  }
  const historyState: ValueContainer<StateEntry> = { value: history.state }
  // build current history entry as this is a fresh navigation
  if (!historyState.value) {
    changeLocation(
      currentLocation.value,
      {
        back: null,
        current: currentLocation.value,
        forward: null,
        // the length is off by one, we need to decrease it
        position: history.length - 1,
        replaced: true,
        // don't add a scroll as the user may have an anchor, and we want
        // scrollBehavior to be triggered without a saved position
        scroll: null,
      },
      true
    )
  }

  function changeLocation(
    to: HistoryLocation,
    state: StateEntry,
    replace: boolean
  ): void {
    /**
     * if a base tag is provided, and we are on a normal domain, we have to
     * respect the provided `base` attribute because pushState() will use it and
     * potentially erase anything before the `#` like at
     * https://github.com/vuejs/router/issues/685 where a base of
     * `/folder/#` but a base of `/` would erase the `/folder/` section. If
     * there is no host, the `<base>` tag makes no sense and if there isn't a
     * base tag we can just use everything after the `#`.
     */
    const hashIndex = base.indexOf("#")
    const url =
      hashIndex > -1
        ? (location.host && document.querySelector("base")
            ? base
            : base.slice(hashIndex)) + to
        : createBaseLocation() + base + to
    try {
      // BROWSER QUIRK
      // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
      history[replace ? "replaceState" : "pushState"](state, "", url)
      historyState.value = state
    } catch (err) {
      if (__DEV__) {
        warn("Error with push/replace State", err)
      } else {
        console.error(err)
      }
      // Force the navigation, this also resets the call count
      location[replace ? "replace" : "assign"](url)
    }
  }

  function replace(to: HistoryLocation, data?: HistoryState) {
    const state: StateEntry = assign(
      {},
      history.state,
      buildState(
        historyState.value.back,
        // keep back and forward entries but override current position
        to,
        historyState.value.forward,
        true
      ),
      data,
      { position: historyState.value.position }
    )

    changeLocation(to, state, true)
    currentLocation.value = to
  }

  function push(to: HistoryLocation, data?: HistoryState) {
    // Add to current entry the information of where we are going
    // as well as saving the current position
    const currentState = assign(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history.state as Partial<StateEntry> | null,
      {
        forward: to,
        scroll: computeScrollPosition(),
      }
    )

    if (__DEV__ && !history.state) {
      warn(
        `history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
          `history.replaceState(history.state, '', url)\n\n` +
          `You can find more information at https://router.vuejs.org/guide/migration/#Usage-of-history-state`
      )
    }

    changeLocation(currentState.current, currentState, true)

    const state: StateEntry = assign(
      {},
      buildState(currentLocation.value, to, null),
      { position: currentState.position + 1 },
      data
    )

    changeLocation(to, state, false)
    currentLocation.value = to
  }

  return {
    location: currentLocation,
    state: historyState,

    push,
    replace,
  }
}
```

`useHistoryListeners`

```ts
// 【packages/router/src/history/html5.ts】
function useHistoryListeners(
  base: string,
  historyState: ValueContainer<StateEntry>,
  currentLocation: ValueContainer<HistoryLocation>,
  replace: RouterHistory["replace"]
) {
  let listeners: NavigationCallback[] = []
  let teardowns: Array<() => void> = []
  // TODO: should it be a stack? a Dict. Check if the popstate listener
  // can trigger twice
  let pauseState: HistoryLocation | null = null

  const popStateHandler: PopStateListener = ({
    state,
  }: {
    state: StateEntry | null
  }) => {
    const to = createCurrentLocation(base, location)
    const from: HistoryLocation = currentLocation.value
    const fromState: StateEntry = historyState.value
    let delta = 0

    if (state) {
      currentLocation.value = to
      historyState.value = state

      // ignore the popstate and reset the pauseState
      if (pauseState && pauseState === from) {
        pauseState = null
        return
      }
      delta = fromState ? state.position - fromState.position : 0
    } else {
      replace(to)
    }

    // Here we could also revert the navigation by calling history.go(-delta)
    // this listener will have to be adapted to not trigger again and to wait for the url
    // to be updated before triggering the listeners. Some kind of validation function would also
    // need to be passed to the listeners so the navigation can be accepted
    // call all listeners
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      })
    })
  }

  function pauseListeners() {
    pauseState = currentLocation.value
  }

  function listen(callback: NavigationCallback) {
    // set up the listener and prepare teardown callbacks
    listeners.push(callback)

    const teardown = () => {
      const index = listeners.indexOf(callback)
      if (index > -1) listeners.splice(index, 1)
    }

    teardowns.push(teardown)
    return teardown
  }

  function beforeUnloadListener() {
    const { history } = window
    if (!history.state) return
    history.replaceState(
      assign({}, history.state, { scroll: computeScrollPosition() }),
      ""
    )
  }

  function destroy() {
    for (const teardown of teardowns) teardown()
    teardowns = []
    window.removeEventListener("popstate", popStateHandler)
    window.removeEventListener("beforeunload", beforeUnloadListener)
  }

  // set up the listeners and prepare teardown callbacks
  window.addEventListener("popstate", popStateHandler)
  // TODO: could we use 'pagehide' or 'visibilitychange' instead?
  // https://developer.chrome.com/blog/page-lifecycle-api/
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true,
  })

  return {
    pauseListeners,
    listen,
    destroy,
  }
}
```

## Hash

`createWebHashHistory`在处理完 `base` 之后同样进入 `createWebHistory` 方法：

````ts
// 【packages/router/src/history/hash.ts】
/**
 * Creates a hash history. Useful for web applications with no host (e.g. `file://`) or when configuring a server to
 * handle any URL is not possible.
 *
 * @param base - optional base to provide. Defaults to `location.pathname + location.search` If there is a `<base>` tag
 * in the `head`, its value will be ignored in favor of this parameter **but note it affects all the history.pushState()
 * calls**, meaning that if you use a `<base>` tag, it's `href` value **has to match this parameter** (ignoring anything
 * after the `#`).
 *
 * @example
 * ```js
 * // at https://example.com/folder
 * createWebHashHistory() // gives a url of `https://example.com/folder#`
 * createWebHashHistory('/folder/') // gives a url of `https://example.com/folder/#`
 * // if the `#` is provided in the base, it won't be added by `createWebHashHistory`
 * createWebHashHistory('/folder/#/app/') // gives a url of `https://example.com/folder/#/app/`
 * // you should avoid doing this because it changes the original url and breaks copying urls
 * createWebHashHistory('/other-folder/') // gives a url of `https://example.com/other-folder/#`
 *
 * // at file:///usr/etc/folder/index.html
 * // for locations with no `host`, the base is ignored
 * createWebHashHistory('/iAmIgnored') // gives a url of `file:///usr/etc/folder/index.html#`
 * ```
 */
export function createWebHashHistory(base?: string): RouterHistory {
  // Make sure this implementation is fine in terms of encoding, specially for IE11
  // for `file://`, directly use the pathname and ignore the base
  // location.pathname contains an initial `/` even at the root: `https://example.com`
  base = location.host ? base || location.pathname + location.search : ""
  // allow the user to provide a `#` in the middle: `/base/#/app`
  if (!base.includes("#")) base += "#"

  if (__DEV__ && !base.endsWith("#/") && !base.endsWith("#")) {
    warn(
      `A hash base must end with a "#":\n"${base}" should be "${base.replace(
        /#.*$/,
        "#"
      )}".`
    )
  }
  return createWebHistory(base)
}
````

## 参考资料

[Vue Router 入门](https://router.vuejs.org/zh/guide/)

[History](https://developer.mozilla.org/en-US/docs/Web/API/History)
