# Generator

## Generator定义

`Generator` 函数是一个状态机，封装了多个内部状态。`Generator` 是隐藏类 `Iterator` 的子类。

执行 `Generator` 函数会返回一个遍历器对象，也就是说，`Generator` 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 `Generator` 函数内部的每一个状态。

形式上，`Generator` 函数是一个普通函数，但是有两个特征。一是，`function` 关键字与函数名之间有一个星号；二是，函数体内部使用 `yield` 表达式，定义不同的内部状态。

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```

调用遍历器对象的 `next` 方法，使得指针移向下一个状态。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（或 `return` 语句）为止。换言之，**`Generator` 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行**。

`Generator` 函数可以**暂停执行**和**恢复执行**，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

`next` 方法返回值的 `value` 属性，是 `Generator` 函数向外输出数据；`next` 方法还可以接受参数，向 `Generator` 函数体内输入数据。

## Generator的实例方法

### Generator.prototype.next()

`yield`表达式本身没有返回值，或者说总是返回`undefined`，`Generator` 函数的`next`方法可以带一个参数，该参数就会被当作**上一个yield表达式的返回值**。

`Generator` 函数通过`next`方法的参数，就有办法在 `Generator` 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 `Generator` 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

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

### 共同点

`Generator.prototype.next()`/`Generator.prototype.throw()`/`Generator.prototype.return()`这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 `Generator` 函数恢复执行，并且使用不同的语句替换 `yield` 表达式。

- `next()`是将`yield`表达式换成一个值
- `throw()`是将`yield`表达式换成一个`throw`语句
- `return()`是将`yield`表达式换成一个`return`语句

## JS代码执行相关

### 进程

计算机的核心是 CPU，它承担了所有的计算任务。它就像一座工厂，时刻在运行。假定工厂的电力有限，一次只能供给一个车间使用。也就是说，一个车间开工的时候，其他车间都必须停工。背后的含义就是，单个 CPU 一次只能运行一个任务。进程就好比工厂的车间，它代表 CPU 所能处理的单个任务。任一时刻，CPU 总是运行一个进程，其他进程处于非运行状态。

### 线程

JS 是**单线程**运行的，只能保持一个运行栈。

### 协程

协程是一种比线程更加轻量级的存在，协程处在线程的环境中，**一个线程可以存在多个协程**，可以将协程理解为线程中的一个个任务。不同于进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

### 同步 异步

**异步**，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。这种不连续的执行，就叫做异步。

**同步**，相应地，连续的执行就叫做同步。由于是连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着。

### Generator的运行

JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈（context stack）。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

`Generator` 函数不是这样，它执行产生的上下文环境，一旦遇到 `yield` 命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行 `next` 命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

## 参考资料

[Generator 函数的异步应用](https://es6.ruanyifeng.com/?search=map%28parseInt%29&x=0&y=0#docs/generator-async#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)

[JavaScript Visualized: Generators and Iterators](https://dev.to/lydiahallie/javascript-visualized-generators-and-iterators-e36)

[Why would anyone need JavaScript generator functions?](https://jrsinclair.com/articles/2022/why-would-anyone-need-javascript-generator-functions/)
