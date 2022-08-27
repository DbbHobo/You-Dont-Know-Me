# JavaScript questions
1. ### What is the difference between == and === operators
JavaScript provides both strict(===, !==) and type-converting(==, !=) equality comparison. The strict operators take type of variable in consideration, while non-strict operators make type correction/conversion based upon values of variables. The strict operators follow the below conditions for different types,

- Two strings are strictly equal when they have the same sequence of characters, same length, and same characters in corresponding positions.
- Two numbers are strictly equal when they are numerically equal. i.e, Having the same number value. There are two special cases in this,
1.NaN is not equal to anything, including NaN.
2.Positive and negative zeros are equal to one another.
- Two Boolean operands are strictly equal if both are true or both are false.
- Two objects are strictly equal if they refer to the same Object.
- Null and Undefined types are not equal with ===, but equal with ==. i.e, null===undefined --> false but null==undefined --> true
Some of the example which covers the above cases,

```js
0 == false   // true
0 === false  // false
1 == "1"     // true
1 === "1"    // false
null == undefined // true
null === undefined // false
'0' == false // true
'0' === false // false
[]==[] or []===[] //false, refer different objects in memory
{}=={} or {}==={} //false, refer different objects in memory
```

2. ### What is the currying function
Currying is the process of taking a function with multiple arguments and turning it into a sequence of functions each with only a single argument. Currying is named after a mathematician Haskell Curry. By applying currying, a n-ary function turns it into a unary function.

Let's take an example of n-ary function and how it turns into a currying function,
```js
const multiArgFunction = (a, b, c) => a + b + c;
console.log(multiArgFunction(1, 2, 3)); // 6

const curryUnaryFunction = (a) => (b) => (c) => a + b + c;
curryUnaryFunction(1); // returns a function: b => c =>  1 + b + c
curryUnaryFunction(1)(2); // returns a function: c => 3 + c
curryUnaryFunction(1)(2)(3); // returns the number 6
```
Curried functions are great to improve code reusability and functional composition.

3. ### What is memoization

Memoization is a programming technique which attempts to increase a function’s performance by caching its previously computed results. Each time a memoized function is called, its parameters are used to index the cache. If the data is present, then it can be returned, without executing the entire function. Otherwise the function is executed and then the result is added to the cache.
Let's take an example of adding function with memoization,

```javascript
const memoizAddition = () => {
    let cache = {};
    return (value) => {
    if (value in cache) {
        console.log("Fetching from cache");
        return cache[value]; // Here, cache.value cannot be used as property name starts with the number which is not a valid JavaScript  identifier. Hence, can only be accessed using the square bracket notation.
    } else {
        console.log("Calculating result");
        let result = value + 20;
        cache[value] = result;
        return result;
    }
    };
};
// returned function from memoizAddition
const addition = memoizAddition();
console.log(addition(20)); //output: 40 calculated
console.log(addition(20)); //output: 40 cached
```

4. ### What is a service worker

A Service worker is basically a script (JavaScript file) that runs in the background, separate from a web page and provides features that don't need a web page or user interaction. Some of the major features of service workers are Rich offline experiences(offline first web application development), periodic background syncs, push notifications, intercept and handle network requests and programmatically managing a cache of responses.

5. ### What is a storage event and its event handler
   
The StorageEvent is an event that fires when a storage area has been changed in the context of another document. Whereas onstorage property is an EventHandler for processing storage events. The syntax would be as below

```js
window.onstorage = functionRef;
```

Let's take the example usage of onstorage event handler which logs the storage key and it's values

```js
window.onstorage = function (e) {
  console.log(
    "The " +
      e.key +
      " key has been changed from " +
      e.oldValue +
      " to " +
      e.newValue +
      "."
  );
};
```

6. ### What's the output?
```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: 'purple' });
console.log(freddie.colorChange('orange'));
```
A: orange
B: purple
C: green
D: TypeError
Answer
Answer: D
The colorChange function is static. Static methods are designed to live only on the constructor in which they are created, and cannot be passed down to any children or called upon class instances. Since freddie is an instance of class Chameleon, the function cannot be called upon it. A TypeError is thrown.

7. ### What's the output?
```js
let number = 0;
console.log(number++);
console.log(++number);
console.log(number);
```
A: 1 1 2
B: 1 2 2
C: 0 2 2
D: 0 1 2
Answer
Answer: C
The postfix unary operator ++:

Returns the value (this returns 0)
Increments the value (number is now 1)
The prefix unary operator ++:

Increments the value (number is now 2)
Returns the value (this returns 2)
This returns 0 2 2.

8. ### What's the output?
```js
function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = 'Lydia';
const age = 21;

getPersonInfo`${person} is ${age} years old`;
```
A: "Lydia" 21 ["", " is ", " years old"]
B: ["", " is ", " years old"] "Lydia" 21
C: "Lydia" ["", " is ", " years old"] 21
Answer
Answer: B
If you use tagged template literals, the value of the first argument is always an array of the string values. The remaining arguments get the values of the passed expressions!

9. ### What's the output?
```js
function checkAge(data) {
  if (data === { age: 18 }) {
    console.log('You are an adult!');
  } else if (data == { age: 18 }) {
    console.log('You are still an adult.');
  } else {
    console.log(`Hmm.. You don't have an age I guess`);
  }
}
```
checkAge({ age: 18 });
A: You are an adult!
B: You are still an adult.
C: Hmm.. You don't have an age I guess
Answer
Answer: C
When testing equality, primitives are compared by their value, while objects are compared by their reference. JavaScript checks if the objects have a reference to the same location in memory.

The two objects that we are comparing don't have that: the object we passed as a parameter refers to a different location in memory than the object we used in order to check equality.

This is why both { age: 18 } === { age: 18 } and { age: 18 } == { age: 18 } return false.

10. ### What's the output?
```js
const obj = { 1: 'a', 2: 'b', 3: 'c' };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty('1');
obj.hasOwnProperty(1);
set.has('1');
set.has(1);
```
A: false true false true
B: false true true true
C: true true false true
D: true true true true
Answer
Answer: C
All object keys (excluding Symbols) are strings under the hood, even if you don't type it yourself as a string. This is why obj.hasOwnProperty('1') also returns true.

It doesn't work that way for a set. There is no '1' in our set: set.has('1') returns false. It has the numeric type 1, set.has(1) returns true.

11. ### What's the output?
```js
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
```
A: 123
B: 456
C: undefined
D: ReferenceError
Answer
Answer: B
Object keys are automatically converted into strings. We are trying to set an object as a key to object a, with the value of 123.

However, when we stringify an object, it becomes "[object Object]". So what we are saying here, is that a["[object Object]"] = 123. Then, we can try to do the same again. c is another object that we are implicitly stringifying. So then, a["[object Object]"] = 456.

Then, we log a[b], which is actually a["[object Object]"]. We just set that to 456, so it returns 456.

12. ### What's the output?
```js
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
A: 1 undefined 2
B: undefined undefined undefined
C: 1 1 2
D: 1 undefined undefined
```
Answer
Answer: A
The catch block receives the argument x. This is not the same x as the variable when we pass arguments. This variable x is block-scoped.

Later, we set this block-scoped variable equal to 1, and set the value of the variable y. Now, we log the block-scoped variable x, which is equal to 1.

Outside of the catch block, x is still undefined, and y is 2. When we want to console.log(x) outside of the catch block, it returns undefined, and y returns 2.


13. ### What's the output?
```js
console.log(3 + 4 + '5');
```
A: "345"
B: "75"
C: 12
D: "12"

Answer
Answer: B
Operator associativity is the order in which the compiler evaluates the expressions, either left-to-right or right-to-left. This only happens if all operators have the same precedence. We only have one type of operator: +. For addition, the associativity is left-to-right.

3 + 4 gets evaluated first. This results in the number 7.

7 + '5' results in "75" because of coercion. JavaScript converts the number 7 into a string, see question 15. We can concatenate two strings using the +operator. "7" + "5" results in "75".

14. ### What's the output?
```js
function Car() {
  this.make = 'Lamborghini';
  return { make: 'Maserati' };
}

const myCar = new Car();
console.log(myCar.make);
```
A: "Lamborghini"
B: "Maserati"
C: ReferenceError
D: TypeError
Answer
Answer: B
When you return a property, the value of the property is equal to the returned value, not the value set in the constructor function. We return the string "Maserati", so myCar.make is equal to "Maserati".

15. ### What's the output?
```js
(() => {
  let x = (y = 10);
})();

console.log(typeof x);
console.log(typeof y);
```
A: "undefined", "number"
B: "number", "number"
C: "object", "number"
D: "number", "undefined"
Answer
Answer: A
let x = (y = 10); is actually shorthand for:
```js
y = 10;
let x = y;
```
When we set y equal to 10, we actually add a property y to the global object (window in browser, global in Node). In a browser, window.y is now equal to 10.

Then, we declare a variable x with the value of y, which is 10. Variables declared with the let keyword are block scoped, they are only defined within the block they're declared in; the immediately invoked function expression (IIFE) in this case. When we use the typeof operator, the operand x is not defined: we are trying to access x outside of the block it's declared in. This means that x is not defined. Values who haven't been assigned a value or declared are of type "undefined". console.log(typeof x) returns "undefined".

However, we created a global variable y when setting y equal to 10. This value is accessible anywhere in our code. y is defined, and holds a value of type "number". console.log(typeof y) returns "number".

16. ### What's the output?
```js
// counter.js
let counter = 10;
export default counter;
// index.js
import myCounter from './counter';

myCounter += 1;

console.log(myCounter);
```
A: 10
B: 11
C: Error
D: NaN
Answer
Answer: C
An imported module is read-only: you cannot modify the imported module. Only the module that exports them can change its value.

When we try to increment the value of myCounter, it throws an error: myCounter is read-only and cannot be modified.

17. ### What's the output?
```js
const name = 'Lydia';
age = 21;

console.log(delete name);
console.log(delete age);
```
A: false, true
B: "Lydia", 21
C: true, true
D: undefined, undefined
Answer
Answer: A
The delete operator returns a boolean value: true on a successful deletion, else it'll return false. However, variables declared with the var, const or let keyword cannot be deleted using the delete operator.

The name variable was declared with a const keyword, so its deletion is not successful: false is returned. When we set age equal to 21, we actually added a property called age to the global object. You can successfully delete properties from objects this way, also the global object, so delete age returns true.