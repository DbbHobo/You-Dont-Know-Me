## TypeScript泛型

泛型允许我们在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型 在typescript中，定义函数，接口或者类的时候，不预先定义好具体的类型，而在使用的时候在指定类型的一种特性。

### 泛型的使用
泛型通过`<>`的形式进行表述，可以声明：

- 函数
可以这样理解`loggingIdentity`的类型：泛型函数`loggingIdentity`，接收类型参数`T`和参数`arg`，它是个元素类型是`T`的数组，并返回元素类型是`T`的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 T的的类型为number。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性。
```js
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

- 接口
几乎 `interface` 的所有特性 `type` 都有， `type` 与 `interface` 核心的区别在于 `type` 一旦定义就不能再添加新的属性，而 `interface` 总是可扩展的。
这个Vue中的例子定义了两个泛型函数 `ComputedGetter` 和 `ComputedSetter`：
```js
export type ComputedGetter<T> = (...args: any[]) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  //   ...
}
```

- 类
泛型类看上去与泛型接口差不多。 泛型类使用（`<>`）括起泛型类型，跟在类名后面。类有两部分：**静态部分**和**实例部分**。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。
这个Vue中的例子定义了一个泛类型RefImpl如下：
```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  //   ...
}
```

- 泛型约束
有时候想操作某类型的一组值，并且我们知道这组值具有什么样的属性。 在 `loggingIdentity` 中，我们想访问`arg`的`length`属性，但是编译器并不能证明每种类型都有`length`属性，所以就报错了。
```js
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```
相比于操作any所有类型，我们想要限制函数去处理任意带有`.length`属性的所有类型。 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于T的约束要求。

为此，我们定义一个接口来描述约束条件。 创建一个包含 `.length` 属性的接口，使用这个接口和`extends`关键字来实现约束：
```js
interface Lengthwise {
    length: number;
}

// 虽然是泛型，但是用extends Lengthwise约数这个泛型必须是一个含有length属性的对象
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```
现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
```js
loggingIdentity(3);  // Error, number doesn't have a .length property
```
我们需要传入符合约束类型的值，必须包含必须的属性：
```js
loggingIdentity({length: 10, value: 3});
```

[Typesrcipt泛型](https://www.tslang.cn/docs/handbook/generics.html)