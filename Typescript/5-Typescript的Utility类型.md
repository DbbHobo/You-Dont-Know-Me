# TS内置实用类型 Utility Types

`TypeScript` 提供了一些内置的工具类型，本质上也是通过范型来实现的。下面，我们通过几种常用的类型来看看它们是怎么实现的。

## `Omit<Type, Keys>`

作用是忽略 T 中的某些属性。

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MergedParserOptions = Omit<Required<ParserOptions>, OptionalOptions> &
  Pick<ParserOptions, OptionalOptions>
```

## `Pick<Type, Keys>`

从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## `Partial<Type>`

是将某个类型里的属性全部变为可选项 `?`。

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

## `Required<Type>`

是将某个类型里的属性全部变为必须项，和Partial恰好相反。

```ts
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };
Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

## `Exclude<UnionType, ExcludedMembers>`

从联合类型 `UnionType` 中排除 `ExcludedMembers` 元素。

```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K]
): ToRef<Exclude<T[K], undefined>>
```

## `Extract<Type, Union>`t

从联合类型 `Union` 中取出 `Type` 元素。

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
     
type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;
     
type T1 = () => void
```

## `Readonly<Type>`

是将某个类型里的属性全部变为只读项。

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

构造一个对象类型，它的键是另外一个类型的`keys`，值是某个`type`。

```ts
interface CatInfo {
  age: number;
  breed: string;
}
 
type CatName = "miffy" | "boris" | "mordred";
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
 
cats.boris;
 
const cats: Record<CatName, CatInfo>
```

## 参考资料

[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
