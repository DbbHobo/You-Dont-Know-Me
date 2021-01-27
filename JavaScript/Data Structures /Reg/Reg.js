// 匹配 16 进制颜色值
let reg1 = /#([0-9a-fA-F]{6})|([0-9a-fA-F]{3})/g;
let string1 = "#ffbbad #Fc01DF #FFF #ffE";
console.log(reg1.test(string1));
console.log(string1.match(reg1));

// 匹配时间
let reg2 = /^([01][0-9]|2[0-3]):[0-5][0-9]$/g;
console.log(reg2.test("33:59"));

// 匹配日期
let reg3 = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
console.log(reg3.test("2021-01-19"));

// 数字的千位分隔符
let reg4 = /(?!^)(?=(\d{3})+(?=\.))/g;
console.log("12345678.98".replace(reg4, ','));

// 验证密码问题-密码长度 6-12 位，由数字、小写字符和大写字母组成，但必须要有数字和字母。
let reg5 = /(?=.*[0-9])(?=.*[a-z])|(?=.*[0-9])(?=.*[A-Z])^[0-9a-zA-Z]{6,12}$/g;
console.log(reg5.test("1234567"));
console.log(reg5.test("DXX1234567"));

// 把 yyyy-mm-dd 格式，替换成 mm/dd/yyyy 
var reg6 = /(\d{4})-(\d{2})-(\d{2})/;
console.log("2017-06-12".replace(reg6, "$2/$3/$1"));

// 分组
var reg7 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var string5 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
console.group('反向引用');
console.log(reg7.test(string5)); // true
console.log(reg7.test(string2)); // true
console.log(reg7.test(string3)); // true
console.log(reg7.test(string4)); // false
console.groupEnd();

// 首字母大写
function titleize(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (c) {
    return c.toUpperCase();
  });
}
console.log(titleize('hello world to everyone')); // Hello World To Everyone

// 检测标签开闭
var reg8 = /<([^>]+)>[\d\D]*<\/\1>/;
var string6 = "<title>regular expression</title>";
var string7 = "<p>laoyao bye bye</p>";
var string8 = "<title>wrong!</p>";
console.group('标签开闭');
console.log(reg8.test(string6)); // true
console.log(reg8.test(string7)); // true
console.log(reg8.test(string8)); // false
console.groupEnd();

// 身份证校验
var reg9 = /^(\d{15}|\d{17}[\dxX])$/;



// reg888.test("kdfj?ddd");



