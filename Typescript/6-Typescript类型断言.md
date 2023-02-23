## Typescript类型断言

类型断言有两种形式：
- 尖括号语法
``` ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```
- as语法
```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```