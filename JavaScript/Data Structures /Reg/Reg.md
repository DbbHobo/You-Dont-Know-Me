## RegExp

有两种方法可以创建一个 RegExp 对象：一种是字面量，另一种是构造函数。
- 字面量：由斜杠 (/) 包围而不是引号包围。
- 构造函数的字符串参数：由引号而不是斜杠包围。

## RegExp 静态属性
### RegExp.prototype.lastIndex

`lastIndex` 是正则表达式的一个可读可写的整型属性，用来指定下一次匹配的起始索引。

- 如果 lastIndex 大于字符串的长度，则 regexp.test 和 regexp.exec 将会匹配失败，然后 lastIndex 被设置为 0。
- 如果 lastIndex 等于或小于字符串的长度，则该正则表达式匹配从 lastIndex 位置开始的字符串。
  - 如果 regexp.test 和 regexp.exec 匹配成功，lastIndex 会被设置为紧随最近一次成功匹配的下一个位置。
  - 如果 regexp.test 和 regexp.exec 匹配失败，lastIndex 会被设置为 0

## RegExp 实例属性、方法

### RegExp.prototype.source

`source` 属性返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符。
```js
var regex = /fooBar/ig;

console.log(regex.source); // "fooBar"，不包含 /.../ 和 "ig"。
```

### RegExp.prototype.exec()

exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。在设置了 global 或 sticky 标志位的情况下（如 /foo/g 或 /foo/y），JavaScript RegExp 对象是有状态的。它们会将上次成功匹配后的位置记录在 lastIndex 属性中。使用此特性，exec() 可用来对单个字符串中的**多次匹配结果**进行逐条的遍历（包括捕获到的匹配），而相比之下， String.prototype.match() 只会返回匹配到的结果。
```js
const re = /quick\s(?<color>brown).+?(jumps)/igd;
const result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
// 属性              	值
// [0]	     "Quick Brown Fox Jumps"
// [1]	             "Brown"
// [2]	             "Jumps"
// index	              4
// indices	[[4, 25], [10, 15], [20, 25]]
// groups:     { color: [10, 15 ]}
// input	              4
// groups	    { color: "brown" }
```

### RegExp.prototype.test()

`test()` 方法执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false。

当你想要知道一个正则表达式是否与指定的字符串匹配时，就可以使用 `test()`（类似于 `String.prototype.search()` 方法），差别在于 `test` 返回一个布尔值，而 `search` 返回索引（如果找到）或者 -1（如果没找到）；若想知道更多信息（然而执行比较慢），可使用 `exec()` 方法（类似于 `String.prototype.match()` 方法）。和 `exec()` (或者组合使用),一样，在相同的全局正则表达式实例上多次调用`test`将会越过之前的匹配。
```js
const str = 'table football';

const regex = new RegExp('foo*');
const globalRegex = new RegExp('foo*', 'g');

console.log(regex.test(str));
// Expected output: true

console.log(globalRegex.lastIndex);
// Expected output: 0

console.log(globalRegex.test(str));
// Expected output: true

console.log(globalRegex.lastIndex);
// Expected output: 9

console.log(globalRegex.test(str));
// Expected output: false

```

### RegExp.prototype.toString()
toString() 返回一个表示该正则表达式的字符串。

---

## 横向模糊匹配

横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。使用量词。譬如 `{m,n}`，表示连续出现最少 m 次，最多 n 次。

使用量词。譬如 {m,n}，表示连续出现最少 m 次，最多 n 次。

![reg](../../assets/reg2.png)

## 纵向模糊匹配

纵向模糊指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多可能。

正则 **/a[123]b/** 可以匹配如下三种字符串： "a1b"、"a2b"、"a3b"。

某位字符可以是任何东西，但就不能是 "a"、"b"、"c"。此时就是排除字符组（反义字符组）的概念。例如正则 **[^abc]**，表示是一个除 "a"、"b"、"c"之外的任意一个字符。

^ 在方括号表达式中使用，此时它表示不接受该字符集合。要匹配 ^ 字符本身，请使用 \^。

## 范围表示

[123456abcdefGHIJKLM]，可以写成 **[1-6a-fG-M]**。用连字符 - 来省略和简写。

因为连字符有特殊用途，那么要匹配 "a"、"-"、"z" 这三者中任意一个字符，该怎么做呢？不能写成 [a-z]，因为其表示小写字符中的任何一个字符。可以写成如下的方式：**[-az]** 或 **[az-]** 或 **[a\-z]**。

![reg](../../assets/reg1.png)

## 贪婪匹配与惰性匹配

通过在量词后面加个问号就能实现惰性匹配。

正则 **`/\d{2,5}/`**，表示数字连续出现 2 到 5 次。会匹配 2 位、3 位、4 位、5 位连续数字。

正则 **`/\d{2,5}?/`** 表示，虽然 2 到 5 次都行，当 2 个就够的时候，就不再往下尝试了。

## 多选分支

正则 **`(p1|p2|p3)`**，其中 p1、p2 和 p3 是子模式，用 |（管道符）分隔，表示其中任何之一。

分支结构也是惰性的，即当前面的匹配上了，后面的就不再尝试了。

## 位置匹配

位置关键词：`^`、`$`、`\b`、`\B`、`(?=p)`、`(?!p)`

- ^（脱字符）匹配开头，在多行匹配中匹配行开头。
- $（美元符号）匹配结尾，在多行匹配中匹配行结尾。
- \b 是单词边界，具体就是 \w 与 \W 之间的位置，也包括 \w 与 ^ 之间的位置，和 \w 与 $ 之间的位置。
- \B 就是 \b 的反面的意思，非单词边界。
- (?=p) 其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。
- (?!p) 就是 (?=p) 的反面意思。

![reg](../../assets/reg3.png)

## 分组和分支结构（括号的使用）

- 分组可以用来提取和替换数据

```js
// 比如提取出年、月、日，可以这么做：
let regex = /(\d{4})-(\d{2})-(\d{2})/;
let str = "2020-08-02";
console.log(str.match(regex));
// => ["2020-08-02", "2020", "08", "02", index: 0, input: "2020-08-02"]

// 把 yyyy-mm-dd 格式，替换成 mm/dd/yyyy
let reg6 = /(\d{4})-(\d{2})-(\d{2})/;
console.log("2020-08-02".replace(reg6, "$2/$3/$1"));
// => "08/02/2020"
```

- 反向引用
  1. 括号嵌套怎么办？以左括号（开括号）为准。
  2. \10 是表示第 10 个分组
  3. 在正则里引用了不存在的分组时，此时正则不会报错，只是匹配反向引用的字符本身。例如 \2，就匹配 "\2"。
  4. 分组后面有量词的话，分组最终捕获到的数据是最后一次的匹配。

```js
let reg7 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
let string5 = "2017-06-12";
let string2 = "2017/06/12";
let string3 = "2017.06.12";
let string4 = "2016-06/12";
console.group("反向引用");
console.log(reg7.test(string5)); // true
console.log(reg7.test(string2)); // true
console.log(reg7.test(string3)); // true
console.log(reg7.test(string4)); // false
console.groupEnd();
```

- 非捕获括号

上面的例子它们是捕获型分组和捕获型分支。如果只想要括号最原始的功能，但不会引用它，即，既不在 API 里引用，也不在正则里反向引用。此时可以使用非捕获括号 (?:p) 和 (?:p1|p2|p3)

## 修饰符

- g 全局匹配，即找到所有匹配的，单词是 global。
- i 忽略字母大小写，单词是 ingoreCase。
- m 多行匹配，只影响 ^ 和 $，二者变成行的概念，即行开头和行结尾。单词是 multiline。

## 操作方法

用于正则操作的方法，共有 6 个，字符串实例 4 个，正则实例 2 个：

- String.prototype.split
- String.prototype.replace
- String.prototype.search
- String.prototype.match
- RegExp.prototype.test
- RegExp.prototype.exec

这些操作常用于：验证、切分、提取、替换

`match` 返回结果的格式，与正则对象是否有修饰符 `g` 有关。没有 `g`，返回的是标准匹配格式，即，数组的第一个元素是整体匹配的内容，接下来是分组捕获的内容，然后是整体匹配的第一个下标，最后是输入的目标字符串。有 g，返回的是所有匹配的内容。

`test` 整体匹配时需要使用 `^` 和 `$`

## 总结

一些容易混淆的表达式总结 `(?:pattern)`、`(?=pattern)`、`(?!pattern)`、`(?<=pattern)`和`(?<!pattern)`

如果一个正则表达式在字符串里面有多个匹配，现在一般使用`g`修饰符或`y`修饰符，在循环里面逐一取出。
```js
var regex = /t(e)(st(\d?))/g;
var string = 'test1test2test3';
var matches = [];
var match;
while (match = regex.exec(string)) {
  matches.push(match);
}
// [
//   ["test1", "e", "st1", "1", index: 0, input: "test1test2test3"],
//   ["test2", "e", "st2", "2", index: 5, input: "test1test2test3"],
//   ["test3", "e", "st3", "3", index: 10, input: "test1test2test3"]
// ]
```
[JavaScript 正则表达式迷你书]
