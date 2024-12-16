# Typescript技巧

## 接口extends/类型别名&的继承

```ts
// 方案1
interface shape {
  area: number
}
interface rectangle extends shape {
  witdh: number,
  height: number
}

// 方案2
type Shape = {
  area: number
}
type Rectangle = Shape & {
  witdh: number,
  height: number
}
let rect = <rectangle>{
  witdh: 20,
  height: 20,
  area: 400
}
```

## typeof

`typeof` 操作符可以用来获取一个变量或对象的类型。

```ts
let obj = {
  foo: 'foo'
}
type objType = typeof obj
```

## keyof

`keyof` 与 `Object.keys` 略有相似，只不过 `keyof` 取 `interface` 的键。

```ts
function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]
}

enum str {
   A,
   B,
   C
}
type strUnion =  keyof typeof str; // 'A' | 'B' | 'C'
```

## in

`in` 用来遍历枚举类型：

```ts
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

## infer

在TypeScript中，`infer`关键字通常与条件类型(conditional types)一起使用，用于在泛型类型中推断类型参数。`infer`关键字允许你从一个类型中提取出一个具体的类型，并将它用于其他地方。

下面是一个示例，演示了如何在条件类型中使用`infer`：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number): number {
    return a + b;
}

type AddReturnType = ReturnType<typeof add>; // 此时AddReturnType会被推断为number类型
```

在上面的例子中，我们定义了一个`ReturnType`类型，它接受一个类型参数`T`。通过使用条件类型，我们检查`T`是否是一个函数类型，如果是，就使用`infer R`来提取函数的返回类型，并将其赋值给R。如果不是函数类型，则返回`never`类型。在调用`ReturnType<typeof add>`时，`infer`关键字被用来推断函数add的返回类型为number。

总之，`infer`关键字在`TypeScript`中用于从复杂的类型中提取子类型，并在泛型条件类型中进行类型推断。这在许多高级类型操作中非常有用，例如从`Promise`中提取出`resolved`类型等。

## 符号

- `?.` 可选链，遇到 `null` 和 `undefined` 可以立即停止表达式的运行。

- `??` 空值合并运算符 当左侧操作数为 `null` 或 `undefined` 时，其返回右侧的操作数，否则返回左侧的操作数。

```ts
const name = Component.name ?? 'Anonymous'
```

- `!` 非空断言运算符 x! 将从 x 值域中排除 `null` 和 `undefined`

```ts
shouldTrack = !dep.has(activeEffect!)
```

- `!.` 在变量名后添加，可以断言排除`null`和`undefined`类型

```ts
;(parentComponent!.ctx as KeepAliveContext).activate(
  n2,
  container,
  anchor,
  isSVG,
  optimized
)
```

- `_` 数字分割符 分隔符不会改变数值字面量的值，使人更容易读懂数字，例如：1_101_324。
- `**` 求幂

## 参考资料

[了不起的 TypeScript 入门教程](https://juejin.cn/post/6844904182843965453#heading-51)
