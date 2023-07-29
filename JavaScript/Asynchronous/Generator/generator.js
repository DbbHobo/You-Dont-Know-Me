function* gen() {
    let x = 1,y = 2
    yield x + y
    yield 6
}
let result = gen()
console.log(result.next())
console.log(result.next())
console.log(result.next())