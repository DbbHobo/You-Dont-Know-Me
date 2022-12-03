# Vue 生命周期

每个 `Vue` 实例在被创建之前都要经过一系列的初始化过程。例如需要设置数据监听、编译模板、挂载实例到 DOM、在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，给予用户机会在一些特定的场景下添加他们自己的代码。

最终执行生命周期的函数都是调用 `callHook` 方法，它的定义在 `src/core/instance/lifecycle` 中：

```js
export function callHook(vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, `${hook} hook`);
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit("hook:" + hook);
  }
  popTarget();
}
```

### beforeCreate & created

`beforeCreate` 和 `created` 函数都是在**实例化 Vue** 的阶段，在 `_init` 方法中执行的，它的定义在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  callHook(vm, "beforeCreate");
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, "created");
  // ...
};
```

`beforeCreate` 和 `created` 的钩子调用是在 `initState` `的前后，initState` 的作用是初始化 `props`、`data`、`methods`、`watch`、`computed` 等属性。那么 `beforeCreate` 的钩子函数中就不能获取到 `props`、`data` 中定义的值，也不能调用 `methods` 中定义的函数。在这俩个钩子函数执行的时候，并没有渲染 DOM，所以我们也不能够访问 DOM。

### beforeMount & mounted

`beforeMount` 钩子函数发生在 `mount`动作之前，也就是 **DOM 挂载**之前，它的调用时机是在 `mountComponent` 函数中，定义在 `src/core/instance/lifecycle.js` 中：

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  // ...
  callHook(vm, "beforeMount");

  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

执行 `vm._render()` 函数渲染 `VNode` 之前，执行了 `beforeMount` 钩子函数，在执行完 `vm._update()` 把 `VNode` patch 到真实 DOM 后，执行 `mounted` 钩子。

其中，`mount` 挂载过程分为两种情况，`vm.$vnode` 如果为 null，则表明这不是一次组件的初始化过程，而是我们通过外部 `new Vue` 初始化过程。然后就是组件的挂载过程，组件的 `VNode` patch 到 DOM 后，会执行 `invokeInsertHook` 函数，把 `insertedVnodeQueue` 里保存的钩子函数依次执行一遍，它的定义在 `src/core/vdom/patch.js` 中：

```js
function invokeInsertHook(vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue;
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i]);
    }
  }
}
```

该函数会执行 `insert` 这个钩子函数，对于组件而言，`insert` 钩子函数的定义在 `src/core/vdom/create-component.js` 中的 `componentVNodeHooks` 中：

```js
const componentVNodeHooks = {
  // ...
  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    // ...
  },
};
```

每个子组件都是在这个钩子函数中执行 `mounted` 钩子函数，并且我们之前分析过，`insertedVnodeQueue` 的添加顺序是**先子后父**，所以对于同步渲染的子组件而言，`mounted` 钩子函数的执行顺序也是**先子后父**。

### beforeUpdate & updated

`beforeUpdate` 和 `updated` 的钩子函数执行时机都应该是在**数据更新**的时候。`beforeUpdate` 的执行时机是在渲染 `Watcher` 的 `before` 函数中，在组件已经 `mounted` 之后，才会去调用这个钩子函数。

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  // ...
}
```

`update` 的执行时机是在 `flushSchedulerQueue` 函数调用的时候，它的定义在 `src/core/observer/scheduler.js`，在 `callUpdatedHooks` 函数中，只有 `vm._watcher` 的回调执行完毕后，才会执行 `updated` 钩子函数。

```js
function flushSchedulerQueue() {
  // ...
  // 获取到 updatedQueue
  callUpdatedHooks(updatedQueue);
}

function callUpdatedHooks(queue) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, "updated");
    }
  }
}
```

### beforeDestroy & destroyed

`beforeDestroy` 和 `destroyed` 钩子函数的执行时机在**组件销毁**的阶段，最终会调用 `$destroy` 方法，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
Vue.prototype.$destroy = function () {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestroy");
  vm._isBeingDestroyed = true;
  // remove self from parent
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null);
  // fire destroyed hook
  callHook(vm, "destroyed");
  // turn off all instance listeners.
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

`beforeDestroy` 钩子函数的执行时机是在 `$destroy` 函数执行最开始的地方，接着执行了一系列的销毁动作，包括从 `parent` 的 `$children` 中删掉自身，删除 `watcher`，当前渲染的 `VNode` 执行销毁钩子函数等，执行完毕后再调用 `destroy` 钩子函数。在 `$destroy`的执行过程中，它又会执行`vm.**patch**(vm.\_vnode, null)`触发它子组件的销毁钩子函数，这样一层层的递归调用，所以`destroy`钩子函数执行顺序是**先子后父**，和`mounted` 过程一样。

### 生命周期钩子函数

- create阶段：vue实例被创建
    - beforeCreate: 创建前，此时data和methods中的数据都还没有初始化
    - created： 创建完毕，data中有值，未挂载

- mount阶段： vue实例被挂载到真实DOM节点
    - beforeMount：可以发起服务端请求，去数据
    - mounted: 此时可以操作DOM

- update阶段：当vue实例里面的data数据变化时，触发组件的重新渲染
    - beforeUpdate :更新前
    - updated：更新后

- destroy阶段：vue实例被销毁
    - beforeDestroy：实例被销毁前，此时可以手动销毁一些方法
    - destroyed:销毁后

1. 加载渲染过程 `父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted`
2. 挂载阶段 `父created->子created->子mounted->父mounted`
3. 父组件更新阶段 `父beforeUpdate->父updated`
4. 子组件更新阶段 `父beforeUpdate->子beforeUpdate->子updated->父updated`
5. 销毁阶段 `父beforeDestroy->子beforeDestroy->子destroyed->父destroyed`

### 总结

在 `created` 钩子函数中可以访问到数据，在 `mounted` 钩子函数中可以访问到 DOM，在 `destroy` 钩子函数中可以做一些定时器销毁工作。

[Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/components/lifecycle.html)
