## Vue内置组件

### keep-alive

`<keep-alive>` 在 `created` 钩子里定义了 `this.cache` 和 `this.keys`，本质上它就是去缓存已经创建过的组件 `VNode`。它的 `props` 定义了 `include`，`exclude`，它们可以字符串或者表达式，`include` 表示只有匹配的组件会被缓存，而 `exclude` 表示任何匹配的组件都不会被缓存，`props` 还定义了 `max`，它表示缓存的大小，因为我们是缓存的 `VNode` 对象，它也会持有 `DOM`，当我们缓存很多的时候，会比较占用内存，所以该配置允许我们指定缓存大小。`<keep-alive>`代码在`src/core/components/keep-alive.js`：
```js
export default {
  name: 'keep-alive',
  abstract: true,
  //  入参include、exclude、max
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null) //存储组件vnode
    this.keys = [] //存储已缓存的所有组件key
  },

  destroyed () {
    // 删除缓存的内容
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    // 获取默认插槽内容，keep-alive只对包裹的第一个组件有效
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    // 根据入参include或exclude判断当前组件name是否符合条件
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      // 命中缓存-把当前key所示组件放到最后
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // 没有命中缓存，则把当前vnode加入
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        // 超出max就将队列最前面的删了
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true // 后续createComponent方法会用来判断是否从缓存拿组件实例
    }
    return vnode || (slot && slot[0])
  }
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

// keep-alive组件实例拿到cache, keys, _vnode，再根据filter函数判断，exclude的则调用pruneCacheEntry移除缓存
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// 移除缓存，除了处理cache对象和keys数组，还要将之前缓存的vnode组件实例调用$destroy()方法
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

通过`<keep-alive>`组件包裹并进行缓存之后，是如何直接使用缓存的呢？在组件进行首次渲染或者更新时，我们都会走到`patch`过程中的`createComponent`方法如下：
```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data;
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance) && i.keepAlive; // vnode.componentInstance是否存在以及vnode.data.keepAlive是否为真
      if (isDef((i = i.hook)) && isDef((i = i.init))) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true;
      }
    }
}

function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i
  // hack for #4339: a reactivated component with inner transition
  // does not trigger because the inner node's created hooks are not called
  // again. It's not ideal to involve module-specific logic in here but
  // there doesn't seem to be a better way to do it.
  let innerNode = vnode
  while (innerNode.componentInstance) {
    innerNode = innerNode.componentInstance._vnode
    if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
      for (i = 0; i < cbs.activate.length; ++i) {
        cbs.activate[i](emptyNode, innerNode)
      }
      insertedVnodeQueue.push(innerNode)
      break
    }
  }
  // unlike a newly created component,
  // a reactivated keep-alive component doesn't insert itself
  insert(parentElm, vnode.elm, refElm)
}
```

首次渲染的时候，`vnode.componentInstance` 为 `undefined`，`vnode.data.keepAlive` 为 `true`，因为它的父组件 `<keep-alive>` 的 `render` 函数会先执行，那么该 `vnode` 缓存到内存中，并且设置 `vnode.data.keepAlive` 为 `true`，因此首次渲染时 `isReactivated` 为 `false`，那么走正常的 `init` 的钩子函数执行组件的 `mount`和普通的组件渲染没有区别。

再次渲染时回命中缓存渲染，`<keep-alive>` 组件本质上支持了 `slot`，所以它执行 `prepatch` 的时候，需要对自己的 `children`，也就是这些 `slots` 做重新解析，并触发 `<keep-alive>` 组件实例 `$forceUpdate` 逻辑，也就是重新执行 `<keep-alive>` 的 `render` 方法，这个时候如果它包裹的第一个组件 `vnode` 命中缓存，则直接返回`this.cache`缓存中的 `vnode.componentInstance`。

总结：通过分析我们知道了 `<keep-alive>` 组件是一个抽象组件，它的实现通过自定义 `render` 函数并且利用了插槽，`<keep-alive>` 缓存的是 `vnode`，了解组件包裹的子元素——也就是插槽是如何做更新的。且在 `patch` 过程中对于已缓存的组件不会执行 `mounted`，所以不会有一般的组件的生命周期函数但是又提供了 `activated` 和 `deactivated` 钩子函数。另外我们还知道了 `<keep-alive>` 的 `props` 除了 `include` 和 `exclude` 还有 `max`，它能控制我们缓存的个数。