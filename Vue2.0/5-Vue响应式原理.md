# Vue 响应式原理

## Vue 响应式过程

Vue 初始化阶段`_init`方法会执行以下内容：

```js
vm._self = vm;
initLifecycle(vm);
initEvents(vm);
initRender(vm);
callHook(vm, "beforeCreate");
initInjections(vm); // resolve injections before data/props
initState(vm);
initProvide(vm); // resolve provide after data/props
callHook(vm, "created");
```

### `initState`方法

`initState` 方法主要是对 `props`、`methods`、`data`、`computed` 和 `wathcer` 等属性做了初始化操作。`initState`方法如下：

```js
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

### `initProps`方法

`props` 的初始化主要过程，就是遍历定义的 `props` 配置。遍历的过程主要做两件事情：一个是调用 `defineReactive` 方法把每个 `prop` 对应的值变成响应式；另一个是通过 proxy 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上。

`initProps`里初始化 props 方法如下：

```js
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}
```

### `initData`方法

`data` 的初始化主要过程也是做两件事，一个是对定义 `data` 函数返回对象的遍历，通过 proxy 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上；另一个是调用 `observe` 方法观测整个 `data` 的变化，把 `data` 也变成响应式。

`initData`里初始化 data 方法如下：

```js
function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

### `observe`方法

可以看到最后调用了 `observe` 方法，`observe` 方法给非 VNode 的**对象类型**的数据添加一个 `Observer`，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象实例。`observe` 方法如下：

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

### `Observer`类

`Observer` 是一个类，它的作用是给对象的属性添加 `getter` 和 `setter`，用于**依赖收集**和**派发更新**，实例化 Observer 时会给这个数据加上`__ob__`属性，然后根据这个数据是数组还是非数组会调用`observeArray`或者`walk`方法， `Observer` 类定义如下：

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

### `defineReactive`方法

可以看到层层嵌套后最终执行的是 `defineReactive` 方法，`defineReactive` 函数最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 `getter` 和 `setter`。最后利用 `Object.defineProperty` 去给 `obj` 的属性 `key` 添加 `getter` 和 `setter`。`defineReactive` 方法定义如下：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

到这里为止完成了响应式的第一部，改造属性的 `setter` 和 `getter`。

## 依赖收集

对数据对象的访问会触发他们的 `getter` 方法，那么这些对象什么时候被访问呢？还记得 Vue 的 `mount` 过程是通过 `mountComponent` 函数，其中有一段比较重要的逻辑，大致如下：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating);
};
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
```

当我们去实例化一个渲染 `watcher` 的时候，首先进入 `watcher` 的构造函数逻辑

```js
constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.computed // for computed watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }
```

官方对响应式原理的图片解释：

![reactive](./assets/reactive.png)

每个组件实例都对应一个 `watcher` 实例，它会在组件渲染的过程中把“接触”过的数据 `property` 记录为依赖。之后当依赖项的 `setter` 触发时，会通知 `watcher`，从而使它关联的组件重新渲染。

## 响应式的特殊情况

### 添加的新属性

添加新属性的场景我们在平时开发中会经常遇到，那么 `Vue` 为了解决这个问题，定义了一个全局 API `Vue.set` 方法

```js
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set(target: Array<any> | Object, key: any, val: any): any {
  if (
    process.env.NODE_ENV !== "production" &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(
      `Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`
    );
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = (target: any).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== "production" &&
      warn(
        "Avoid adding reactive properties to a Vue instance or its root $data " +
          "at runtime - declare it upfront in the data option."
      );
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
```

`set` 方法接收 3 个参数，`target` 可能是数组或者是普通对象，`key` 代表的是数组的下标或者是对象的键值，`val` 代表添加的值。首先判断如果 `target` 是数组且 `key` 是一个合法的下标，则之前通过 `splice` 去添加进数组然后返回，这里的 `splice` 其实已经不仅仅是原生数组的 `splice` 了。接着又判断 `key` 已经存在于 `target` 中，则直接赋值返回，因为这样的变化是可以观测到了。接着再获取到 `target.__ob__` 并赋值给 `ob`，之前分析过它是在 `Observer` 的构造函数执行的时候初始化的，表示 `Observer` 的一个实例，如果它不存在，则说明 `target` 不是一个响应式的对象，则直接赋值并返回。最后通过 `defineReactive(ob.value, key, val)` 把新添加的属性变成响应式对象，然后再通过 `ob.dep.notify()` 手动的触发依赖通知。

### 数组的变动

`Vue` 也是不能检测到以下变动的数组：

1.当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`

2.当你修改数组的长度时，例如：`vm.items.length = newLength`

对于第一种情况，可以使用：`Vue.set(example1.items, indexOfItem, newValue)`；而对于第二种情况，可以使用 `vm.items.splice(newLength)`。

在通过 `observe` 方法去观察对象的时候会实例化 `Observer`，在它的构造函数中是专门对数组做了处理，它的定义如下：

```js
export class Observer {
  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      // ...
    }
  }
}
```

`value` 是 `Array` 的情况，首先获取 `augment`，这里的 `hasProto` 实际上就是判断对象中是否存在 `__proto__`，如果存在则 `augment` 指向 `protoAugment`， 否则指向 `copyAugment`，来看一下这两个函数的定义：

```js
/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}
```

`protoAugment` 方法是直接把 `target.__proto__` 原型直接修改为 `src`，而 `copyAugment` 方法是遍历 `keys`，通过 `def`，也就是 `Object.defineProperty` 去定义它自身的属性值。对于大部分现代浏览器都会走到 `protoAugment`，那么它实际上就把 `value` 的原型指向了 `arrayMethods`，`arrayMethods`定义如下：

```js
import { def } from "../util/index";

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});
```

可以看到，`arrayMethods` 首先继承了 `Array`，然后对数组中所有能改变数组自身的方法，如 `push`、`pop` 等这些方法进行重写。重写后的方法会先执行它们本身原有的逻辑，并对能增加数组长度的 3 个方法 `push`、`unshift`、`splice` 方法做了判断，获取到插入的值，然后把新添加的值变成一个响应式对象，并且再调用 `ob.dep.notify()` 手动触发依赖通知，这就很好地解释了之前的示例中调用 `vm.items.splice(newLength)` 方法可以检测到变化。

[Vue.js 技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/reactive/reactive-object.html)
