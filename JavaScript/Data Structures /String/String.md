# String

收集字符串常用的一些内置方法

## String的静态方法

### String.fromCodePoint()

- The String.fromCodePoint() static method returns a string created by using the specified sequence of code points.

用于从 Unicode 码点返回对应字符，但是这个方法不能识别码点大于0xFFFF的字符。可以用来表示更广泛范围的字符，尤其是在处理高代码点（例如 Emoji）时非常有用。**Unicode => 字符串**

```js
String.fromCodePoint(42); // "*"
String.fromCodePoint(65, 90); // "AZ"
String.fromCodePoint(0x404); // "\u0404" === "Є"
String.fromCodePoint(0x2f804); // "\uD87E\uDC04" === '你'
String.fromCodePoint(194564); // "\uD87E\uDC04" === '你'
String.fromCodePoint(0x1d306, 0x61, 0x1d307); // "\uD834\uDF06a\uD834\uDF07" === '𝌆a𝌇'
```

### String.fromCharCode()

- The String.fromCharCode() static method returns a string created from the specified sequence of UTF-16 code units.

用于从 UTF-16 编码中的 16 位值返回对应字符。**Unicode => 字符串**

```js
String.fromCharCode(65, 66, 67);   // 返回 "ABC"
String.fromCharCode(0x2014);       // 返回 "—"
String.fromCharCode(0x12014);      // 也是返回 "—"; 数字 1 被剔除并忽略
String.fromCharCode(8212);         // 也是返回 "—"; 8212 是 0x2014 的十进制表示
```

### String.raw()

- The String.raw() static method is a tag function of template literals. This is similar to the r prefix in Python, or the @ prefix in C# for string literals. It's used to get the raw string form of template literals — that is, substitutions (e.g. ${foo}) are processed, but escape sequences (e.g. \n) are not.

用来获取一个模板字符串的原始字符串的

```js
String.raw`Hi\n${2+3}!`;
// 'Hi\\n5!'，Hi 后面的字符不是换行符，\ 和 n 是两个不同的字符

String.raw `Hi\u000A!`;
// "Hi\\u000A!"，同上，这里得到的会是 \、u、0、0、0、A 6 个字符，
// 任何类型的转义形式都会失效，保留原样输出，不信你试试.length

let name = "Bob";
String.raw `Hi\n${name}!`;
// "Hi\nBob!"，内插表达式还可以正常运行


// 正常情况下，你也许不需要将 String.raw() 当作函数调用。
// 但是为了模拟 `t${0}e${1}s${2}t` 你可以这样做：
String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'
// 注意这个测试，传入一个 string，和一个类似数组的对象
// 下面这个函数和 `foo${2 + 3}bar${'Java' + 'Script'}baz` 是相等的。
String.raw({
  raw: ['foo', 'bar', 'baz']
}, 2 + 3, 'Java' + 'Script'); // 'foo5barJavaScriptbaz'
```

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

### String.prototype.split()

- splits a String object into an array of strings by separating the string into substrings, using a specified separator string to determine where to make each split.

用指定的分隔符字符串将一个 String 对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。**字符串 => 数组**

```js
const names = "Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand ";
console.log(names);

const re = /\s*(?:;|$)\s*/;
const nameList = names.split(re);
console.log(nameList);
//Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand
//[ "Harry Trump", "Fred Barney", "Helen Rigby", "Bill Abel", "Chris Hand", "" ]
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

### String.prototype.trim() / String.prototype.trimStart() / String.prototype.trimEnd()

- removes whitespace from both ends of a string. Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) and all the line terminator characters (LF, CR, etc.).

会从一个字符串的两端（左侧、右侧）删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR 等）。

```js
var orig = "   foo  ";
console.log(orig.trim()); // 'foo'

var orig = "foo    ";
console.log(orig.trim()); // 'foo'
```

### String.prototype.padStart() /  String.prototype.padEnd()

- 用另一个字符串填充当前字符串(如果需要的话，会重复多次)，以便产生的字符串达到给定的长度。从当前字符串的左侧(右侧)开始填充。

```js
"abc".padStart(10); // "       abc"
"abc".padStart(10, "foo"); // "foofoofabc"
"abc".padEnd(10); // "abc       "
"abc".padEnd(10, "foo"); // "abcfoofoof"
```

### String.prototype.repeat()

- The repeat() method constructs and returns a new string which contains the specified number of copies of the string on which it was called, concatenated together.

构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。

```js
const mood = 'Happy! ';

console.log(`I feel ${mood.repeat(3)}`);
// Expected output: "I feel Happy! Happy! Happy! "
```

### String.prototype.replace() / String.prototype.replaceAll()

- returns a new string with some or all matches of a pattern replaced by a replacement. The pattern can be a string or a RegExp, and the replacement can be a string or a function to be called for each match. If pattern is a string, only the first occurrence will be replaced.

返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果 pattern 是字符串，则仅替换第一个匹配项。

```js
var str = "Twas the night before Xmas...";
var newstr = str.replace(/xmas/i, "Christmas");
console.log(newstr); // Twas the night before Christmas...
```

### String.prototype.indexOf() / String.prototype.lastIndexOf()

- returns the index within the calling String object of the first occurrence of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.

返回调用它的 String 对象中**第一次出现的指定值的索引**，从 fromIndex 处进行搜索。如果未找到该值，则返回 -1。

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

### String.prototype.match() / String.prototype.matchAll()

- retrieves the result of matching a string against a regular expression.

检索返回一个字符串匹配正则表达式的结果。

```js
const paragraph = "The quick brown fox jumps over the lazy dog. It barked.";
const regex = /[A-Z]/g;
const found = paragraph.match(regex);

console.log(found);
// expected output: Array ["T", "I"]

const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// Expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1]);
// Expected output: Array ["test2", "e", "st2", "2"]
```

### String.prototype.includes()

- The includes() method performs a case-sensitive search to determine whether one string may be found within another string, returning true or false as appropriate.

方法执行区分大小写的搜索，以确定是否可以在另一个字符串中找到一个字符串，并根据情况返回 true 或 false。

```js
const sentence = 'The quick brown fox jumps over the lazy dog.';

const word = 'fox';

console.log(`The word "${word}" ${sentence.includes(word) ? 'is' : 'is not'} in the sentence`);
// Expected output: "The word "fox" is in the sentence"
```

### String.prototype.charAt() / String.prototype.charCodeAt() / String.prototype.codePointAt()

- returns a new string consisting of the single UTF-16 code unit located at the specified offset into the string.

`charAt()` 从一个字符串中返回指定的字符。

`charCodeAt()` 方法返回 0 到 65535 之间的整数，表示给定索引处的 UTF-16 代码单元。

`codePointAt()` 方法返回 一个 Unicode 编码点值的非负整数。

```js
const sentence = "The quick brown fox jumps over the lazy dog.";
const index = 4;

console.log(`The character at index ${index} is ${sentence.charAt(index)}`);
// expected output: "The character at index 4 is q"

"ABC".charCodeAt(0) // returns 65:"A"

"ABC".charCodeAt(1) // returns 66:"B"

"ABC".charCodeAt(2) // returns 67:"C"

"ABC".charCodeAt(3) // returns NaN

'ABC'.codePointAt(1);          // 66
'\uD800\uDC00'.codePointAt(0); // 65536

'XYZ'.codePointAt(42); // undefined
```

### String.prototype.startsWith() / String.prototype.endsWith()

`startsWith()` 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 true 或 false。

`endsWith()` 方法用来判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 true 或 false。

```js
const str1 = 'Saturday night plans';

console.log(str1.startsWith('Sat'));
// Expected output: true

console.log(str1.startsWith('Sat', 3));
// Expected output: false


const str1 = 'Cats are the best!';

console.log(str1.endsWith('best!'));
// Expected output: true

console.log(str1.endsWith('best', 17));
// Expected output: true

const str2 = 'Is this a question?';

console.log(str2.endsWith('question'));
// Expected output: false
```

### String.prototype.at()

`at()` 方法接受一个整数值，并返回一个新的 String，该字符串由位于指定偏移量处的单个 UTF-16 码元组成。该方法允许正整数和负整数。负整数从字符串中的最后一个字符开始倒数。

```js
const sentence = 'The quick brown fox jumps over the lazy dog.';

let index = 5;

console.log(`Using an index of ${index} the character returned is ${sentence.at(index)}`);
// Expected output: "Using an index of 5 the character returned is u"

index = -4;

console.log(`Using an index of ${index} the character returned is ${sentence.at(index)}`);
// Expected output: "Using an index of -4 the character returned is d"
```

## String总结

### 查找特定字符串序列位置的方法

- search
- indexOf

### 字符串转化为数组的方法
  
- split

### slice和substring区别
  
- substring：两个参数会比较大小来判断哪一个是起始位参数哪一个是结束位置参数，通俗的讲就是小的一个数会作为起始 位置参数，大的一个数会作为结束位置参数；
- slice：则不会有这样的规则，只遵循大于0，从前面计数，小于0，从后面计数的原则；
- substring：除了两个参数会比较大小调换位置外，还满足小于0时按0处理的规则；
- slice：则是根据大于0和小于0来判断计数的前后顺序；

### 可结合正则使用的方法
  
- replace
- match
- search
- spilt

## 参考资料

[String-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
