# String

收集字符串常用的一些内置方法

## String的静态方法

---
## String的实例方法

### String.prototype.concat()

- concatenates the string arguments to the calling string and returns a new string.

将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。

```js
var hello = "Hello, ";
console.log(hello.concat("Kevin", ". Have a nice day."));
/* Hello, Kevin. Have a nice day. */

var greetList = ["Hello", " ", "Venkat", "!"];
"".concat(...greetList); // "Hello Venkat!"
```

### String.prototype.indexOf()

- returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.

返回调用它的 String 对象中第一次出现的指定值的索引，从 fromIndex 处进行搜索。如果未找到该值，则返回 -1。

```js
const str = "To be, or not to be, that is the question.";
let count = 0;
let position = str.indexOf("e");

while (position !== -1) {
  count++;
  position = str.indexOf("e", position + 1);
}

console.log(count); // displays 4
```

### String.prototype.replace()

- returns a new string with some or all matches of a pattern replaced by a replacement. The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match. If pattern is a string, only the first occurrence will be replaced.

返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果 pattern 是字符串，则仅替换第一个匹配项。

```js
var str = "Twas the night before Xmas...";
var newstr = str.replace(/xmas/i, "Christmas");
console.log(newstr); // Twas the night before Christmas...
```

### String.prototype.slice()

- extracts a section of a string and returns it as a new string, without modifying the original string.

提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

```js
var str = "The morning is upon us.";
str.slice(-3); // returns 'us.'
str.slice(-3, -1); // returns 'us'
str.slice(0, -1); // returns 'The morning is upon us'
```

### String.prototype.split()

- splits a String object into an array of strings by separating the string into substrings, using a specified separator string to determine where to make each split.

用指定的分隔符字符串将一个 String 对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。

```js
const names = "Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand ";
console.log(names);

const re = /\s*(?:;|$)\s*/;
const nameList = names.split(re);
console.log(nameList);
//Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand
//[ "Harry Trump", "Fred Barney", "Helen Rigby", "Bill Abel", "Chris Hand", "" ]
```

### String.prototype.substring()

- returns the part of the string between the start and end indexes, or to the end of the string.

返回一个字符串在开始索引到结束索引之间的一个子集, 或从开始索引直到字符串的末尾的一个子集。

```js
var str = "Mozilla";
console.log(str.substring(1, 3));
// expected output: "oz"
console.log(str.substring(2));
// expected output: "zilla"

// Displays 'illa' the last 4 characters
var anyString = "Mozilla";
var anyString4 = anyString.substring(anyString.length - 4);
console.log(anyString4);

substring和substr的不同;
var text = "Mozilla";
console.log(text.substring(2, 5)); // => "zil"
console.log(text.substr(2, 3)); // => "zil"

substring和slice的不同;
var text = "Mozilla";
console.log(text.substring(5, 2)); // => "zil"
console.log(text.slice(5, 2)); // => ""
```

### String.prototype.trim()、String.prototype.trimStart()、String.prototype.trimEnd()

- removes whitespace from both ends of a string. Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) and all the line terminator characters (LF, CR, etc.).

会从一个字符串的两端（左侧、右侧）删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR 等）。

```js
var orig = "   foo  ";
console.log(orig.trim()); // 'foo'

var orig = "foo    ";
console.log(orig.trim()); // 'foo'
```

### String.prototype.search()

- executes a search for a match between a regular expression and this String object.

执行正则表达式和 String 对象之间的一个搜索匹配。

```js
var str = "hey JudE";
var re = /[A-Z]/g;
var re2 = /[.]/g;
console.log(str.search(re)); // returns 4, which is the index of the first capital letter "J"
console.log(str.search(re2)); // returns -1 cannot find '.' dot punctuation
```

### String.prototype.charAt()

- returns a new string consisting of the single UTF-16 code unit located at the specified offset into the string.

从一个字符串中返回指定的字符。

```js
const sentence = "The quick brown fox jumps over the lazy dog.";
const index = 4;

console.log(`The character at index ${index} is ${sentence.charAt(index)}`);
// expected output: "The character at index 4 is q"
```

### String.prototype.match()

- retrieves the result of matching a string against a regular expression.

检索返回一个字符串匹配正则表达式的结果。

```js
const paragraph = "The quick brown fox jumps over the lazy dog. It barked.";
const regex = /[A-Z]/g;
const found = paragraph.match(regex);

console.log(found);
// expected output: Array ["T", "I"]
```

## String.prototype.padStart()

- 用另一个字符串填充当前字符串(如果需要的话，会重复多次)，以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。

```js
"abc".padStart(10); // "       abc"
"abc".padStart(10, "foo"); // "foofoofabc"
```

### String.prototype.padEnd()

- 用另一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的右侧开始填充。

```js
"abc".padEnd(10); // "abc       "
"abc".padEnd(10, "foo"); // "abcfoofoof"
```

[String-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
