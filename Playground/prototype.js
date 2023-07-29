// function Parent() {
//     this.name = 'hello'
//     this.arr = [1]
// }
// function Child() {
//     this.age = 22
//     Parent.call(this)
// }
// Child.prototype = new Parent()

// let childInstance1 = new Child()
// let childInstance2 = new Child()
// let parentInstance = new Parent()

// childInstance1.arr.push(2)
// console.log(childInstance2.arr)

function Sub() {
    Super.call(this)
    this.name = 'sub'
}
function Super() {
    this.name = 'super'
    this.arr = [1]
}
Super.prototype.getName = function () {
    console.log(this.name)
    return this.name
}
function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype); //创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
}
inheritPrototype(Sub, Super)
let subObj1 = new Sub()
let subObj2 = new Sub()
let superObj = new Super()
subObj1.arr.push(2)
subObj1.getName()
subObj2.getName()
console.log(subObj1.arr, subObj2.arr, superObj.arr)

function fakeInstanceOf(left, right) {
    let prototype = left.__proto__
    let originalPrototype = right.prototype
    while (true) {
        if(!prototype) return false
        if (prototype === originalPrototype) return true
        prototype = prototype.__proto__
    }
}
console.log(fakeInstanceOf(subObj1, Super))

console.log(typeof subObj1)
console.log(typeof Super)
console.log(typeof null)
console.log(typeof undefined)
console.log(typeof '')