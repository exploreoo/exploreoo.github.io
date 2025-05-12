---
icon: pen-to-square
date: 2024-11-30
category:
  - 前端
tag:
  - 性能优化
---

# 前端性能优化

#### 性能优化目标

- ##### **保证资源更快的 加载速度（网络层面）**

- ##### **保证视图更快的 渲染速度/交互速度 （浏览器层面）**

#### 性能检测工具

- `Network`

- `performance` 面板（提供一个具体的执行过程)

- `lighthouse` 面板（网站整体评估)

- `webPageTest`、 `webpack-bundle-analyze`（依赖打包构建图）、 `speed-measure-webpack-plugin`（构建费时分析）

#### 性能指标数据收集

- `performance API`

  浏览器端的全局对象 `window` 上有一个名为 `performance` 的属性，它是一个用于支持 `IE9` 以上及 `webkit` 内核浏览器中用于记录页面 **加载** 和 **解析** 过程中关键时间点的机制

- `Web Vitals` 模块化库

<!-- more -->

#### 常规性能指标

`Google` 为前端页面性能的评估提出了 `RAIL` 模型，核心内容如下：

- **`Response` 响应**

- **`Animation` 动画**

- **`Idle` 空闲**

- **`Load` 加载**

  ***

  **首次绘制（`First Paint，FP`）**

  - 在渲染进程确认要渲染当前响应资源后，渲染进程会先创建一个空白页面，通常把创建空白页面的这个时间点称为 `First Paint`，简称 `FP`
  - 所谓的 **白屏时间** 其实指的就是创建这个空白页面到浏览器开始渲染非空白内容的时间，比如页面背景发生变化等

  **首次内容绘制（`First Contentful Paint，FCP`）**

  - 当用户看见一些 "内容" 元素被绘制在页面上的时间点，和白屏是不一样，它可以是 **`文本`** 首次绘制，或 `SVG` 首次出现，或 `Canvas` 首次绘制等，即当页面中绘制了第一个 **像素** 时，这个时间点称为 `First Content Paint`，简称 `FCP`

  **首屏时间 / 最大内容绘制（`Largest Contentful Paint, LCP`）**

  - `LCP` 是一种新的性能度量标准，`LCP` 侧重于用户体验的性能度量标准，与现有度量标准相比，更容易理解与推理，当首屏内容完全绘制完成时，这个时间点称为 `Largest Content Paint`，简称 `LCP`
  - **最大内容绘制应在 `2.5s` 内完成**

  **首次输入延迟（`First Input Delay, FID`）**

  - `FID` 测量的是当用户第一次在页面上交互的时候（**点击链接**、**点击按钮** 或 **自定义基于 `js` 的事件**），到浏览器实际开始处理这个事件的时间
  - **首次输入延迟应在 `100ms` 内完成**

  **累积布局偏移（`Cumulative Layout Shift, CLS`)**

  - `CLS` 是为了测量 **视觉稳定性**，以便提供良好的用户体验
  - **累积布局偏移应保持在 `0.1` 或更少**

  **首字节达到时间（`Time to First Byte，TTFB`）**

  - 指的是浏览器开始收到服务器响应数据的时间（**后台处理时间 + 重定向时间**），是反映服务端响应速度的重要指标
  - `TTFB` 时间如果超过 `500ms`，用户在打开网页的时就会感觉到明显的等待

#### 1、保证资源更快的加载速度

- ##### **使用 `dns-prefetch` 减少 DNS 的查询时间**

  `dns-prefetch` 能够 **提前解析** 后续可能会用到的 **不同域的域名**，使解析结果 **缓存到系统缓存** 中，缩短 `DNS` 解析时间以提高网站的访问速度。

  ```html
  <link rel="dns-prefetch" href="//api.xxx1.cn" />
  <link rel="dns-prefetch" href="//api.xxx2.cn" />
  <link rel="dns-prefetch" href="//api.xxx3.cn" />
  ```

- ##### **使用 `preconnect` 提前建立连接**

  `preconnect` 的作用是提前和第三方资源建立连接，设置了它浏览器就会做好早期的连接工作，但这个连接通常只会维持 `10 s`。

  ```html
  <link rel="preconnect" href="//xxx.com" />
  ```

- ##### **使用 `preload / prefetch` 预先加载资源**

  - `preload` 的作用是提前加载页面对应的 **关键资源** 加快页面的渲染，`preload` 的优先级顺序和 `as` 属性相关

    `preload` 是对资源的预加载，它虽提前加载但只在需要执行时执行，即这个资源一定是当前页面所需要的资源

    不会阻塞 `onload` 事件，`preload` 加载的`JS`脚本其加载和执行的过程是分离的，即 `preload` 会预加载相应的脚本代码，待到需要时自行调用

  - 如果是需要为下一个页面提前加载资源，那么应该使用 `prefetch`，它会在 **浏览器空闲时** 下载资源。

  `v-cli`默认有配置 `preload / prefetch`

  ```html
  // as
  属性一定要设置，除了上面提到的设置优先级外，还涉及到浏览识别的问题：如果没有设置
  as 属性，后续遇到该请求就会被作为一个 XHR
  请求，把意味着资源预加载的功能可能会失效，因为可能会每次都发起新的请求获取
  <link rel="preload" href="//xxx.com" as="script" />
  ```

- ##### **压缩资源体积**

  资源是需要通过 `http` 数据包的方式在网络中进行传输的，那么只要能减少传输数据包的体积，也是能够使得资源更快到达客户端，这也是压缩资源体积的核心目的。

  - **HTTP 压缩**

    - `gzip`

  - **Webpack 压缩**
    - 使用 `CompressionPlugin` 压缩文件
    - 使用 `HtmlWebpackPlugin` 压缩 `HTML` 文件
    - 使用 `MiniCssExtractPlugin` 抽离和压缩 `CSS`
    - 使用 `ImageMinimizerWebpackPlugin` 压缩图片资源
    - 使用 `SplitChunksPlugin` 自定义分包策略
    - 通过 `Tree Shaking` 移除无用代码

- ##### **减少 http 请求数量**

  - 合并公共资源，如 雪碧图 等
  - 内置模块资源，如 生成 `base64` 图片、通过 `symbol` 引用 `svg` 等
  - 合并代码块，如构建工具分包策略配合 公共组件封装、组件复用逻辑抽离 等
  - 按需加载资源，如 路由懒加载、图片懒加载、上拉加载、分页加载 等

- ##### **减少不必要的 cookie**

  不必要的 `cookie` 来回传输会造成带宽浪费：

  - 减少 `cookie` 存储的内容
  - 对于静态资源采用 `CDN` 托管（即非同域），不同域名默认不携带 `cookie`

- ##### **CDN 托管静态资源加速 + HTTP 缓存**

  - 强缓存、协商缓存

  - `keep-alive`、`v-once`、`v-memo`

- ##### **协议升级为 Http2.0**

  `http1.0` 中使用的是 **短连接**，即 **一次请求/响应** 结束后就会断开连接，这个过程比较耗时

  `http1.1` 中使用的是 **长连接**，在 **请求/响应头** 中设置 `Connection: keep-alive` 即可开启，优点是 **长连接** 允许多个请求共用一个 `TCP` 连接，缺点是带来了 **队头阻塞**：

  - 每个 `TCP` 连接中的多个请求，需要进行排队，只有队头的请求被响应，才能继续处理下一个请求
  - 其中一个缓解方案就是如果当前 `TCP` 连接中发生 **队头阻塞**，那就将部分请求放到其他 `TCP` 连接中
  - 浏览器一般会限制同一个域名建立 `6-8` 个 `TCP` 链接，这也就是为什么需要为应用划分子域名、静态资源托管 `CDN` 的原因之一

  `http1.x` 中 `header` 部分的内容可能会很大，而且每一个请求可能都需要携带大量 **重复** `header` 的 **文本内容**，而这些也是导致 **请求/响应** 慢的原因之一

  `http2.0`基于`https`协议，采用**头部压缩、二进制传输、多路复用**，避免浏览器请求拥堵导致耗时。

#### 2、保证视图更快的渲染和交互

- ##### **渲染层面**

  - ###### **减少阻塞渲染的因素**

    真正渲染视图之前，必然要生成 **`DOM Tree`** 和 **`CSSOM`**，因此必须保证 **HTML 解释器** 和 **CSS 解释器** 都尽早处理完成，同时 **`JavaScript`** 的加载和执行可能会阻塞这个过程：

    - `HTML` 文档中首次渲染的节点数量要尽量少，避免深层次的嵌套结构，避免大量使用慢标签（如：`iframe`）等
    - `CSS` 资源放文档头部，降低 `CSS` 复杂度，比如 合理使用 `CSS` 选择器
    - `JavaScript` 资源放文档底部，合理使用 **`defer、async`** 的加载方式

  - ###### **懒加载**

    懒加载主要是针对数量大、资源加载慢的情况，比如图片资源、大量列表数据展示等：

    - **图片资源**：优先加载在可视区范围内的图片，可视区外的图片 **`延后加载`**，或者说当移入的可视区时再加载

    - **列表数据**：列表数据通常数据里量大，不可能一次渲染完所有数据，一般通过 **`分页加载、上拉加载`** 等方式分批次渲染

    - **路由懒加载**

      `webpackChunkName` 作用是 `webpack` 在打包的时候，对异步引入的库代码（`lodash`）进行代码分割时，设置代码块的名字。`webpack`会将任何一个异步模块与相同的块名称组合到相同的异步块中。

      ```javascript
      // 通过webpackChunkName设置分割后代码块的名字
      const Home = () =>
        import(/* webpackChunkName: "home" */ "@/views/home/index.vue");
      const MetricGroup = () =>
        import(
          /* webpackChunkName: "metricGroup" */ "@/views/metricGroup/index.vue"
        );

      const routes = [
        {
          path: "/",
          name: "home",
          component: Home,
        },
        {
          path: "/metricGroup",
          name: "metricGroup",
          component: MetricGroup,
        },
      ];
      ```

    - **组件懒加载**

      组件懒加载 _基于动态`import`_ / **_`defineAsyncComponent`_**，有时资源拆分的过细也不好，可能会造成浏览器 `http` 请求的增多。

      总结出三种适合组件懒加载的场景：

      1）该页面的 JS 文件体积大，导致页面打开慢，可以通过组件懒加载进行资源拆分，利用浏览器并行下载资源，提升下载速度（比如首页）

      2）该组件不是一进入页面就展示，需要一定条件下才触发（比如弹框组件）

      3）该组件复用性高，很多页面都有引入，利用组件懒加载抽离出该组件，一方面可以很好利用缓存，同时也可以减少页面的 JS 文件大小（比如表格组件、图形组件等）

      ```javascript
      <script>
      const dialogInfo = () => import(/* webpackChunkName: "dialogInfo" */ '@/components/dialogInfo');
  
      export default {
        name: 'homeView',
        components: {
          dialogInfo
        }
      }
      </script>
      ```

  - ###### **白屏优化**

    白屏是由于 `SPA` 应用需要等待 `JavaScript` 加载并执行完成后才会生成具体的页面结构内容导致的，即初始化模板中没有任何有意义需要被渲染的 `HTML` 结构：

    - 添加 **白屏 `loading`**，可在模板中添加默认的 `loading` 效果，等到真正页面内容被渲染就可以替换 `loading` 内容
    - 添加 **骨架屏**，和上述方案一致，在真正页面内容展示出来之前，先展示默认的视图内容，避免白屏

  - ###### **服务端渲染（SSR）**

  - ###### **预渲染（prerender）**

    上述 **服务端渲染（server-side rendering，SSR）** 虽然能够解决一些客户端存在的问题，但它也带来了别的问题：

    - **`需要保证开发一致性`**，比如 **服务端** 和 **客户端** 能够执行的组件生命周期钩子不同，一些外部库在 **服务端渲染** 应用中可能需要经过特殊处理
    - **`需要更多的构建设定和部署要求`**，一个完全静态的 **SPA** 可以部署在任意的静态文件服务器，但服务端渲染应用需要一个能够运行 **Node.js** 服务器的环境
    - **`更多的服务端负载`**，在 **Node.js** 中渲染一个完整的应用，会比仅供应静态文件产生更密集的 **CPU** 运算，并且需要考虑访问流量过大的情况等

    因此，并不是所有应用都合适 **服务端渲染**，如果只是希望通过 **SSR** 来改善一些 **推广页面** (如 `/`、`/about`、`/contact` 等) 的 **SEO**，那么应该优先考虑 **预渲染** 的方式：

    - **预渲染** 是在打包构建过程中（离屏状态），针对对应的 `routes` 路由预先生成对应的页面内容
    - **预渲染** 需要和 **打包构建工具（webpack、rollup 等）** 进行配合，如 [**`webpack`**](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2F)，就可通过 [**`prerender-spa-plugin`**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fchrisvfritz%2Fprerender-spa-plugin) 来支持 **预渲染**

  - ###### `requestAnimationFrame` 制作动画

    `requestAnimationFrame` 是浏览器专门为动画提供的` API`，属于GUI引擎，它的刷新频率与显示器的频率保持一致，使用该 `api` 可以解决用 `setTimeout/setInterval` 制作动画卡顿的情况。

- ##### **交互层面**

  - ###### **减少回流/重绘**

    - 避免对 `css` 进行单个修改，如在 `JavaScript` 修改多个样式时，尽量使用 `css` 选择器实现样式的集中变更
    - 使用定位，利用`GPU`加速 `transform`、`opacity`、`filter`、`will-change`...，使用 `will-change` 开启 `GPU` 加速，`will-change` 指定的属性使得浏览器可在元素属性真正发生变化之前提前做好对应的优化
    - 预先设定图片尺寸，避免图片资源加载完成后引发回流

  - ###### **防抖/节流**

    **防抖**：多次频繁触发执行操作，以 **最后一次** 为准，忽略中间过程

    **节流**：在指定的时间间隔内，**只允许** 执行一次对应的操作

    合理使用 **`防抖/节流`** 优化应用中的操作，比如 **`节流`** 可用于优化 滚动事件、模糊搜索等，**`防抖`** 可用于优化一些按钮点击操作等。

  - ###### **Web Worker**

    `JavaScript` 是单线程的，如果存在需要大量计算的场景（如视频解码），`UI` 线程就会被阻塞，甚至浏览器直接卡死。

    `Web Worker` 可以使脚本运行在新的线程中，它们独立于主线程，可以进行大量的计算活动，而不会影响主线程的 `UI` 渲染，但不能滥用 `Web Worker` 。

    由于浏览器 `GUI` 渲染线程与 `JS` 引擎线程是互斥的关系，当页面中有很多长任务时，会造成页面 `UI` 阻塞，出现界面卡顿、掉帧等情况，<u>**当任务的运算时长 - 通信时长 > `50ms`，推荐使用Web Worker**</u>。并不是执行时间超过 `50ms` 的任务，就可以使用 Web Worker，还要先考虑`通信时长`的问题，假如一个运算执行时长为 `100ms`，但是通信时长为 `300ms`， 用了 Web Worker可能会更慢。

  - ###### **虚拟列表**

    比如` vue-virtual-scroller`、`vue-virtual-scroll-list`、`react-tiny-virtual-list`、`react-virtualized` 等

    ` vue-virtual-scroller`示例

    ```javascript
    // 安装插件
    npm install vue-virtual-scroller

    // main.js
    import VueVirtualScroller from 'vue-virtual-scroller'
    import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

    Vue.use(VueVirtualScroller)

    // 使用
    <template>
      <RecycleScroller
        class="scroller"
        :items="list"
        :item-size="32"
        key-field="id"
        v-slot="{ item }">
          <div class="user"> {{ item.name }} </div>
      </RecycleScroller>
    </template>
    ```

  - ###### **大文件分片上传**

  - ###### **Excel 导入/导出**

#### 3、Vue 项目的优化

简单列举一些内容（包括但不限于）：

- 减少响应式数据的生成，对于纯展示、又需要使用在 `template` 模板中使用的数据，可使用 `Object.freeze()` 进行冻结，避免被转为 **不必要的响应式数据**
- `Vue` 组件初始化是比较损耗性能的，使用 **函数式组件** 减少组件初始化的过程，适用于实现没有业务逻辑只展示内容的简单组件
- 合理使用 `v-show` 和 `v-if`、为 `v-for` 组件设定唯一 `key`（非 `index`）、`v-for` 和 `v-if` 不要一起使用等
- 使用 `KeepAlive` 复用组件，避免组件重复的创建、销毁带来的性能损耗
- 使用 `() => import(xxx)` 方式实现路由懒加载
- 使用 `ESM` 的方式封装自定义工具库等
- 针对第三方库做到按需引入
- 合理使用闭包，避免造成内存泄漏
- 及时清除组件中的副作用，比如 `setTimeout、setInterval、addEventListener` 等
