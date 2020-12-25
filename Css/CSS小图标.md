# CSS 小图标

## 画一个圆

```css
.cirlce {
  width: 10vw;
  height: 10vw;
  background: black;
  border-radius: 50%;
}
```

## 画一个箭头

```css
.arrow {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-right: 3px solid #ccc;
  border-bottom: 3px solid #ccc;
  transform: rotate(-45deg);
}
```

## 画一个三角形

```css
.triangle1 {
  width: 0;
  height: 0;
  border-right: 50px solid transparent;
  border-left: 50px solid transparent;
  border-bottom: 50px solid #228b5e;
}
.triangle2 {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 50px solid #228b5e;
}
.triangle3 {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-right: 50px solid #228b5e;
}
.triangle4 {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-top: 50px solid #228b5e;
}
.triangle5 {
  width: 0;
  height: 0;
  border-width: 30px 30px 0 0;
  border-style: solid;
  border-color: #228b5e transparent transparent transparent;
}
```
