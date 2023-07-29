# Generator

## Generator定义

`Generator` 函数是一个状态机，封装了多个内部状态。

执行 `Generator` 函数会返回一个遍历器对象，也就是说，`Generator` 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function 关键字与函数名之间有一个星号；二是，函数体内部使用 yield 表达式，定义不同的内部状态。

调用遍历器对象的 next 方法，使得指针移向下一个状态。也就是说，每次调用 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式（或 return 语句）为止。换言之，**`Generator` 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行**。

`Generator` 函数可以**暂停执行**和**恢复执行**，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

`next` 方法返回值的 `value` 属性，是 `Generator` 函数向外输出数据；`next` 方法还可以接受参数，向 `Generator` 函数体内输入数据。

## Generator的实例方法

### Generator.prototype.next()

`Generator.prototype.next()`方法：Generator 函数的next方法可以带一个参数，该参数就会被当作**上一个yield表达式的返回值**。Generator 函数通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}
var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

上面代码中，第二次运行`next`方法的时候不带参数，导致 y 的值等于2 * undefined（即NaN），除以 3 以后还是NaN，因此返回对象的value属性也等于NaN。第三次运行`Next`方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。

如果向`next`方法提供参数，返回结果就完全不一样了。上面代码第一次调用b的`next`方法时，返回x+1的值6；第二次调用`next`方法，将上一次`yield`表达式的值设为12，因此y等于24，返回y / 3的值8；第三次调用`next`方法，将上一次`yield`表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。

注意，由于`next`方法的参数表示上一个`yield`表达式的返回值，所以在第一次使用`next`方法时，传递参数是无效的。V8 引擎直接忽略第一次使用`next`方法时的参数，只有从第二次使用`next`方法开始，参数才是有效的。从语义上讲，第一个`next`方法用来启动遍历器对象，所以不用带有参数。

### Generator.prototype.throw()

`Generator.prototype.throw()`方法：Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

### Generator.prototype.return()

`Generator.prototype.return()`方法：Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

## JavaScript执行相关

### 进程

计算机的核心是 CPU，它承担了所有的计算任务。它就像一座工厂，时刻在运行。假定工厂的电力有限，一次只能供给一个车间使用。也就是说，一个车间开工的时候，其他车间都必须停工。背后的含义就是，单个 CPU 一次只能运行一个任务。进程就好比工厂的车间，它代表 CPU 所能处理的单个任务。任一时刻，CPU 总是运行一个进程，其他进程处于非运行状态。

### 线程

JS 是**单线程**运行的。

### 协程

协程是一种比线程更加轻量级的存在，协程处在线程的环境中，**一个线程可以存在多个协程**，可以将协程理解为线程中的一个个任务。不同于进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

### 同步 异步

**异步**，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。这种不连续的执行，就叫做异步。

**同步**，相应地，连续的执行就叫做同步。由于是连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着。

### Iterator 遍历器

遍历器（`Iterator`）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员），比如 `for...of`。

一个对象如果要具备可被 `for...of` 循环调用的 `Iterator` 接口，就必须在 `Symbol.iterator` 的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。

### for...of循环

`for...of`循环可以自动遍历 `Generator` 函数运行时生成的`Iterator`对象，且此时不再需要调用`next`方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

上面代码使用`for...of`循环，依次显示 5 个yield表达式的值。这里需要注意，一旦next方法的返回对象的done属性为true，`for...of`循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在`for...of`循环之中。

## 参考资料

[Generator 函数的异步应用](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/generator-async#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
