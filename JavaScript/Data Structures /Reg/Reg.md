# Reg

## 横向模糊匹配

横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。使用量词。譬如 {m,n}，表示连续出现最少 m 次，最多 n 次。

使用量词。譬如 {m,n}，表示连续出现最少 m 次，最多 n 次。

![reg](../../assets/reg2.png)

## 纵向模糊匹配

纵向模糊指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多可能。

正则 **/a[123]b/** 可以匹配如下三种字符串： "a1b"、"a2b"、"a3b"。

某位字符可以是任何东西，但就不能是 "a"、"b"、"c"。此时就是排除字符组（反义字符组）的概念。例如正则 **[^abc]**，表示是一个除 "a"、"b"、"c"之外的任意一个字符。

^在方括号表达式中使用，此时它表示不接受该字符集合。要匹配 ^ 字符本身，请使用 \^。

## 范围表示

[123456abcdefGHIJKLM]，可以写成 **[1-6a-fG-M]**。用连字符 - 来省略和简写。

因为连字符有特殊用途，那么要匹配 "a"、"-"、"z" 这三者中任意一个字符，该怎么做呢？不能写成 [a-z]，因为其表示小写字符中的任何一个字符。可以写成如下的方式：**[-az]** 或 **[az-]** 或 **[a\-z]**。

![reg](../../assets/reg1.png)

## 贪婪匹配与惰性匹配

通过在量词后面加个问号就能实现惰性匹配。

正则 **/\d{2,5}/**，表示数字连续出现 2 到 5 次。会匹配 2 位、3 位、4 位、5 位连续数字。

正则 **/\d{2,5}?/** 表示，虽然 2 到 5 次都行，当 2 个就够的时候，就不再往下尝试了。

## 多选分支

正则 **(p1|p2|p3)**，其中 p1、p2 和 p3 是子模式，用 |（管道符）分隔，表示其中任何之一。

分支结构也是惰性的，即当前面的匹配上了，后面的就不再尝试了。

## 位置匹配

位置关键词：^、$、\b、\B、(?=p)、(?!p)

- ^（脱字符）匹配开头，在多行匹配中匹配行开头。
- $（美元符号）匹配结尾，在多行匹配中匹配行结尾。
- \b 是单词边界，具体就是 \w 与 \W 之间的位置，也包括 \w 与 ^ 之间的位置，和 \w 与 $ 之间的位置。
- \B 就是 \b 的反面的意思，非单词边界。
- (?=p)，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。
- (?!p) 就是 (?=p) 的反面意思。

![reg](../../assets/reg3.png)

## 分组和分支结构（括号的使用）

- 分组可以用来提取和替换数据

```js
// 比如提取出年、月、日，可以这么做：
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2020-08-02";
console.log(string.match(regex));
// => ["2020-08-02", "2020", "08", "02", index: 0, input: "2020-08-02"]

// 把 yyyy-mm-dd 格式，替换成 mm/dd/yyyy
var reg6 = /(\d{4})-(\d{2})-(\d{2})/;
console.log("2020-08-02".replace(reg6, "$2/$3/$1"));
// => "08/02/2020"
```

- 反向引用
  1. 括号嵌套怎么办？以左括号（开括号）为准。
  2. \10 是表示第 10 个分组
  3. 在正则里引用了不存在的分组时，此时正则不会报错，只是匹配反向引用的字符本身。例如 \2，就匹配 "\2"。
  4. 分组后面有量词的话，分组最终捕获到的数据是最后一次的匹配。

```js
var reg7 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var string5 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
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

- String#split
- String#replace
- String#search
- String#match
- RegExp#test
- RegExp#exec

这些操作常用于：验证、切分、提取、替换

match 返回结果的格式，与正则对象是否有修饰符 g 有关。没有 g，返回的是标准匹配格式，即，数组的第一个元素是整体匹配的内容，接下来是分组捕获的内容，然后是整体匹配的第一个下标，最后是输入的目标字符串。有 g，返回的是所有匹配的内容。

test 整体匹配时需要使用 ^ 和 $

## 总结

一些容易混淆的表达式总结 (?:pattern)、(?=pattern)、(?!pattern)、(?<=pattern)和(?<!pattern)

[JavaScript 正则表达式迷你书]
