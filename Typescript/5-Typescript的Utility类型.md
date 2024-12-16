# TS内置实用类型 Utility Types

`TypeScript` 提供了一些内置的工具类型，本质上也是通过范型来实现的。下面，我们通过几种常用的类型来看看它们是怎么实现的。

## `Partial<T>`

将类型 T 的所有属性设为可选属性。

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

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type PartialUser = Partial<User>;
// 等价于
// type PartialUser = {
//     id?: number;
//     name?: string;
//     email?: string;
// }

const user: PartialUser = {
    name: "Alice",
};
```

## `Required<T>`

将类型 T 的所有属性设为必选属性。

```ts
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };
// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
```

```ts
type User = {
    id?: number;
    name?: string;
    email?: string;
};

type RequiredUser = Required<User>;
// 等价于
// type RequiredUser = {
//     id: number;
//     name: string;
//     email: string;
// }

const user: RequiredUser = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
};
```

## `Readonly<T>`

将类型 T 的所有属性设为只读，防止被修改。

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type ReadonlyUser = Readonly<User>;
// 等价于
// type ReadonlyUser = {
//     readonly id: number;
//     readonly name: string;
//     readonly email: string;
// }

const user: ReadonlyUser = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
};

// user.name = "Bob"; // Error: Cannot assign to 'name' because it is a read-only property.
```

## `Record<K, T>`

构造一个对象类型，其中键是类型 K 的联合类型，值是类型 T。

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

```ts
type Roles = "admin" | "user" | "guest";

type RoleDescriptions = Record<Roles, string>;
// 等价于
// type RoleDescriptions = {
//     admin: string;
//     user: string;
//     guest: string;
// }

const roles: RoleDescriptions = {
    admin: "Administrator",
    user: "Regular User",
    guest: "Guest User",
};
```

## `Pick<T, K>`

从类型 T 中选取部分属性，构造一个新类型。

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type PickedUser = Pick<User, "id" | "name">;
// 等价于
// type PickedUser = {
//     id: number;
//     name: string;
// }

const user: PickedUser = {
    id: 1,
    name: "Alice",
};

```

## `Omit<T, K>`

从类型 T 中排除某些属性，构造一个新类型。

```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

```ts
type User = {
    id: number;
    name: string;
    email: string;
};

type OmittedUser = Omit<User, "email">;
// 等价于
// type OmittedUser = {
//     id: number;
//     name: string;
// }

const user: OmittedUser = {
    id: 1,
    name: "Alice",
};

```

## `Exclude<T, U>`

从联合类型 T 中排除所有属于类型 U 的成员。

```ts
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K]
): ToRef<Exclude<T[K], undefined>>
```

```ts
type T = string | number | boolean;
type Excluded = Exclude<T, boolean>;
// 等价于
// type Excluded = string | number;

const value: Excluded = 42; // OK
```

## `Extract<T, U>`

从类型 T 中提取所有可以赋值给类型 U 的成员。

```ts
type T = string | number | boolean;
type Extracted = Extract<T, boolean | string>;
// 等价于
// type Extracted = string | boolean;

const value: Extracted = "hello"; // OK
```

## 参考资料

[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
