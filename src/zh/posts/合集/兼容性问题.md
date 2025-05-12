---
icon: pen-to-square
date: 2023-03-12
category:
  - 前端
tag:
  - js
---

# 兼容性问题

- `Autoprefixer`自动添加浏览器前缀插件，属于后处理程序，不像 Sass 以及 Stylus 之类的预处理器。它适用于普通的 CSS，可以实现css3代码自动补全。也可以轻松跟 Sass，LESS及Stylus集成，在CSS编译前或编译后运行。

- ant-design table树结构折叠图标火狐浏览器内显示错误

  ```less
  // 这种写法仅火狐识别
  @-moz-document url-prefix() {
    .surely-table-row-expand-icon::before {
      height: 2px;
    }
  }
  ```

- ##### [Chromium](https://www.chromium.org/)

  ```less
  /*滚动条整体粗细样式*/
  ::-webkit-scrollbar {
    /*高宽分别对应横竖滚动条的尺寸*/
    width: 8px;
    height: 8px;
  }
  
  /*滚动条里面小方块*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
    /* 颜色 */
    /* background:#b6b6b6!important; */
    /* 线性渐变背景 */
    background-image: linear-gradient(
      45deg,
      #ffbd61 25%,
      #ffbd61 25%,
      #ff8800 25%,
      #ff8800 50%,
      #ffbd61 50%,
      #ffbd61 75%,
      #ff8800 75%,
      #ff8800 100%
    ) !important;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #1175c2 !important;
  }
  
  /*滚动条轨道*/
  ::-webkit-scrollbar-track {
    border-radius: 10px !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
    background: #ededed !important;
  }
  
  /*滚动条角落*/
  ::-webkit-scrollbar-corner {
    background: #000;
  }
  ```

  ##### Firefox

  scrollbar-width

  scrollbar-color

  ##### IE

  scrollbar-base-color

  scrollbar-track-color

  scrollbar-arrow-color

  scrollbar-3dlight-color

  scrollbar-shadow-color

  scrollbar-highlight-color
