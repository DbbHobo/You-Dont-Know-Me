# ArrayBuffer TypedArray DataView

## ArrayBuffer

`ArrayBuffer` 对象、`TypedArray` 视图和 `DataView` 视图是 `JavaScript` 操作二进制数据的一个接口。它们都是以数组的语法处理二进制数据，所以统称为二进制数组。

`ArrayBuffer` 对象代表储存二进制数据的一段内存，它不能直接读写，只能通过`TypedArray` 视图或者 `DataView` 视图来读写，视图的作用是以指定格式解读二进制数据。

- `ArrayBuffer` 对象用来表示通用的原始二进制数据缓冲区
- `TypedArray` 视图用来读写简单类型的二进制数据
- `DataView` 视图用来读写复杂类型的二进制数据

Javascript 中有两种类型的缓冲：`ArrayBuffer` 和 `SharedArrayBuffer`。它们都是内存块的低级表示。缓冲支持以下操作：

- 分配：创建一个新的缓冲时，会分配一个新的内存块，并且初始化为 0。
- 复制：使用 `slice()` 方法，你可以高效地复制缓冲中的一部分数据，而不需要创建视图来手动复制每一个字节。
- 转移：使用 `transfer()` 和 `transferToFixedLength()` 方法，可以将内存块的所有权转移给一个新的缓冲对象。若你想要在不同的执行上下文间转移数据，又不想复制，这些方法就很有用。转移后，原始缓冲将不再可用。`SharedArrayBuffer` 不能被转移（因为缓冲已经被所有执行上下文共享）。
- 调整大小：使用 `resize()` 方法，可以调整内存块的大小（只要不超过预设的 `maxByteLength` 限制）。`SharedArrayBuffer` 只能增长，不能缩小。

很多浏览器操作的 API，用到了二进制数组操作二进制数据，下面是其中的几个：

- Canvas
- Fetch API
- File API
- WebSockets
- XMLHttpRequest

### ArrayBuffer 的静态方法

#### ArrayBuffer.isView()

`ArrayBuffer.isView()` 静态方法判断传入值是否是 `ArrayBuffer` 视图之一，例如 `TypedArray` 或 `DataView`。

```js
// Create an ArrayBuffer with a size in bytes
const buffer = new ArrayBuffer(16)

console.log(ArrayBuffer.isView(new Int32Array()))
// Expected output: true
```

### ArrayBuffer 的实例属性和方法

#### ArrayBuffer.prototype.byteLength

`ArrayBuffer` 实例的 `byteLength` 访问器属性返回该数组缓冲区的长度（以字节为单位）。

```js
// Create an ArrayBuffer with a size in bytes
const buffer = new ArrayBuffer(8)

// Use byteLength to check the size
const bytes = buffer.byteLength

console.log(bytes)
// Expected output: 8
```

#### ArrayBuffer.prototype.detached

`ArrayBuffer` 实例的 `detached` 访问器属性返回一个布尔值，指示该缓冲区是否已经分离（传输）。

```js
const buffer = new ArrayBuffer(8)
console.log(buffer.detached) // false
const newBuffer = buffer.transfer()
console.log(buffer.detached) // true
console.log(newBuffer.detached) // false
```

#### ArrayBuffer.prototype.maxByteLength

`ArrayBuffer` 实例的 `maxByteLength` 访问器属性返回该数组缓冲区可调整到的最大长度（以字节为单位）。

```js
const buffer = new ArrayBuffer(8, { maxByteLength: 16 })

console.log(buffer.byteLength)
// Expected output: 8

console.log(buffer.maxByteLength)
// Expected output: 16
```

#### ArrayBuffer.prototype.resizable

`ArrayBuffer` 实例的 `resizable` 访问器属性返回此数组缓冲区是否可以调整大小。

```js
const buffer1 = new ArrayBuffer(8, { maxByteLength: 16 })
const buffer2 = new ArrayBuffer(8)

console.log(buffer1.resizable)
// Expected output: true

console.log(buffer2.resizable)
// Expected output: false
```

#### ArrayBuffer.prototype.resize()

`ArrayBuffer` 实例的 `resize()` 方法将 `ArrayBuffer` 调整为指定的大小，以字节为单位。

```js
const buffer = new ArrayBuffer(8, { maxByteLength: 16 })

console.log(buffer.byteLength)
// Expected output: 8

buffer.resize(12)

console.log(buffer.byteLength)
// Expected output: 12
```

#### ArrayBuffer.prototype.slice()

`ArrayBuffer` 实例的 `slice()` 方法返回一个新的 `ArrayBuffer` 实例，其包含原 `ArrayBuffer` 实例中从 `begin` 开始（包含）到 `end` 结束（不含）的所有字节的副本。

```js
// Create an ArrayBuffer with a size in bytes
const buffer = new ArrayBuffer(16)
const int32View = new Int32Array(buffer)
// Produces Int32Array [0, 0, 0, 0]

int32View[1] = 42
const sliced = new Int32Array(buffer.slice(4, 12))
// Produces Int32Array [42, 0]

console.log(sliced[0])
// Expected output: 42
```

#### ArrayBuffer.prototype.transfer()

`ArrayBuffer` 实例的 `transfer()` 方法创建一个内容与该缓冲区相同的新 `ArrayBuffer` 实例，然后将当前缓冲区分离。

```js
// 创建一个 ArrayBuffer 并写入一些字节
const buffer = new ArrayBuffer(8)
const view = new Uint8Array(buffer)
view[1] = 2
view[7] = 4

// 将缓冲区复制到另一个相同大小的缓冲区
const buffer2 = buffer.transfer()
console.log(buffer.detached) // true
console.log(buffer2.byteLength) // 8
const view2 = new Uint8Array(buffer2)
console.log(view2[1]) // 2
console.log(view2[7]) // 4

// 将缓冲区复制到一个更小的缓冲区
const buffer3 = buffer2.transfer(4)
console.log(buffer3.byteLength) // 4
const view3 = new Uint8Array(buffer3)
console.log(view3[1]) // 2
console.log(view3[7]) // undefined

// 将缓冲区复制到一个更大的缓冲区
const buffer4 = buffer3.transfer(8)
console.log(buffer4.byteLength) // 8
const view4 = new Uint8Array(buffer4)
console.log(view4[1]) // 2
console.log(view4[7]) // 0

// 已经分离，抛出 TypeError
buffer.transfer() // TypeError: Cannot perform ArrayBuffer.prototype.transfer on a detached ArrayBuffer
```

#### ArrayBuffer.prototype.transferToFixedLength()

`ArrayBuffer` 实例的 `transferToFixedLength()` 方法创建一个不可调整大小的新 `ArrayBuffer` 对象，该对象与此缓冲区具有相同的字节内容，然后将此缓冲区分离。

```js
const buffer = new ArrayBuffer(8, { maxByteLength: 16 })
const view = new Uint8Array(buffer)
view[1] = 2
view[7] = 4

const buffer2 = buffer.transferToFixedLength()
console.log(buffer2.byteLength) // 8
console.log(buffer2.resizable) // false
const view2 = new Uint8Array(buffer2)
console.log(view2[1]) // 2
console.log(view2[7]) // 4
```

## TypedArray

`TypedArray` 视图提供了多种类型，用于以不同的格式操作二进制数据。以下是所有 `TypedArray` 类型及其特性：

- **Int8Array**：8 位有符号整数，每个元素占用 1 个字节。
- **Uint8Array**：8 位无符号整数，每个元素占用 1 个字节。
- **Uint8ClampedArray**：8 位无符号整数，每个元素占用 1 个字节，溢出时会被截断为最大值（255），而不是循环到 0。
- **Int16Array**：16 位有符号整数，每个元素占用 2 个字节。
- **Uint16Array**：16 位无符号整数，每个元素占用 2 个字节。
- **Int32Array**：32 位有符号整数，每个元素占用 4 个字节。
- **Uint32Array**：32 位无符号整数，每个元素占用 4 个字节。
- **Float32Array**：32 位浮点数，每个元素占用 4 个字节。
- **Float64Array**：64 位浮点数，每个元素占用 8 个字节。

```js
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8)

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b)

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2)

// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2)
```

普通数组的操作方法和属性，对 `TypedArray` 数组完全适用，除了 `contact` 方法。

### TypedArray 的静态属性和方法

### TypedArray.BYTES_PER_ELEMENT

`TypedArray.BYTES_PER_ELEMENT` 是一个只读属性，表示 `TypedArray` 数组中每个元素所占用的字节数。

```js
console.log(Int8Array.BYTES_PER_ELEMENT) // 1
console.log(Uint16Array.BYTES_PER_ELEMENT) // 2
console.log(Float32Array.BYTES_PER_ELEMENT) // 4
```

### TypedArray[Symbol.species]

`TypedArray[Symbol.species]` 是一个访问器属性，返回构造函数，用于创建派生对象。

```js
class MyInt8Array extends Int8Array {
  static get [Symbol.species]() {
    return Int8Array
  }
}

const myArray = new MyInt8Array(4)
const mappedArray = myArray.map((x) => x + 1)

console.log(mappedArray instanceof MyInt8Array) // false
console.log(mappedArray instanceof Int8Array) // true
```

### TypedArray.from()

`TypedArray.from()` 方法从一个类似数组或可迭代对象创建一个新的 `TypedArray` 实例。

```js
const arr = Int16Array.from([1, 2, 3, 4])
console.log(arr) // Int16Array [1, 2, 3, 4]
```

可以传入一个映射函数：

```js
const arr = Uint8Array.from([1, 2, 3], (x) => x * 2)
console.log(arr) // Uint8Array [2, 4, 6]
```

### TypedArray.of()

`TypedArray.of()` 方法创建一个新的 `TypedArray` 实例，参数是元素的值。

```js
const arr = Float32Array.of(1.1, 2.2, 3.3)
console.log(arr) // Float32Array [1.1, 2.2, 3.3]
```

### TypedArray 的实例方法

以下是 `TypedArray` 的实例方法，这些方法与普通数组的方法类似，但专为操作二进制数据设计：

- **TypedArray.prototype.copyWithin(target, start[, end = this.length])**  
  在当前数组中复制一部分元素到其他位置，并返回它，不会改变数组的长度。

- **TypedArray.prototype.entries()**  
  返回一个新的数组迭代器对象，该对象包含数组中每个索引的键值对。

- **TypedArray.prototype.every(callbackfn, thisArg?)**  
  测试数组中的所有元素是否都通过了提供的函数的测试。

- **TypedArray.prototype.fill(value, start=0, end=this.length)**  
  用一个固定值填充数组中从起始索引到终止索引的所有元素。

- **TypedArray.prototype.filter(callbackfn, thisArg?)**  
  创建一个新数组，其包含通过所提供函数实现的测试的所有元素。

- **TypedArray.prototype.find(predicate, thisArg?)**  
  返回数组中满足提供的测试函数的第一个元素的值。

- **TypedArray.prototype.findIndex(predicate, thisArg?)**  
  返回数组中满足提供的测试函数的第一个元素的索引。

- **TypedArray.prototype.forEach(callbackfn, thisArg?)**  
  对数组中的每个元素执行一次提供的函数。

- **TypedArray.prototype.indexOf(searchElement, fromIndex=0)**  
  返回数组中首次出现指定元素的索引，如果不存在则返回 -1。

- **TypedArray.prototype.join(separator)**  
  将数组的所有元素连接成一个字符串。

- **TypedArray.prototype.keys()**  
  返回一个新的数组迭代器对象，该对象包含数组中每个索引的键。

- **TypedArray.prototype.lastIndexOf(searchElement, fromIndex?)**  
  返回数组中最后一次出现指定元素的索引，如果不存在则返回 -1。

- **TypedArray.prototype.map(callbackfn, thisArg?)**  
  创建一个新数组，其结果是该数组中的每个元素调用一个提供的函数后返回的结果。

- **TypedArray.prototype.reduce(callbackfn, initialValue?)**  
  对数组中的每个元素执行一个由您提供的 reducer 函数（升序执行），将其结果汇总为单个返回值。

- **TypedArray.prototype.reduceRight(callbackfn, initialValue?)**  
  与 `reduce` 类似，但从数组的最后一个元素开始向前执行。

- **TypedArray.prototype.reverse()**  
  反转数组中元素的顺序。

- **TypedArray.prototype.slice(start=0, end=this.length)**  
  返回一个新的数组对象，这一对象是一个从原数组中选定的开始到结束（不包括结束）部分的浅拷贝。

- **TypedArray.prototype.some(callbackfn, thisArg?)**  
  测试数组中的某些元素是否至少通过了提供的函数的测试。

- **TypedArray.prototype.sort(comparefn)**  
  对数组中的元素进行排序，并返回数组。

- **TypedArray.prototype.toLocaleString(reserved1?, reserved2?)**  
  返回一个字符串表示数组中的元素。元素使用各自的 `toLocaleString` 方法，并使用特定语言环境的字符串分隔符分隔。

- **TypedArray.prototype.toString()**  
  返回一个字符串，表示指定的数组及其元素。

- **TypedArray.prototype.values()**  
  返回一个新的数组迭代器对象，该对象包含数组中每个索引的值。

TypedArray.prototype.set()

## DataView

### DataView 的实例属性和方法

#### DataView.prototype.buffer

`DataView.prototype.buffer` 属性返回与此 `DataView` 关联的 `ArrayBuffer`。

```js
const buffer = new ArrayBuffer(16)
const view = new DataView(buffer)

console.log(view.buffer === buffer)
// Expected output: true
```

#### DataView.prototype.byteLength

`DataView.prototype.byteLength` 属性返回 `DataView` 的字节长度。

```js
const buffer = new ArrayBuffer(16)
const view = new DataView(buffer, 4, 8)

console.log(view.byteLength)
// Expected output: 8
```

#### DataView.prototype.byteOffset

`DataView.prototype.byteOffset` 属性返回 `DataView` 的字节偏移量。

```js
const buffer = new ArrayBuffer(16)
const view = new DataView(buffer, 4, 8)

console.log(view.byteOffset)
// Expected output: 4
```

#### DataView.prototype.getBigInt64()

读取指定位置的 64 位有符号整数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setBigInt64(0, 1234567890123456789n)

console.log(view.getBigInt64(0))
// Expected output: 1234567890123456789n
```

#### DataView.prototype.getBigUint64()

读取指定位置的 64 位无符号整数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setBigUint64(0, 1234567890123456789n)

console.log(view.getBigUint64(0))
// Expected output: 1234567890123456789n
```

#### DataView.prototype.getFloat16()

读取指定位置的 16 位浮点数。

```js
// Note: getFloat16 is not widely supported yet
```

#### DataView.prototype.getFloat32()

读取指定位置的 32 位浮点数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setFloat32(0, 3.14)

console.log(view.getFloat32(0))
// Expected output: 3.14
```

#### DataView.prototype.getFloat64()

读取指定位置的 64 位浮点数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setFloat64(0, 3.141592653589793)

console.log(view.getFloat64(0))
// Expected output: 3.141592653589793
```

#### DataView.prototype.getInt16()

读取指定位置的 16 位有符号整数。

```js
const buffer = new ArrayBuffer(2)
const view = new DataView(buffer)
view.setInt16(0, -32768)

console.log(view.getInt16(0))
// Expected output: -32768
```

#### DataView.prototype.getInt32()

读取指定位置的 32 位有符号整数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setInt32(0, -2147483648)

console.log(view.getInt32(0))
// Expected output: -2147483648
```

#### DataView.prototype.getInt8()

读取指定位置的 8 位有符号整数。

```js
const buffer = new ArrayBuffer(1)
const view = new DataView(buffer)
view.setInt8(0, -128)

console.log(view.getInt8(0))
// Expected output: -128
```

#### DataView.prototype.getUint16()

读取指定位置的 16 位无符号整数。

```js
const buffer = new ArrayBuffer(2)
const view = new DataView(buffer)
view.setUint16(0, 65535)

console.log(view.getUint16(0))
// Expected output: 65535
```

#### DataView.prototype.getUint32()

读取指定位置的 32 位无符号整数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setUint32(0, 4294967295)

console.log(view.getUint32(0))
// Expected output: 4294967295
```

#### DataView.prototype.getUint8()

读取指定位置的 8 位无符号整数。

```js
const buffer = new ArrayBuffer(1)
const view = new DataView(buffer)
view.setUint8(0, 255)

console.log(view.getUint8(0))
// Expected output: 255
```

#### DataView.prototype.setBigInt64()

写入 64 位有符号整数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setBigInt64(0, 1234567890123456789n)

console.log(view.getBigInt64(0))
// Expected output: 1234567890123456789n
```

#### DataView.prototype.setBigUint64()

写入 64 位无符号整数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setBigUint64(0, 1234567890123456789n)

console.log(view.getBigUint64(0))
// Expected output: 1234567890123456789n
```

#### DataView.prototype.setFloat16()

写入 16 位浮点数。

```js
// Note: setFloat16 is not widely supported yet
```

#### DataView.prototype.setFloat32()

写入 32 位浮点数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setFloat32(0, 3.14)

console.log(view.getFloat32(0))
// Expected output: 3.14
```

#### DataView.prototype.setFloat64()

写入 64 位浮点数。

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)
view.setFloat64(0, 3.141592653589793)

console.log(view.getFloat64(0))
// Expected output: 3.141592653589793
```

#### DataView.prototype.setInt16()

写入 16 位有符号整数。

```js
const buffer = new ArrayBuffer(2)
const view = new DataView(buffer)
view.setInt16(0, -32768)

console.log(view.getInt16(0))
// Expected output: -32768
```

#### DataView.prototype.setInt32()

写入 32 位有符号整数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setInt32(0, -2147483648)

console.log(view.getInt32(0))
// Expected output: -2147483648
```

#### DataView.prototype.setInt8()

写入 8 位有符号整数。

```js
const buffer = new ArrayBuffer(1)
const view = new DataView(buffer)
view.setInt8(0, -128)

console.log(view.getInt8(0))
// Expected output: -128
```

#### DataView.prototype.setUint16()

写入 16 位无符号整数。

```js
const buffer = new ArrayBuffer(2)
const view = new DataView(buffer)
view.setUint16(0, 65535)

console.log(view.getUint16(0))
// Expected output: 65535
```

#### DataView.prototype.setUint32()

写入 32 位无符号整数。

```js
const buffer = new ArrayBuffer(4)
const view = new DataView(buffer)
view.setUint32(0, 4294967295)

console.log(view.getUint32(0))
// Expected output: 4294967295
```

#### DataView.prototype.setUint8()

写入 8 位无符号整数。

```js
const buffer = new ArrayBuffer(1)
const view = new DataView(buffer)
view.setUint8(0, 255)

console.log(view.getUint8(0))
// Expected output: 255
```

## ArrayBuffer TypedArray DataView 实例

```js
const socket = new WebSocket("wss://xxx.com/audio");
socket.binaryType = "arraybuffer";

socket.onmessage = (event) => {
  const buffer = event.data as ArrayBuffer;
  const view = new DataView(buffer);

  const deviceId = view.getUint32(0, false);
  const timestamp = view.getUint32(4, false);
  const sampleRate = view.getUint16(8, false);
  const pcmLength = view.getUint16(10, false);

  // 获取 PCM 数据
  const pcmStart = 12;
  const pcmEnd = pcmStart + pcmLength;
  const pcmArray = new Int16Array(buffer.slice(pcmStart, pcmEnd));

  // 更新 UI 状态
  updateDeviceStatus(deviceId, timestamp);

  // 播放音频
  playPcm(pcmArray, sampleRate);
}

const audioCtx = new AudioContext();

function playPcm(pcmArray: Int16Array, sampleRate: number) {
  const float32Data = new Float32Array(pcmArray.length);
  for (let i = 0; i < pcmArray.length; i++) {
    float32Data[i] = pcmArray[i] / 32768; // Int16 转换为 [-1, 1] 范围
  }

  const buffer = audioCtx.createBuffer(1, float32Data.length, sampleRate);
  buffer.copyToChannel(float32Data, 0);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}
```

## 参考资料

[ArrayBuffer-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

[TypedArray-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

[DataView-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)

[ArrayBuffer](https://es6.ruanyifeng.com/#docs/arraybuffer)
