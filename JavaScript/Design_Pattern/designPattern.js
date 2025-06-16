/*
  工厂模式
*/
class User {
  constructor(name = "", viewPage = []) {
    this.name = name;
    this.viewPage = viewPage;
  }
}

class UserFactory extends User {
  constructor(name, viewPage) {
    super(name, viewPage);
  }
  create(role) {
    switch (role) {
      case "superAdmin":
        return new UserFactory("超级管理员", [
          "首页",
          "通讯录",
          "发现页",
          "应用数据",
          "权限管理",
        ]);
        break;
      case "admin":
        return new UserFactory("管理员", ["首页", "通讯录"]);
        break;
      default:
        throw new Error("params error");
    }
  }
}
let userFactory = new UserFactory();
let superAdmin = userFactory.create("superAdmin");
let admin = userFactory.create("admin");
console.group('');
console.log(superAdmin);
console.log(admin);
console.groupEnd();