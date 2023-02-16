let obj1 = {
  name: 'obj1',
  age: 22,
  gender: 'g'
}
let obj2 = Object.create(obj1)
obj2.name = 'obj2'
obj2.height = '180cm'
console.group('Object.create')
console.log(obj2.name, obj2.age)
console.groupEnd()

let obj3 = Object.assign(obj1, obj2)
console.group('Object.assign')
console.log(obj3)
console.groupEnd()

let obj4 = {};
Object.defineProperty(obj4,'property1',{
    value: 1,
    writable: true
});
Object.defineProperties(obj4, {
  'property2': {
    value: 2,
    writable: true
  },
  'property3': {
    value: 3,
    writable: true
  }
})
console.group('Object.defineProperty & Object.defineProperties')
console.log(obj4,obj4.property1,obj4.property2,obj4.property3)
console.groupEnd()

let obj5 = {
  name: 'obj5',
  introduce: {
    personality: 'very nice!'
  }
}
let obj6 = {
  name: 'obj6',
  age: 99,
  gender: 'woman'
}
Object.setPrototypeOf(obj6, obj5)
console.group('Object.setPrototypeOf & Object.setPrototypeOf')
console.log(obj5, obj6.__proto__, Object.getPrototypeOf(obj6) === obj5)
console.log(Object.getOwnPropertyNames(obj6))
console.groupEnd()

let symbolKey = Symbol('property4')
let obj7 = {
  property1: 1,
  property2: 2
}
obj7[symbolKey] = 4
Object.defineProperty(obj7, 'property3', {
  value: 3,
  configurable: true,
  enumerable: true,
  writable: false
})
console.group('Object.getOwnPropertyDescriptor & Object.getOwnPropertyDescriptors')
obj7.property3 = 5
console.log(Object.getOwnPropertyDescriptors(obj7))
console.log(Object.getOwnPropertyDescriptor(obj7, 'property3'))
console.log(Object.getOwnPropertySymbols(obj7))
console.groupEnd()

// 不能添加新属性
let obj8 = {
  property1: 1,
  property2: 2,
  property3: 3
}
Object.preventExtensions(obj8)
delete obj8.property2
obj8.property4 = 4
console.group('Object.isExtensible & Object.preventExtensible')
console.log(Object.isExtensible(obj8),obj8)
console.groupEnd()

// 不能添加新属性、不能删除已有属性、configurable为false
Object.seal(obj8)
delete obj8.property3
obj8.property3 = 99
console.group('Object.seal & Object.isSealed')
try {
  Object.defineProperty(obj8, 'property3', {
    get: () => { return 'new3' },
    set: (newVal) => { return newVal },
    enumerable: true,
    configurable: true,
  })
} catch (error) {
  console.log(error)
}
console.log(Object.isSealed(obj8),obj8,obj8.property3)
console.groupEnd()

// 不能添加新属性、不能删除已有属性、configurable为false、writable为false
Object.freeze(obj8)
obj8.property3 = 66
console.group('Object.freeze & Object.isFrozen')
console.log(Object.isFrozen(obj8),obj8,obj8.property3)
console.groupEnd()

let obj9 = {
  property1: 1,
  property2: 2,
  property3: 3
}
Object.defineProperty(obj9, 'property4', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 4
})
Object.defineProperty(obj9, 'property5', {
  configurable: true,
  enumerable: true,
  writable: false,
  value: 5
})
let objArr = [['property6', 6],['property7', 7]]
console.group('Object.keys & Object.values & Object.entries & Object.fromEntries')
for (let key of Object.keys(obj9)) {
  console.log(key)
}
for (let value of Object.values(obj9)) {
  console.log(value)
}
for (let [key,value] of Object.entries(obj9)) {
  console.log(key,value)
}
console.log(Object.fromEntries(objArr))
console.groupEnd()

let obj10 = {
  property1: 1,
  property2: 2
}
let obj11 = {
  property3: 3
}
Object.defineProperty(obj10, 'property4', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: 4
})
// Object.assign(obj10, obj11)
console.group('Object.prptotype.hasOwnProperty')
console.log(obj10.hasOwnProperty('property3'))
console.log(obj10.propertyIsEnumerable('property4'))
console.groupEnd()

Object.setPrototypeOf(obj10, obj11)
console.group('for...in')
for (let item in obj10) {
  console.log(item)
}
console.groupEnd

console.group('Object.keys')
for (let item of Object.keys(obj10)) {
  console.log(item)
}
console.groupEnd

console.group('Object.getOwnPropertyNames')
for (let item of Object.getOwnPropertyNames(obj10)) {
  console.log(item)
}
console.groupEnd

console.group('Object.getOwnPropertySymbols')
for (let item of Object.getOwnPropertySymbols(obj10)) {
  console.log(item)
}
console.groupEnd

console.group('Reflect.ownKeys')
for (let item of Reflect.ownKeys(obj10)) {
  console.log(item)
}
console.groupEnd