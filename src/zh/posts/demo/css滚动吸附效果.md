---
icon: pen-to-square
date: 2024-11-09
category:
  - 前端
tag:
  - css
---

# CSS实现吸附滚动效果

## 什么是吸附滚动效果？

吸附滚动（Snap Scrolling）是指当用户滚动内容时，页面会自动"吸附"到预定义的停留点。这种效果常见于：

- 移动端全屏分页
- 图片画廊
- 横向产品展示
- 幻灯片演示

## 核心 CSS 属性

实现吸附滚动效果主要依赖以下三个 CSS 属性，完整配置见https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type：

### 1. `scroll-snap-type`

定义滚动容器的捕捉行为：

```
.container {
  scroll-snap-type: y mandatory;
}
```

- `y` 表示垂直方向滚动（`x` 表示水平方向）
- `mandatory` 表示必须停在吸附点（`proximity` 表示接近时吸附）

### 2. `scroll-snap-align`

定义子元素的吸附对齐位置：

```
.item {
  scroll-snap-align: start;
}
```

可选值：`start`、`center`、`end`

### 3. `scroll-snap-stop`

控制是否必须在每个捕捉点停止：

```
.item {
  scroll-snap-stop: always;
}
```

## 完整实现代码

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS 实现吸附滚动效果</title>
    <style>
        body {
            margin: 0;
        }

        .container {
            width: 100%;
            height: 100vh;
            overflow-y: scroll;
            /* 核心 css */
            scroll-snap-type: y mandatory;
        }

        .item {
            flex-shrink: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3em;
            /* 核心 */
            scroll-snap-align: start;
            scroll-snap-stop: always;
        }

        .item:nth-child(1) {
            background-color: rgba(255, 0, 0, 0.518);
        }

        .item:nth-child(2) {
            background-color: rgba(0, 128, 0, 0.293);
        }

        .item:nth-child(3) {
            background-color: rgba(0, 0, 255, 0.397);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>
</body>
</html>
```

## 进阶技巧

1. **部分高度吸附**：
    如果不想全屏吸附，可以设置子元素为部分高度：

    ```
    .item {
      height: 80vh;
    }
    ```

2. **水平滚动画廊**：

    ```
    .gallery {
      scroll-snap-type: x mandatory;
      overflow-x: scroll;
      display: flex;
    }
    .slide {
      scroll-snap-align: center;
      min-width: 100vw;
    }
    ```

3. **边距控制**：
    使用 `scroll-padding` 和 `scroll-margin` 调整吸附位置：

    ```
    .container {
      scroll-padding: 20px;
    }
    .item {
      scroll-margin: 20px;
    }
    ```

## 浏览器兼容性

大多数现代浏览器都支持 scroll-snap 属性：

- Chrome 69+
- Firefox 68+
- Safari 11+
- Edge 79+

对于不支持的浏览器，这些属性会被安全地忽略，回退到普通滚动行为。

## 为什么选择 CSS 而非 JavaScript 实现？

1. **性能更好**：浏览器原生支持，无脚本开销
2. **更流畅**：与浏览器渲染引擎深度集成
3. **更简单**：几行 CSS 即可实现复杂效果
4. **响应更快**：不受 JavaScript 主线程阻塞影响