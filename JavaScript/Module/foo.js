function foo() {
  let test = 3;
  setTimeout(() => {
    test = 5;
  }, 3000);
  console.log("模块化", test);
}

module.exports = { foo };
