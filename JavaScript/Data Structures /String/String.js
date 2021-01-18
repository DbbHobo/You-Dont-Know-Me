/* 字符串去重 */
const stringUniq = (str) => [...new Set(str)].join('')
console.log(stringUniq('I wanna reverse the string...'))


/* 填充一个字符串到指定的长度 */
const eightBits = '001'.padStart(8, '0')
console.log(eightBits) // "00000001"

const anonymizedCode = "34".padEnd(5, "*")
console.log(anonymizedCode) // "34***"



/* 翻转字符串 */
const reversedWord = (str) => [...str].reverse().join("")
console.log(reversedWord('I wanna reverse the string...'))