const observers = new Set()
observers.add(printName)
observers.add(printAge)

const person = observable({
    name: '张三',
    age: 20
}, observers);

function printName() {
    console.log(`${person.name}`)
}
function printAge() {
    console.log(`${person.age}`)
}

function observable(target,observers) {
    return new Proxy(target, {
        set: (target,key,value,receiver) => {
            let result = Reflect.set(target, key, value, receiver)
            observers.forEach(observer => {
                observer()
            })
            return result
        }
    })
}

person.name = '李四';
person.age = 33;