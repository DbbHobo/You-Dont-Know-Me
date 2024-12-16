# Typescript高级类型

常见的高级类型有如下：

## 联合与交叉类型

### 交叉类型 `&`

交叉类型是将**多个类型合并为一个类型**。 通过 `&` 将多个类型合并为一个类型，包含了所需的所有类型的特性，本质上是一种**并**的操作。 例如 `Person` & `Serializable` & `Loggable` 同时是 `Person` 和 `Serializable` 和 `Loggable`。 就是说这个类型的对象同时拥有了这三种类型的成员。适用于对象合并场景，如下将声明一个函数，将两个对象合并成一个对象并返回：

```ts
export function cloneVNode<T, U>(
  vnode: VNode<T, U>,
  extraProps?: (Data & VNodeProps) | null,
  mergeRef = false
): VNode<T, U> {
  // This is intentionally NOT using spread or extend to avoid the runtime
  // key enumeration cost.
  const { props, ref, patchFlag, children } = vnode
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props
  const cloned: VNode<T, U> = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref:
      extraProps && extraProps.ref
        ? // #2078 in the case of <component :is="vnode" ref="extra"/>
          // if the vnode itself already has a ref, cloneVNode will need to merge
          // the refs so the single vnode can be set on multiple refs
          mergeRef && ref
          ? isArray(ref)
            ? ref.concat(normalizeRef(extraProps)!)
            : [ref, normalizeRef(extraProps)!]
          : normalizeRef(extraProps)
        : ref,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children:
      __DEV__ && patchFlag === PatchFlags.HOISTED && isArray(children)
        ? (children as VNode[]).map(deepCloneVNode)
        : children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag:
      extraProps && vnode.type !== Fragment
        ? patchFlag === -1 // hoisted node
          ? PatchFlags.FULL_PROPS
          : patchFlag | PatchFlags.FULL_PROPS
        : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,

    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  }
  if (__COMPAT__) {
    defineLegacyVNodeProperties(cloned as VNode)
  }
  return cloned as any
}
```

### 联合类型 `|`

联合类型的语法规则和逻辑 `|` 的符号一致，表示其类型为连接的多个类型中的任意一个，本质上是一个**交**的关系。联合类型表示一个值可以是几种类型之一。 我们用竖线（`|`）分隔每个类型，所以 `number | string | boolean` 表示一个值可以是 `number`， `string`，或 `boolean`。

```rs
type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp

function padLeft(value: string, padding: string | number) {
    // ...
}

let indentedString = padLeft("Hello world", true); // errors during compilation
```

### 非空断言 `!`

TypeScript会把 `null` 和 `undefined` 区别对待。 `string | null`， `string | undefined` 和 `string | undefined | null` 是不同的类型。非空断言告诉编译器变量一定不是 `null` 或 `undefined`。

下面看一个Vue中的例子，这里的`activeEffect!`其实就是非空断言：

```ts
export function trackEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  let shouldTrack = false
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit // set newly tracked
      shouldTrack = !wasTracked(dep)
    }
  } else {
    // Full cleanup mode.
    shouldTrack = !dep.has(activeEffect!)
  }

  if (shouldTrack) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
    if (__DEV__ && activeEffect!.onTrack) {
      activeEffect!.onTrack({
        effect: activeEffect!,
        ...debuggerEventExtraInfo!
      })
    }
  }
}
```

## 映射类型（keyof、in、工具类型）

### 工具类型

- `Partial<T>`：将所有属性变为可选
- `Required<T>`：将所有属性变为必选
- `Readonly<T>`：将所有属性变为只读
- `Record<K, T>`：构造一个类型，其中键是类型 K，值是类型 T
- `Pick<T, K>`：从类型 T 中选取部分键构造新类型
- `Omit<T, K>`：从类型 T 中移除部分键构造新类型
- `Exclude<T, U>`：从类型 T 中移除 U 的成员
- `Extract<T, U>`：提取类型 T 和 U 的交集
- `NonNullable<T>`：去除 null 和 undefined
- `ReturnType<T>`：获取函数的返回类型
- `InstanceType<T>`：获取构造函数的实例类型

### 类型索引 `keyof`

`keyof` 类似于 `Object.keys` ，用于获取一个接口中 `Key` 的联合类型。对于任何类型 `T`， `keyof T` 的结果为 `T` 上已知的公共属性名的联合。

```ts
interface Button {
    type: string
    text: string
}

type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
```

下面这个Vue中的例子，编译器会检查入参 `key` 是否真的是入参 `object` 的一个属性，`defaultValue` 是 `T[K]`，返回结果也是 `T[K]`，也就是类型变量 `K extends keyof T`：

```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue?: T[K]
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(object, key, defaultValue) as any)
}
```

### 映射类型 `in`

`TypeScript`提供了从旧类型中创建新类型的一种方式 — 映射类型。通过 `in` 关键字做类型的映射，遍历已有接口的 `key` 或者是遍历联合类型，如下例子：

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}

type PersonPartial = Partial<Person>;//Person类型里属性是可选的
type ReadonlyPerson = Readonly<Person>;//Person类型里属性是只读的

export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}
export function toRefs<T extends object>(object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
```

## 条件类型（extends）

### 类型约束 `extends`

通过关键字 `extends` 进行约束，不同于在 `class` 后使用 `extends` 的继承作用，泛型内使用的主要作用是对泛型加以约束。

```ts
type BaseType = string | number | boolean

// 表示 copy 的参数只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}

export interface Ref<T = any> {
  value: T
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
}
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>
```

### 条件类型 `T extends U ? X : Y`

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

```ts
T extends U ? X : Y
// 上面的意思就是，如果 T 是 U 的子集，就是类型 X，否则为类型 Y
```

看一个Vue中的例子：

```ts
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : T extends Ref<infer U>
  ? Readonly<Ref<DeepReadonly<U>>>
  : T extends {}
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : Readonly<T>
```
模板字面量类型
类型守卫与模式匹配