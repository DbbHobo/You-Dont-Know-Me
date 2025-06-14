# setup()

## 定义

`setup()` 钩子是在组件中使用组合式 API 的入口，通常只在以下情况下使用：

- 需要在非单文件组件中使用组合式 API 时
- 需要在基于选项式 API 的组件中集成基于组合式 API 的代码时

`<script setup>` 是在**单文件组件 (SFC)**中使用组合式 API 的编译时语法糖。当同时使用 SFC 与组合式 API 时该语法是默认推荐。相比于普通的 `<script>` 语法，它具有更多优势：

- 更少的样板内容，更简洁的代码
- 能够使用纯 TypeScript 声明 props 和自定义事件
- 更好的运行时性能 (其模板会被编译成同一作用域内的渲染函数，避免了渲染上下文代理对象)
- 更好的 IDE 类型推导性能 (减少了语言服务器从代码中抽取类型的工作)

## 具体使用

- 要启用该语法，需要在 `<script>` 代码块上添加 setup attribute

```vue
<script setup>
console.log("hello script setup")
</script>
```

- 当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 导入的内容) 都能在模板中直接使用

```vue
<script setup>
// 导入的函数
import { capitalize } from "./helpers"
// 组件
import MyComponent from "./MyComponent.vue"
// 动态组件
import Foo from "./Foo.vue"
import Bar from "./Bar.vue"
// 命名空间组件
import * as Form from "./form-components"

// 变量
const msg = "Hello!"

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>

  <!-- 导入的函数 -->
  <div>{{ capitalize("hello") }}</div>

  <!-- 组件 -->
  <MyComponent />

  <!-- 动态组件 -->
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />

  <!-- 命名空间组件 -->
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

- 为了在声明 `props` 和 `emits` 选项时获得完整的类型推导支持，我们可以使用 `defineProps` 和 `defineEmits` API，它们将自动地在 `<script setup>` 中可用

```vue
<script setup>
const props = defineProps({
  foo: String,
})

const emit = defineEmits(["change", "delete"])
</script>
```

## 源码入口

前文中在分析组件化时，组件构造有三个重要步骤，其中第二步就是执行组件的 `setup()` 钩子并确定 `render` 函数。此处执行 `setup()` 是由组件在非单文件组件中通过组合式 `API` 写的 `setup()` 钩子。在 `setup()` 函数中返回的对象会暴露给模板和组件实例，其他的选项也可以通过组件实例来获取 `setup()` 暴露的属性。在单文件组件中使用`<script setup>`也是同样的逻辑，`<script setup>`中的内容会提取当做`setup()`执行。

`mountComponent` => `setupComponent(instance)` => `setupStatefulComponent` => `const setupResult = callWithErrorHandling(setup,...)` + `handleSetupResult` + `finishComponentSetup`

```ts
// 【packages/runtime-core/src/renderer.ts】
const mountComponent: MountComponentFn = (
  initialVNode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  // 【1.创建组件实例】
  const instance: ComponentInternalInstance =
    compatMountInstance ||
    (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    ))

  // 【2.初始化props、slots，调用setup()】
  setupComponent(instance)

  // 【3.构建render effect】
  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  )
}
// 【packages/runtime-core/src/component.ts】
//【setupComponent入参是当前组件实例instance，初始化有状态组件、props、slots，确定组件render函数】
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children } = instance.vnode
  // 【判断组件ShapeFlags是否是STATEFUL_COMPONENT】
  const isStateful = isStatefulComponent(instance)
  // 【处理props和slots】
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  // 【STATEFUL_COMPONENT组件调用setupStatefulComponent初始化】
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}

function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  // 【...省略】

  // 0. create render proxy property access cache
  instance.accessCache = Object.create(null)
  // 1. create public instance / render proxy
  // also mark it raw so it's never observed
  //【将一个对象标记为不可被转为代理，返回该对象本身】
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))

  // 【...省略】

  // 2. call setup()
  // 【提取setup并通过callWithErrorHandling调用setup】
  const { setup } = Component
  if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)
    // 【currentInstance设置当前正在处理的实例，停止依赖收集，调用setup回调返回setupResult】
    setCurrentInstance(instance)
    pauseTracking()
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    // 【恢复依赖收集，currentInstance去除当前正在处理的实例】
    resetTracking()
    unsetCurrentInstance()

    // 【若setupResult是promise，用then方法回调unsetCurrentInstance】
    // 【否则调用handleSetupResult处理setupResult】
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance)
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult
          .then((resolvedResult: unknown) => {
            handleSetupResult(instance, resolvedResult, isSSR)
          })
          .catch((e) => {
            handleError(e, instance, ErrorCodes.SETUP_FUNCTION)
          })
      } else if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult

        // 【...省略】
      } else if (__DEV__) {
        // 【...省略】
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}

// 【setup返回可以是对象或者渲染函数】
// 【如果返回的是渲染函数，直接作为实例的render方法】
// 【如果返回的是对象，调用proxyRefs将对象变为响应式对象，并赋值给实例的setupState属性】
export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown,
  isSSR: boolean
) {
  if (isFunction(setupResult)) {
    // setup returned an inline render function
    if (__SSR__ && (instance.type as ComponentOptions).__ssrInlineRender) {
      // when the function's name is `ssrRender` (compiled by SFC inline mode),
      // set it as ssrRender instead.
      instance.ssrRender = setupResult
    } else {
      instance.render = setupResult as InternalRenderFunction
    }
  } else if (isObject(setupResult)) {
    // 【...省略】

    instance.setupState = proxyRefs(setupResult)

    // 【...省略】
  } else if (__DEV__ && setupResult !== undefined) {
    // 【...省略】
  }
  finishComponentSetup(instance, isSSR)
}

// 【当前实例的render如果还不存在，通过template编译成render方法】
// 【Component.render = compile(template, finalCompilerOptions)】
// 【instance.render = (Component.render || NOOP) as InternalRenderFunction】
export function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean,
  skipOptions?: boolean
) {
  const Component = instance.type as ComponentOptions

  // 【...省略】

  // template / render function normalization
  // could be already set when returned from setup()
  if (!instance.render) {
    // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation
    // is done by server-renderer
    if (!isSSR && compile && !Component.render) {
      const template =
        (__COMPAT__ &&
          instance.vnode.props &&
          instance.vnode.props["inline-template"]) ||
        Component.template ||
        resolveMergedOptions(instance).template
      if (template) {
        // 【...省略】

        const { isCustomElement, compilerOptions } = instance.appContext.config
        const { delimiters, compilerOptions: componentCompilerOptions } =
          Component
        const finalCompilerOptions: CompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters,
            },
            compilerOptions
          ),
          componentCompilerOptions
        )

        // 【...省略】

        // 【如果setup()返回的并非render函数，那就调用compile编译template生成render函数】
        Component.render = compile(template, finalCompilerOptions)

        // 【...省略】
      }
    }

    instance.render = (Component.render || NOOP) as InternalRenderFunction

    // for runtime-compiled render functions using `with` blocks, the render
    // proxy used needs a different `has` handler which is more performant and
    // also only allows a whitelist of globals to fallthrough.
    if (installWithProxy) {
      installWithProxy(instance)
    }
  }

  // 【...省略】
}
```

这个步骤完成了几件比较重要的事情首先处理了`props`和`slots`，然后调用了`setup()`并处理返回内容，根据返回内容确定组件的`render`函数由`setup`返回还是由`template`编译成。接下来就看一下里面的细节：

<!-- TODO -->

### props

```ts
// 【packages/runtime-core/src/componentProps.ts】
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number, // result of bitwise flag comparison
  isSSR = false
) {
  const props: Data = {}
  const attrs: Data = {}
  def(attrs, InternalObjectKey, 1)

  instance.propsDefaults = Object.create(null)

  setFullProps(instance, rawProps, props, attrs)

  // ensure all declared prop keys are present
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined
    }
  }

  // validation
  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }

  if (isStateful) {
    // stateful
    // 【将props添加到组件实例的props属性上】
    instance.props = isSSR ? props : shallowReactive(props)
  } else {
    if (!instance.type.props) {
      // functional w/ optional props, props === attrs
      instance.props = attrs
    } else {
      // functional w/ declared props
      instance.props = props
    }
  }
  // 【将attrs添加到组件实例的attrs属性上】
  instance.attrs = attrs
}

function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data
) {
  const [options, needCastKeys] = instance.propsOptions
  let hasAttrsChanged = false
  let rawCastValues: Data | undefined
  if (rawProps) {
    for (let key in rawProps) {
      // key, ref are reserved and never passed down
      if (isReservedProp(key)) {
        continue
      }

      if (__COMPAT__) {
        if (key.startsWith("onHook:")) {
          softAssertCompatEnabled(
            DeprecationTypes.INSTANCE_EVENT_HOOKS,
            instance,
            key.slice(2).toLowerCase()
          )
        }
        if (key === "inline-template") {
          continue
        }
      }

      const value = rawProps[key]
      // prop option names are camelized during normalization, so to support
      // kebab -> camel conversion here we need to camelize the key.
      let camelKey
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value
        } else {
          ;(rawCastValues || (rawCastValues = {}))[camelKey] = value
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        // Any non-declared (either as a prop or an emitted event) props are put
        // into a separate `attrs` object for spreading. Make sure to preserve
        // original key casing
        if (__COMPAT__) {
          if (isOn(key) && key.endsWith("Native")) {
            key = key.slice(0, -6) // remove Native postfix
          } else if (shouldSkipAttr(key, instance)) {
            continue
          }
        }
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value
          hasAttrsChanged = true
        }
      }
    }
  }

  if (needCastKeys) {
    const rawCurrentProps = toRaw(props)
    const castValues = rawCastValues || EMPTY_OBJ
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      props[key] = resolvePropValue(
        options!,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      )
    }
  }

  return hasAttrsChanged
}
```

```ts
export function updateProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  rawPrevProps: Data | null,
  optimized: boolean
): void {
  const {
    props,
    attrs,
    vnode: { patchFlag },
  } = instance
  const rawCurrentProps = toRaw(props)
  const [options] = instance.propsOptions
  let hasAttrsChanged = false

  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(__DEV__ && isInHmrContext(instance)) &&
    (optimized || patchFlag > 0) &&
    !(patchFlag & PatchFlags.FULL_PROPS)
  ) {
    if (patchFlag & PatchFlags.PROPS) {
      // Compiler-generated props & no keys change, just set the updated
      // the props.
      const propsToUpdate = instance.vnode.dynamicProps!
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i]
        // skip if the prop key is a declared emit event listener
        if (isEmitListener(instance.emitsOptions, key)) {
          continue
        }
        // PROPS flag guarantees rawProps to be non-null
        const value = rawProps![key]
        if (options) {
          // attr / props separation was done on init and will be consistent
          // in this code path, so just check if attrs have it.
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value
              hasAttrsChanged = true
            }
          } else {
            const camelizedKey = camelize(key)
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false /* isAbsent */
            )
          }
        } else {
          if (__COMPAT__) {
            if (isOn(key) && key.endsWith("Native")) {
              key = key.slice(0, -6) // remove Native postfix
            } else if (shouldSkipAttr(key, instance)) {
              continue
            }
          }
          if (value !== attrs[key]) {
            attrs[key] = value
            hasAttrsChanged = true
          }
        }
      }
    }
  } else {
    // full props update.
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true
    }
    // in case of dynamic props, check if we need to delete keys from
    // the props object
    let kebabKey: string
    for (const key in rawCurrentProps) {
      if (
        !rawProps ||
        // for camelCase
        (!hasOwn(rawProps, key) &&
          // it's possible the original props was passed in as kebab-case
          // and converted to camelCase (#955)
          ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey)))
      ) {
        if (options) {
          if (
            rawPrevProps &&
            // for camelCase
            (rawPrevProps[key] !== undefined ||
              // for kebab-case
              rawPrevProps[kebabKey!] !== undefined)
          ) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              undefined,
              instance,
              true /* isAbsent */
            )
          }
        } else {
          delete props[key]
        }
      }
    }
    // in the case of functional component w/o props declaration, props and
    // attrs point to the same object so it should already have been updated.
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (
          !rawProps ||
          (!hasOwn(rawProps, key) &&
            (!__COMPAT__ || !hasOwn(rawProps, key + "Native")))
        ) {
          delete attrs[key]
          hasAttrsChanged = true
        }
      }
    }
  }

  // trigger updates for $attrs in case it's used in component slots
  if (hasAttrsChanged) {
    trigger(instance.attrs, TriggerOpTypes.SET, "")
  }

  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }
}
```

### slots 插槽

```ts
// 【packages/runtime-core/src/apiSetupHelpers.ts】
export function useSlots(): SetupContext["slots"] {
  return getContext().slots
}

// 【packages/runtime-core/src/componentSlots.ts】
export const initSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren
) => {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    const type = (children as RawSlots)._
    if (type) {
      // users can get the shallow readonly version of the slots object through `this.$slots`,
      // we should avoid the proxy object polluting the slots of the internal instance
      instance.slots = toRaw(children as InternalSlots)
      // make compiler marker non-enumerable
      def(children as InternalSlots, "_", type)
    } else {
      normalizeObjectSlots(
        children as RawSlots,
        (instance.slots = {}),
        instance
      )
    }
  } else {
    instance.slots = {}
    if (children) {
      normalizeVNodeSlots(instance, children)
    }
  }
  def(instance.slots, InternalObjectKey, 1)
}
```

```ts
// 【packages/runtime-core/src/componentSlots.ts】
export const updateSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
  optimized: boolean
): void => {
  const { vnode, slots } = instance
  let needDeletionCheck = true
  let deletionComparisonTarget = EMPTY_OBJ
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    const type = (children as RawSlots)._
    if (type) {
      // compiled slots.
      if (__DEV__ && isHmrUpdating) {
        // Parent was HMR updated so slot content may have changed.
        // force update slots and mark instance for hmr as well
        assignSlots(slots, children as Slots, optimized)
        trigger(instance, TriggerOpTypes.SET, "$slots")
      } else if (optimized && type === SlotFlags.STABLE) {
        // compiled AND stable.
        // no need to update, and skip stale slots removal.
        needDeletionCheck = false
      } else {
        // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
        // normalization.
        assignSlots(slots, children as Slots, optimized)
      }
    } else {
      needDeletionCheck = !(children as RawSlots).$stable
      normalizeObjectSlots(children as RawSlots, slots, instance)
    }
    deletionComparisonTarget = children as RawSlots
  } else if (children) {
    // non slot object children (direct value) passed to a component
    normalizeVNodeSlots(instance, children)
    deletionComparisonTarget = { default: 1 }
  }

  // delete stale slots
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key]
      }
    }
  }
}
```

### attributes 透传

```ts
// 【packages/runtime-core/src/apiSetupHelpers.ts】
export function useAttrs(): SetupContext["attrs"] {
  return getContext().attrs
}

function getContext(): SetupContext {
  const i = getCurrentInstance()!
  if (__DEV__ && !i) {
    warn(`useContext() called without active instance.`)
  }
  return i.setupContext || (i.setupContext = createSetupContext(i))
}
```

### provide/inject 依赖注入

- `provide`：提供一个值，可以被后代组件注入。
- `inject`：注入一个由**祖先组件**或**整个应用** (通过 `app.provide()`) 提供的值。

本质就是把数据挂载在当前组件实例 `currentInstance` 上或者整个应用实例 `app` 上，使用时注入，注入从祖先组件逐步往上寻找。

```ts
export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    // 【...省略】

    const context = createAppContext()
    const installedPlugins = new WeakSet()
    const pluginCleanupFns: Array<() => any> = []
    let isMounted = false

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
        // 【...省略】
      },

      use(plugin: Plugin, ...options: any[]) {
        // 【...省略】
      },

      mixin(mixin: ComponentOptions) {
        // 【...省略】
      },

      component(name: string, component?: Component): any {
        // 【...省略】
      },

      directive(name: string, directive?: Directive) {
        // 【...省略】
      },

      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        namespace?: boolean | ElementNamespace
      ): any {
        // 【...省略】
      },

      onUnmount(cleanupFn: () => void) {
        // 【...省略】
      },

      unmount() {
        // 【...省略】
      },
      // 【App实例上注入】
      provide(key, value) {
        if (__DEV__ && (key as string | symbol) in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". ` +
              `It will be overwritten with the new value.`
          )
        }

        context.provides[key as string | symbol] = value

        return app
      },

      runWithContext(fn) {
        // 【...省略】
      },
    })

    // 【...省略】

    return app
  }
}
// 【packages/runtime-core/src/apiInject.ts】
export function provide<T, K = InjectionKey<T> | string | number>(
  key: K,
  value: K extends InjectionKey<infer V> ? V : T
): void {
  if (!currentInstance) {
    if (__DEV__) {
      warn(`provide() can only be used inside setup().`)
    }
  } else {
    let provides = currentInstance.provides
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // TS doesn't allow symbol as index type
    provides[key as string] = value
  }
}

export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance

  // also support looking up from app-level provides w/ `app.runWithContext()`
  if (instance || currentApp) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    // #11488, in a nested createApp, prioritize using the provides from currentApp
    const provides = currentApp
      ? currentApp._context.provides
      : instance
      ? instance.parent == null
        ? instance.vnode.appContext && instance.vnode.appContext.provides
        : instance.parent.provides
      : undefined

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance && instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
```

## 总结

## 参考资料

[组合式 API：`setup()`](https://cn.vuejs.org/api/composition-api-setup.html)

[单文件组件`<script setup>`](https://cn.vuejs.org/api/sfc-script-setup.html)

[Props](https://cn.vuejs.org/guide/components/props.html)

[插槽 Slots](https://cn.vuejs.org/guide/components/slots.html)

[透传 Attributes](https://cn.vuejs.org/guide/components/attrs.html)

[依赖注入](https://cn.vuejs.org/guide/components/provide-inject.html)
