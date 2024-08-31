# 实用 JavaScript 函数

## 字符串

### 字符串大小写转换

```js
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### 字符串转换为驼峰写法

```js
function toCamelCase(input) {
    return (
        input
            // Replace kebab-case, snake_case, and spaces with a space
            .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
            // Handle PascalCase
            .replace(/^[A-Z]/, (char) => char.toLowerCase())
    );
}
```

### 字符串转换为-链接写法

```js
function toKebabCase(input) {
    return (
        input
            // Handle camelCase and PascalCase by inserting a dash before uppercase letters
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            // Replace underscores and spaces with dashes
            .replace(/[_\s]+/g, '-')
            // Convert the entire string to lowercase
            .toLowerCase()
    );
}
```

### 字符串是否包含另外一个字符串

```js
function contains(str, substring) {
    return str.indexOf(substring) !== -1;
}
```

### 字符串全替换

```js
function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}
```

### HTML转换避免xss攻击

```js
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (match) {
        const escapeChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeChars[match];
    });
}
```

### 金钱格式转换

```js
function formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ',') {
    try {
        // Ensure the amount is a number and fix the decimal places
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';
        let i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
            (decimalCount
                ? decimal +
                    Math.abs(amount - i)
                        .toFixed(decimalCount)
                        .slice(2)
                : '')
        );
    } catch (e) {
        console.log(e);
    }
}

console.log(formatMoney(1234567.89)); // 1,234,567.89
console.log(formatMoney(1234567.89, 3)); // 1,234,567.890
console.log(formatMoney(-1234567.89, 2, '.', ',')); // -1,234,567.89
console.log(formatMoney(1234567.89, 0, '.', ',')); // 1,234,568
console.log(formatMoney(1234.56, 2, ',', '.')); // 1.234,56
```

## 数组

### 打乱数组

```js
// ---改变原数组---
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// ---不改变原数组---
function shuffle(array) {
  let newArray = array.slice();
  let currentIndex = newArray.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
}
```

### 数组去重

```js
const removeDuplicated = (arr) => [...new Set(arr)];
console.log(removeDuplicated([1, 2, 3, 3, 4, 4, 5, 5, 6])); // Result: [ 1, 2, 3, 4, 5, 6 ]

const removeDuplicate = (arr) => Object.values(arr.reduce((a, b) => (a[b] ? a : { ...a, [b]: b }), {}));
console.log(removeDuplicate([1, 2, 3, 3])); // Result: [ 1, 2, 3, ]
```

### 生成随机数

```js
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
console.log(random(1, 10)); // Result: 1 ~ 10
```

### 随机选取数组中的一个数

```js
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
console.log(pick([1, 2, 3, 4])); // 2
```

### 寻找两个数组的交集

```js
const intersection = (arr1, arr2) => {
  const set = new Set(arr1);
  return arr2.filter((x) => set.has(x));
};
console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

### 一个数组插入另一个数组(重复值只出现一次)

```js
function intersect(array1, array2) {
    return array1.filter((x) => array2.includes(x));
}
```

### 数组按指定大小分组

```js
function chunkArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
```

## 对象

### 判断是否对象(非数组)

```js
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
```

### 判断是否空对象

```js
const isEmpty = (obj) => Object.keys(obj).length === 0;
console.log(isEmpty({})); // true
```

### map操作对象属性值

```js
function mapObject(obj, fn) {
    const result = {};
    Object.keys(obj).forEach((key) => {
        result[key] = fn(obj[key], key);
    });
    return result;
}
```

### filter操作对象属性值

```js
function filterObject(obj, fn) {
    const result = {};
    Object.keys(obj).forEach((key) => {
        if (fn(obj[key], key)) {
            result[key] = obj[key];
        }
    });
    return result;
}
```

## Date

### 格式化Date

```js
function formatDate(date, format) {
    const map = {
        mm: ('0' + (date.getMonth() + 1)).slice(-2),
        dd: ('0' + date.getDate()).slice(-2),
        yyyy: date.getFullYear(),
        hh: ('0' + date.getHours()).slice(-2),
        MM: ('0' + date.getMinutes()).slice(-2),
        ss: ('0' + date.getSeconds()).slice(-2)
    };

    return format.replace(/mm|dd|yyyy|hh|MM|ss/gi, (matched) => map[matched]);
}
```
