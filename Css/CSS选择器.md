# CSS 选择器

## 选择器优先级

优先级就是分配给指定的 CSS 声明的一个权重，它由 匹配的选择器中的 每一种选择器类型的 数值 决定。

而当优先级与多个 CSS 声明中任意一个声明的优先级相等的时候，CSS 中最后的那个声明将会被应用到元素上。

当同一个元素有多个声明的时候，优先级才会有意义。因为每一个直接作用于元素的 CSS 规则总是会接管/覆盖（take over）该元素从祖先元素继承而来的规则。

下面，选择器类型的优先级是递增的：

1. 给元素添加的内联样式 (例如, style="font-weight:bold") 总会覆盖外部样式表的任何样式 ，因此可看作是具有最高的优先级
2. 类型选择器（type selectors）（例如, h1）和 伪元素（pseudo-elements）（例如, ::before）
3. 类选择器（class selectors） (例如,.example)，属性选择器（attributes selectors）（例如, [type="radio"]），伪类（pseudo-classes）（例如, :hover）
4. ID 选择器（例如, #example）
5. 通配选择符（universal selector）(\*), 关系选择符（combinators） (+, >, ~, ' ') 和否定伪类（negation pseudo-class）(:not()) 对优先级没有影响。（但是，在 :not() 内部声明的选择器是会影响优先级）。

**!important > 内联样式> ID 选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性**
