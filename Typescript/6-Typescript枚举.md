# Typescript 枚举类型

使用枚举我们可以定义一些带名字的常量。 使用枚举`enum`可以清晰地表达意图或创建一组有区别的用例。 `TypeScript`支持数字的和基于字符串的枚举。

## 常量枚举（Const Enum）

大多数情况下，枚举是十分有效的方案。 然而在某些情况下需求很严格。 为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问，我们可以使用 const枚举。 常量枚举通过在枚举上使用 `const` 修饰符来定义。

```ts
const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}

export const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}

export const enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}
```

## 数字枚举（Numeric Enum）

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

如上，我们定义了一个数字枚举， Up 使用初始化为 1。 其余的成员会从 1开始自动增长。 换句话说， Direction.Up 的值为 1， Down为 2， Left为 3， Right为 4。

## 字符串枚举（String Enum）

字符串枚举的每个成员必须是一个字符串字面量。

```ts
enum Status {
  Success = "SUCCESS",
  Failure = "FAILURE",
}

console.log(Status.Success); // "SUCCESS"
console.log(Status.Failure); // "FAILURE"
```

## 异构枚举（Heterogeneous Enum）

异构枚举是指枚举成员既包含数字类型也包含字符串类型。不建议频繁使用异构枚举，因为可能导致类型检查的问题。

```ts
enum Result {
  No = 0,
  Yes = "YES",
}

console.log(Result.No);  // 0
console.log(Result.Yes); // "YES"
```

## 计算（或动态）枚举（Computed Enum）

计算枚举的值通过表达式计算得出，可以与常量枚举成员混用。

```ts
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "123".length, // 字符串长度计算
}

console.log(FileAccess.None);      // 0
console.log(FileAccess.Read);      // 2
console.log(FileAccess.Write);     // 4
console.log(FileAccess.ReadWrite); // 6
console.log(FileAccess.G);         // 3
```
