class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
    static hello() {
        console.log('hello world');
      }
}

typeof Point // "function"
Point === Point.prototype.constructor // true
let p = new Point(1,2)
console.log(Object.keys(Point.prototype))

class ColorPoint extends Point {
    constructor(x, y, color) {
      super(x, y); 
      this.color = color;
    }
    toString() {
      return this.color + ' ' + super.toString(); //调用父类的toString()
    }
  }
ColorPoint.hello();
let cp = new ColorPoint(2, 2, 'red')
console.log(cp.toString())
console.log(Object.getPrototypeOf(ColorPoint) === Point)