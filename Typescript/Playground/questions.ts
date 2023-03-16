//【1.ab和返回值必须是同类型】
function f(a: string, b: string): string
function f(a:number,b:number) :number
function f(a: string | number, b: string | number): string | number {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + b; // error as b can be number | string
  }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b') // Ok

//【2.定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的？】
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

// lib.es5.d.ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type SetOptionalOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
type SetRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type SetRequiredOmit<T, K extends keyof T> = Pick<T, K> & Required<Omit<T, K>>;


interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};