# Date

收集 Date 常用的一些内置方法

```js
new Date().toUTCString(); // e.g., 'Sun, 10 Nov 2024 23:51:54 GMT'
new Date().toLocaleString(); // e.g., '10/11/2024, 11:52:13 pm'
new Date().toISOString(); // e.g., '2024-11-10T23:52:24.867Z'

new Date().toDateString(); // 'Sun Nov 10 2024'
new Date().toLocaleDateString(); // '10/11/2024'
new Date().toLocaleDateString("en-US"); // '11/10/2024'
```

## Date的静态方法

### Date.now()

返回自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数。

```js
// This example takes 2 seconds to run
const start = Date.now();

console.log('starting timer...');
// Expected output: "starting timer..."

setTimeout(() => {
  const millis = Date.now() - start;

  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
  // Expected output: "seconds elapsed = 2"
}, 2000);
```

### Date.parse()

Date.parse() 方法解析一个表示某个日期的字符串，并返回从 1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的 UTC 时间）的毫秒数，如果该字符串无法识别，或者一些情况下，包含了不合法的日期数值（如：2015-02-31），则返回值为 NaN。

```js
const unixTimeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
const javaScriptRelease = Date.parse('04 Dec 1995 00:12:00 GMT');

console.log(unixTimeZero);
// Expected output: 0

console.log(javaScriptRelease);
// Expected output: 818035920000
```

### Date.UTC()

Date.UTC() 方法接受的参数同 Date 构造函数接受最多参数时一样，但该前者会视它们为 UTC 时间，其返回从 1970 年 1 月 1 日 00:00:00 UTC 到指定时间的毫秒数。

```js
const utcDate1 = new Date(Date.UTC(96, 1, 2, 3, 4, 5));
const utcDate2 = new Date(Date.UTC(0, 0, 0, 0, 0, 0));

console.log(utcDate1.toUTCString());
// Expected output: "Fri, 02 Feb 1996 03:04:05 GMT"

console.log(utcDate2.toUTCString());
// Expected output: "Sun, 31 Dec 1899 00:00:00 GMT"
```

## Date的实例方法

### Date.prototype.getFullYear()

根据本地时间返回指定日期的**年份**。

### Date.prototype.getMonth()

根据本地时间，返回一个指定的日期对象的**月份**，为基于 0 的值（0 表示一年中的第一月）。

### Date.prototype.getDate()

根据本地时间，返回一个指定的日期对象为**一个月中的哪一日**（从 1--31）。

### Date.prototype.getDay()

返回一个具体日期中**一周的第几天**，0 表示星期天( 从 0 -- 6)。

### Date.prototype.getHours()

根据本地时间，返回一个指定的日期对象的**小时**。

### Date.prototype.getMinutes()

根据本地时间，返回一个指定的日期对象的**分钟数**。

### Date.prototype.getSeconds()

根据本地时间，返回一个指定的日期对象的**秒数**。

### Date.prototype.getTime()

返回一个时间的格林威治时间数值。

## 参考资料

[Date-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC)

[Mastering Dates in JavaScript: The Ultimate Guide to Date & Time Handling](https://dev.to/forthegeeks/mastering-dates-in-javascript-the-ultimate-guide-to-date-time-handling-3l38?context=digest)
