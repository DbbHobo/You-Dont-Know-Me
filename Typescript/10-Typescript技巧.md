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
在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。
```ts
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

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

## 工具类型
- `Exclude<T, U>` 从 T 中排除出继承自 U 的元素。
```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K]
): ToRef<Exclude<T[K], undefined>>
```
- `Omit<T, K>`    作用是忽略 T 中的某些属性。
```ts
type MergedParserOptions = Omit<Required<ParserOptions>, OptionalOptions> &
  Pick<ParserOptions, OptionalOptions>
```
- `Partial<T>` 是将某个类型里的属性全部变为可选项 ?。
```ts
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```
- `Merge<O1, O2>` 是将两个对象的属性合并。
- `Compute<A & B>` 是将交叉类型合并。
- `Intersection<T, U>` 是取 T 的属性,此属性同样也存在与 U。
- `Overwrite<T, U>` 是用 U 的属性覆盖 T 的相同属性。


[了不起的 TypeScript 入门教程](https://juejin.cn/post/6844904182843965453#heading-51)