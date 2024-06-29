# Grid 布局

Flex 布局是轴线布局，只能指定"项目"针对轴线的位置，可以看作是一维布局。Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格，可以看作是二维布局。Grid 布局远比 Flex 布局强大。

## Grid 所有属性

Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。

| 容器上的属性                     | 项目上的属性           |
| -------------------------------| ---------------------|
| display:grid                   | grid-column-start    |
| grid-template-columns          | grid-column-end      |
| grid-template-rows             | grid-row-start       |
| grid-column-gap / grid-row-gap | grid-row-end         |
| grid-template-areas            | grid-area            |
| grid-auto-flow                 | justify-self         |
| justify-items / align-items / place-items    | align-self           |
| justify-content / align-content / place-content    | place-self           |

### `display`

用于指定一个容器采用 Grid 布局
  
- `grid`：表示容器采用网格布局
- `inline-grid`：表示容器采用内联网格布局

### `grid-template-columns` & `grid-template-rows`

用于定义网格容器的列和行

- `<track-size>`：可以是一个长度值、百分比值、fr 单位（表示剩余空间的比例分配）等
- `auto`：表示自动分配宽度或高度
- `minmax(min, max)`：定义一个长度范围，网格容器会尽量扩展但不超过最大值

`grid-template-columns`属性对于网页布局非常有用，两栏式布局只需要一行代码：

```css
// 下面代码将左边栏设为70%，右边栏设为30%。
.wrapper {
  display: grid;
  grid-template-columns: 70% 30%;
}
```

传统的十二网格布局，写起来也很容易：

```css
grid-template-columns: repeat(12, 1fr);
```

### `grid-column-gap` & `grid-row-gap`

用于设置网格行和列之间的间隙大小。常见取值是一个长度值或百分比值。

`grid-gap` 是 `grid-row-gap` 和 `grid-column-gap` 的简写形式，可以同时设置行和列的间隙大小。

### `grid-template-areas`

允许你以命名区域的方式定义网格模板，方便布局。常见取值是一个由区域名组成的字符串，用空格或换行符分隔。

```css
grid-template-areas: "header header header"
                     "main main sidebar"
                     "footer footer footer";
```

注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为区域名-start，终止网格线自动命名为区域名-end。

比如，区域名为header，则起始位置的水平网格线和垂直网格线叫做header-start，终止位置的水平网格线和垂直网格线叫做header-end。

### `grid-auto-flow`

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图数字的顺序。

这个顺序由`grid-auto-flow`属性决定，默认值是`row`，即"先行后列"。也可以将它设成`column`，变成"先列后行"。

```css
grid-auto-flow: column;
```

### `justify-items` & `align-items`

`justify-items`属性设置单元格内容的水平位置（左中右），`align-items`属性设置单元格内容的垂直位置（上中下）。

- `start`：对齐单元格的起始边缘
- `center`：对齐单元格的结束边缘
- `end`：单元格内部居中
- `stretch`：拉伸，占满单元格的整个宽度（默认值）

### `justify-content` & `align-content`

`justify-content`属性是整个内容区域在容器里面的水平位置（左中右），`align-content`属性是整个内容区域的垂直位置（上中下）。

- `start`：对齐容器的起始边框
- `center`：对齐容器的结束边框
- `end`：容器内部居中
- `stretch`：项目大小没有指定时，拉伸占据整个网格容器
- `space-around`：每个项目两侧的间隔相等，项目之间的间隔比项目与容器边框的间隔大一倍
- `space-between`：项目与项目的间隔相等，项目与容器边框之间没有间隔
- `space-evenly`：项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔

### `grid-column-start` & `grid-column-end` & `grid-row-start` & `grid-row-end`

- `grid-column-start`：左边框所在的垂直网格线
- `grid-column-end`：右边框所在的垂直网格线
- `grid-row-start`：上边框所在的水平网格线
- `grid-row-end`：下边框所在的水平网格线

`grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式，`grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。

### `justify-self` & `align-self`

用于设置**单个**网格子元素在网格区域内的对齐方式。常见取值和 `justify-items` 和 `align-items` 相同。

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

## 图例

![grid](./assets/grid.png)

## 参考资料

[CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

[A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
