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


let str1 = 'fxxking'
let str2 = 'tomboy'
console.group('String.prototype.concat')
console.log(str1.concat(str2))
console.groupEnd()

let str3 = 'Unnecessary event listeners can cause all sorts of odd problems so it’s good to clean them up when you don’t need them anymore. '
console.group('String.prototype.indexOf & String.prototype.lastIndexOf')
console.log(str3.indexOf('event'))
console.log(str3.lastIndexOf('up'))
console.groupEnd()

let str4 = 'Unnecessary event listeners can cause all sorts of odd problems so it’s good to clean them up when you don’t need them anymore. '
console.group('String.prototype.replace')
console.log(str4.replace('Unnecessary', 'necessary'))
console.log(str4.replace(/e/g,'6'))
console.groupEnd()

let str5 = 'Unnecessary event listeners can cause all sorts of odd problems so it’s good to clean them up when you don’t need them anymore. '
console.group('String.prototype.slice')
console.log(str5.slice(0,11))
console.groupEnd()

let str6 = 'Unnecessary event listeners'
console.group('String.prototype.split')
console.log(str6.split(''))
console.groupEnd()

let str7 = 'Unnecessary event listeners'
console.group('String.prototype.substring')
console.log(str7.substring(12,17))
console.groupEnd()

let str8 = '  Unnecessary event listeners can cause all sorts of odd problems so it’s good to clean them up when you don’t need them anymore.  '
console.group('String.prototype.trim & String.prototype.trimStart & String.prototype.trimEnd')
console.log(str8.trim())
console.log(str8.trimStart())
console.log(str8.trimEnd())
console.groupEnd()

let str9 = 'everyday'
console.group('String.prototype.repeat')
console.log(`I'm happy ${str9.repeat(2)}`)
console.groupEnd()

let str10 = 'Unnecessary event listeners can cause all sorts of odd problems so it’s good to clean them up when you don’t need them anymore. '
console.group('String.prototype.includes')
console.log(str10.includes('problems'))
console.groupEnd()

let str11 = 'Unnecessary event listeners can cause ALL. '
let reg = /[A-Z]/g
console.group('String.prototype.search')
console.log(str11.search(reg))
console.groupEnd()

let str12 = 'Unnecessary event listeners can cause ALL. '
console.group('String.prototype.charAt & String.prototype.charCodeAt & String.prototype.codePointAt')
console.log(str11.charAt(5))
console.log(str11.charCodeAt(5))
console.log(str11.codePointAt(5))
console.groupEnd()

let str13 = 'Unnecessary event listeners can cause ALL. '
let reg1 = /[A-Z]/g
console.group('String.prototype.match')
console.log(str13.match(reg1))
console.log([...str13.matchAll(reg1)])
console.groupEnd()

let str14 = 'Unnecessary event listeners can cause all. '
console.group('String.prototype.startsWith & String.prototype.endsWith')
console.log(str14.startsWith('Unnecessary'))
console.log(str14.endsWith('Unnecessary'))
console.groupEnd()
