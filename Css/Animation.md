# animation

`animation` 可以是以下属性的缩写，每个动画定义中的属性值的顺序很重要：可以被解析为 `time` 的第一个值被分配给 `animation-duration`，第二个分配给 `animation-delay`：

- animation-name
- animation-duration
- animation-timing-function
- animation-delay
- animation-iteration-count
- animation-direction
- animation-fill-mode
- animation-play-state
- animation-timeline

```css
/* @keyframes duration | easing-function | delay |
iteration-count | direction | fill-mode | play-state | name */
animation: 3s ease-in 1s 2 reverse both paused slide-in;

/* @keyframes duration | easing-function | delay | name */
animation: 3s linear 1s slide-in;

/* two animations */
animation: 3s linear slide-in, 3s ease-out 5s slide-out;
```

## animation-name

`animation-name` CSS 属性指定一个或多个 `@keyframes at-rule` 的名称

```css
/* 单个动画 */
animation-name: none;
animation-name: test_05;
animation-name: -specific;
animation-name: sliding-vertically;

/* 多个动画 */
animation-name: test1, animation4;
animation-name: none, -moz-specific, sliding;

/* 全局值 */
animation-name: inherit;
animation-name: initial;
animation-name: revert;
animation-name: revert-layer;
animation-name: unset;
```

## animation-duration

`animation-duration` CSS 属性设置动画完成一个动画周期所需的时间。

```css
/* 单个动画 */
animation-duration: 6s;
animation-duration: 120ms;

/* 多个动画 */
animation-duration: 1.64s, 15.22s;
animation-duration: 10s, 35s, 230ms;

/* 全局值 */
animation-duration: inherit;
animation-duration: initial;
animation-duration: revert;
animation-duration: revert-layer;
animation-duration: unset;
```

## animation-timing-function

`animation-timing-function` CSS 属性设置动画在每个周期的持续时间内如何进行。

```css
/* 关键字值 */
animation-timing-function: ease;
animation-timing-function: ease-in;
animation-timing-function: ease-out;
animation-timing-function: ease-in-out;
animation-timing-function: linear;
animation-timing-function: step-start;
animation-timing-function: step-end;

/* 函数值 */
animation-timing-function: cubic-bezier(0.1, 0.7, 1, 0.1);
animation-timing-function: steps(4, end);

/* Steps 函数关键字 */
animation-timing-function: steps(4, jump-start);
animation-timing-function: steps(10, jump-end);
animation-timing-function: steps(20, jump-none);
animation-timing-function: steps(5, jump-both);
animation-timing-function: steps(6, start);
animation-timing-function: steps(8, end);

/* 多个动画 */
animation-timing-function: ease, step-start, cubic-bezier(0.1, 0.7, 1, 0.1);

/* 全局值 */
animation-timing-function: inherit;
animation-timing-function: initial;
animation-timing-function: revert;
animation-timing-function: revert-layer;
animation-timing-function: unset;
```

## animation-delay

`animation-delay` CSS 属性指定从应用动画到元素开始执行动画之前等待的时间量。动画可以稍后开始、立即从开头开始或立即开始并在动画中途播放。

```css
/* 单个动画 */
animation-delay: 3s;
animation-delay: 0s;
animation-delay: -1500ms;

/* 多个动画 */
animation-delay: 2.1s, 480ms;

/* 全局值 */
animation-delay: inherit;
animation-delay: initial;
animation-delay: revert;
animation-delay: revert-layer;
animation-delay: unset;
```

## animation-iteration-count

`animation-iteration-count` CSS 属性设置动画序列在停止前应播放的次数

```css
/* 关键字值 */
animation-iteration-count: infinite;

/* 数字值 */
animation-iteration-count: 3;
animation-iteration-count: 2.4;

/* 多个值 */
animation-iteration-count: 2, 0, infinite;

/* 全局值 */
animation-iteration-count: inherit;
animation-iteration-count: initial;
animation-iteration-count: revert;
animation-iteration-count: revert-layer;
animation-iteration-count: unset;
```

## animation-direction

`animation-direction` CSS 属性设置动画是应正向播放、反向播放还是在正向和反向之间交替播放。

```css
/* 单个动画 */
animation-direction: normal;
animation-direction: reverse;
animation-direction: alternate;
animation-direction: alternate-reverse;

/* 多个动画 */
animation-direction: normal, reverse;
animation-direction: alternate, reverse, normal;

/* 全局值 */
animation-direction: inherit;
animation-direction: initial;
animation-direction: revert;
animation-direction: revert-layer;
animation-direction: unset;
```

## animation-fill-mode

`animation-fill-mode` CSS 属性设置 CSS 动画在执行之前和之后如何将样式应用于其目标。

```css
/* Single animation */
animation-fill-mode: none;
animation-fill-mode: forwards;
animation-fill-mode: backwards;
animation-fill-mode: both;

/* Multiple animations */
animation-fill-mode: none, backwards;
animation-fill-mode: both, forwards, none;
```

## animation-play-state

`animation-play-state` CSS 属性设置动画是运行还是暂停。

```css
/* 单个动画 */
animation-play-state: running;
animation-play-state: paused;

/* 多个动画 */
animation-play-state: paused, running, running;

/* 全局值 */
animation-play-state: inherit;
animation-play-state: initial;
animation-play-state: revert;
animation-play-state: revert-layer;
animation-play-state: unset;
```

## animation-timeline

`animation-timeline` CSS 属性设置动画的运行时间线，允许将动画的时间轴与滚动进度或元素在视口中的可见性关联起来，从而创建基于滚动的动画效果。

```css
/* Keyword */
animation-timeline: none;
animation-timeline: auto;

/* Single animation named timeline */
animation-timeline: --timeline_name;

/* Single animation anonymous scroll progress timeline */
animation-timeline: scroll();
animation-timeline: scroll(scroller axis);

/* Single animation anonymous view progress timeline */
animation-timeline: view();
animation-timeline: view(axis inset);

/* Multiple animations */
animation-timeline: --progressBarTimeline, --carouselTimeline;
animation-timeline: none, --slidingTimeline;

/* Global values */
animation-timeline: inherit;
animation-timeline: initial;
animation-timeline: revert;
animation-timeline: revert-layer;
animation-timeline: unset;
```

## 参考资料

[animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)

[A guide to Scroll-driven Animations with just CSS](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css)
