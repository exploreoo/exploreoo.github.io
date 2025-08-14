---
icon: pen-to-square
date: 2025-06-20
category:
  - 前端
tag:
  - React
---

# React架构

## 特点

- 声明式的视图层。采用的是JSX语法声明视图层，因此可以在视图层随意使用各种状态的数据
- 灵活的渲染实现。生成的虚拟DOM只是普通的JS对象，可以利用其他依赖库把这个对象渲染成不同的UI，也就是具备了跨平台的能力。例如使用react-dom在浏览器上渲染，使用React Native在手机上渲染
- 高效的DOM操作。虚拟DOM与真实DOM之间利用差异化算法，尽量减少真实DOM的渲染次数和改变节点的数量





render阶段

- 开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法
- 判断本次更新是同步还是异步（是否调用`shouldYield`方法，代表浏览器帧有没有剩余时间，该方法会终止循环，直到浏览器有空闲时间再继续后续遍历）
- 递归构建Fiber节点`并赋值给`workInProgress，并将`workInProgress`与已创建的`Fiber节点`连接起来构成`Fiber树`















