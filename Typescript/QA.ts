//【1. ab和返回值必须是同类型】
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

//【2. 定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的？】
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

//【3. 定义一个 ConditionalPick 工具类型，支持根据指定的 Condition 条件来生成新的类型】
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

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}
type ConditionalPick<E , S> =  {
  [K in keyof E as E[K] extends S ? K : never]: E[K];
};
  
// 测试用例：//=> {a: string}
type StringKeysOnly = ConditionalPick<Example, string>;


//【4. 定义一个工具类型 AppendArgument，为已有的函数类型增加指定类型的参数，新增的参数名是 x，将作为新函数类型的第一个参数。具体的使用示例如下所示：】
type Fn = (a: number, b: string) => number
type AppendArgument<F, A> = F extends (...arg: infer Arg) => infer Return ? (x:A, ...arg:Arg) => Return: never

type FinalFn = AppendArgument<Fn, boolean> 
// (x: boolean, a: number, b: string) => number


//【5. 定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）。在完成 NaiveFlat 工具类型之后，在继续实现 DeepFlat 工具类型，以支持多维数组类型。】
type NaiveFlat<T extends any[]> =  T[number] extends any[] ? T[number][number] : T[number]

// 测试用例：
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
// NaiveResult的结果： "a" | "b" | "c" | "d"


type DeepFlat<T extends any[]> = T[number] extends infer U ? U extends any[] ? DeepFlat<U> : U : T[number] // 你的实现代码

// 测试用例
type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
type DeepTestResult = DeepFlat<Deep>  
// DeepTestResult: "a" | "b" | "c" | "d" | "e".