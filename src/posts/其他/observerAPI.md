---
icon: file-contract
date: 2023-10-15
category:
  - 前端
tag:
  - web-api
---

# Observer API

- **[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)**

   过去，相交检测通常要用到事件监听，并且需要频繁调用 [`Element.getBoundingClientRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 方法以获取相关元素的边界信息。事件监听和调用 [`Element.getBoundingClientRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 都是在主线程上运行，因此频繁触发、调用可能会造成性能问题。这种检测方法极其怪异且不优雅。

   Intersection Observer API 会注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时 (或者 [viewport](https://developer.mozilla.org/zh-CN/docs/Glossary/Viewport) )，或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行。这样，我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。

  应用场景：

  - 图片懒加载——当图片滚动到可见时才进行加载

- 内容无限滚动——也就是用户滚动到接近内容底部时直接加载更多，而无需用户操作翻页，给用户一种网页可以无限滚动的错觉

  - 检测广告的曝光情况——为了计算广告收益，需要知道广告元素的曝光情况
  - 在用户看见某个区域时执行任务或播放动画

- **[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)**

  监听一个普通 JS 对象的变化，我们会用 Object.defineProperty 或者 Proxy。

  监听元素属性和子节点变化，比如可以用来做去不掉的水印。MutationObserver 可以监听对元素的属性的修改、对它的子节点的增删改

- **ResizeObserver**

  窗口我们可以用 addEventListener 监听 resize 事件。

  监听元素大小变化。使用 ResizeObserver 监听大小的改变，当 width、height 被修改时会触发回调

- **PerformanceObserver**

  PerformanceObserver 用于监听记录 performance 数据的行为。一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报

- **ReportingObserver**

  可以保证更全面的了解网页 app 的运行情况。ReportingObserver 可以监听过时的 api、浏览器干预等报告等的打印，在回调里上报，这些是错误监听无法监听到但对了解网页运行情况很有用的数据
