---
icon: pen-to-square
date: 2023-08-10
category:
  - 前端
tag:
  - 移动端
---

# 移动端合集

#### **跨平台调试**

- [**Vconsole**](https://github.com/Tencent/vConsole/blob/dev/README_CN.md)
- [**Eruda**](https://github.com/liriliri/eruda/blob/master/doc/README_CN.md)

- **window下调试 iOS-Safari**

  实现真机调试主要是使用了 remotedebug-ios-webkit-adapter

  ```shell
  安装scoopeWindows 命令行安装工具
  
  Set-ExecutionPolicy RemoteSigned -scope CurrentUser
  iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
  ```

  ```shell
  scoop bucket add extras
  scoop install ios-webkit-debug-proxy
  npm install -g vs-libimobile
  
  npm install remotedebug-ios-webkit-adapter -g
  ```

  1. 进入 iPhone 中的 _设置 > Safari 浏览器 > 高级 > Web 检查器_，开启该选项。
  2. 打开 iTunes 并连接 iPhone，在 iPhone 弹框中选择信任该电脑。
  3. 打开命令行，执行以下命令，启动适配器：

  ```undefined
  remotedebug_ios_webkit_adapter --port=9000
  ```

  1. 在 iPhone 中打开 Safari 浏览器，打开待调试页面。
  2. 打开 Chrome 浏览器，进入 [chrome://inspect/#devices](https://links.jianshu.com/go?to=chrome%3A%2F%2Finspect%2F%23devices) 页面，在 Discover network targets 选项添加 localhost:9000 配置。刷新页面，这时页面中会出现 'Remote Target' 列表，该列表展示了 iPhone 中打开的页面，点击 inspect，即可进行调试。（科学上网/edge）

<!-- more -->

#### h5键盘输入遮挡问题

 处理方式有 `scrollIntoView` /`scrollTop`，原生键盘安卓、safari适用，`ios`中可能有bug，后续待更新，以下为使用`vant`为例：

 整体思路：由于键盘控件定位语底部，用`innerHeight` ,`getBoundingClientRect()`计算输入`DOM`节点与视口底部的距离，小于键盘高度则需要显示，结合`scrollTop`按需来滚动，其中需要动态添加键盘占位空元素（高度与控件保持一致，需结合布局灵活计算），撑起滚动底部区域，此方案兼容性较好

```html
<div v-if="showKeyboard" class="empty-keyboard"></div>
```

```vue
const scrollArea = document.querySelector('.scroll-l'); const arrBottom =
window.innerHeight - e.target.getBoundingClientRect().y -
e.target.getBoundingClientRect().height; if (arrBottom < 260) { nextTick(() => {
scrollArea.scrollTop += 260 - arrBottom; }); }
```

待更新...
