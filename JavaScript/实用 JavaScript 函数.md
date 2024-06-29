# 实用 JavaScript 函数

## 打乱数组

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

## 数组去重

```js
const removeDuplicated = (arr) => [...new Set(arr)];
console.log(removeDuplicated([1, 2, 3, 3, 4, 4, 5, 5, 6])); // Result: [ 1, 2, 3, 4, 5, 6 ]

const removeDuplicate = (arr) => Object.values(arr.reduce((a, b) => (a[b] ? a : { ...a, [b]: b }), {}));
console.log(removeDuplicate([1, 2, 3, 3])); // Result: [ 1, 2, 3, ]
```

## 生成随机数

```js
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
console.log(random(1, 10)); // Result: 1 ~ 10
```

## 随机选取数组中的一个数

```js
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
console.log(pick([1, 2, 3, 4])); // 2
```

## 寻找两个数组的交集

```js
const intersection = (arr1, arr2) => {
  const set = new Set(arr1);
  return arr2.filter((x) => set.has(x));
};
console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

## 判断是否空对象

```js
const isEmpty = (obj) => Object.keys(obj).length === 0;
console.log(isEmpty({})); // true
```
