let obj = {
    name: 'obj',
    age: 45,
    gender: 'woman',
    intro: 'happy everyday!'
}
let proxyObj = new Proxy(obj, {
    get: function (target, propKey, receiver) {
        console.log('from proxy get');
        return Reflect.get(target, propKey, receiver);
    },
    set: function (target, propKey, value, receiver) {
        console.log('from proxy set');
        return Reflect.set(target, propKey, value, receiver);
    },
    has: function (target, propKey) {
        console.log('from proxy has');
        return Reflect.has(target, propKey);
    },
    deleteProperty: function (target, propKey) {
        console.log('from proxy deleteProperty');
        return Reflect.deleteProperty(target, propKey);
    },
    ownKeys: function (target) {
        console.log('from proxy ownKeys');
        return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor: function (target, propKey) {
        console.log('from proxy getOwnPropertyDescriptor');
        return Reflect.getOwnPropertyDescriptor(target, propKey);
    },
    defineProperty: function (target, propKey,propDesc) {
        console.log('from proxy defineProperty');
        return Reflect.defineProperty(target, propKey,propDesc);
    },
    preventExtensions: function (target) {
        console.log('from proxy preventExtensions');
        return Reflect.preventExtensions(target);
    },
    getPrototypeOf: function (target) {
        console.log('from proxy getPrototypeOf');
        return Reflect.getPrototypeOf(target);
    },
    isExtensible: function (target) {
        console.log('from proxy isExtensible');
        return Reflect.isExtensible(target);
    },
    setPrototypeOf: function (target, propKey) {
        console.log('from proxy setPrototypeOf');
        return Reflect.setPrototypeOf(target, propKey);
    }
})

let funObj = function () {
    console.log('Im a function')
}
let funProxy = new Proxy(funObj, {
    apply: function (target, ctx, args) {
        console.log('from proxy apply');
        return Reflect.apply(...arguments);
    },
    construct: function (target, args, newTarget) {
        console.log('from proxy construct');
        return new target(...args);
    },
})


console.group('Proxy---get')
console.log(proxyObj.name)
console.groupEnd()

console.group('Proxy---set')
console.log(proxyObj.name = 'proxyObj')
console.groupEnd()

console.group('Proxy---has')
console.log('name' in proxyObj)
console.groupEnd()

console.group('Proxy---deleteProperty')
console.log(delete proxyObj.name, proxyObj)
console.groupEnd()

console.group('Proxy---ownKeys')
console.log(Object.keys(proxyObj))
console.groupEnd()

console.group('Proxy---getOwnPropertyDescriptor')
console.log(Object.getOwnPropertyDescriptor(proxyObj, 'age'))
console.groupEnd()

console.group('Proxy---defineProperty')
console.log(proxyObj.name = 'newProxyObj')
console.groupEnd()

console.group('Proxy---preventExtensions')
Object.preventExtensions(proxyObj)
console.groupEnd()

console.group('Proxy---getPrototypeOf')
console.log(Object.getPrototypeOf(proxyObj) === Object.prototype)
console.groupEnd()

console.group('Proxy---isExtensible')
console.log(Object.isExtensible(proxyObj))
console.groupEnd()

console.group('Proxy---getPrototypeOf')
console.log(Object.getPrototypeOf(proxyObj))
console.groupEnd()

console.group('Proxy---apply')
funProxy.apply(obj)
console.groupEnd()

console.group('Proxy---construct')
new funProxy()
console.groupEnd()