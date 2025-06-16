---
icon: pen-to-square
date: 2025-03-03
category:
  - 前端
tag:
  - 性能优化
---

# CDN 加速

## 引言

在现代前端开发中，合理使用 CDN 可以显著提升应用加载速度，但同时也带来了可用性挑战。本文将深入探讨如何实现稳健的 CDN 加载策略，包括开发与生产环境的不同处理方式，以及必不可少的 fallback 机制。

## 一、CDN 基础与价值

### 1.1 什么是 CDN？

内容分发网络（Content Delivery Network）通过全球分布的节点服务器，使用户可以从地理位置上最近的服务器获取资源。

### 1.2 CDN 的优势

- 更快的资源加载速度
- 减轻源服务器负担
- 提高资源可用性
- 更好的用户体验

<!-- more -->

## 二、核心实现方案

以下是我们在项目中采用的 CDN 加载器实现：

```javascript
// config/cdn.js
// CDN加载方法
const CDN_LOAD = {
  loadScript(url, fallback, callback) {
    let script = document.createElement("script");
    script.src = url;
    script.defer = true;
    script.onload = callback;
    script.onerror = function () {
      console.log("Failed to load CDN:", url);
      let fallbackScript = document.createElement("script");
      fallbackScript.src = fallback;
      fallbackScript.defer = true;
      fallbackScript.onload = callback;
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
  },
  // 加载CDN js资源
  loadCDNScripts(scripts, index, callback, MODE) {
    if (index >= scripts.length) {
      return callback();
    }
    let script = scripts[index];
    CDN_LOAD.loadScript(
      MODE !== "production" ? script.fallback : script.url, // 开发环境会直接取 fallback 资源，生产环境会先取 url
      script.fallback,
      function () {
        CDN_LOAD.loadCDNScripts(scripts, index + 1, callback, MODE);
      },
    );
  },
  // 加载打包后的js文件
  loadMainScripts(scripts, index) {
    if (index >= scripts.length) {
      return;
    }
    let script = scripts[index];
    CDN_LOAD.loadScript(script, script, function () {
      CDN_LOAD.loadMainScripts(scripts, index + 1);
    });
  },
};
```

接下来需要配置CDN资源映射，需要结合CopyWebpackPlugin复制资源的能力，将对应的资源包映射至lib文件下，作为CDN失效备选资源

```js
// config/cdn-config.js
const path = require("path");
const isProduction = process.env.NODE_ENV === "production";

/**
 * CDN配置
 * @url 资源地址
 * @fallback url失效会直接取该本地资源映射
 */
const config = {
  css: [],
  js: [
    /**
     * dayjs
     * ant-design-vue依赖于此，必须提前加载
     */
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/dayjs.min.js",
      fallback: "libs/dayjs.min.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/weekday.js",
      fallback: "libs/weekday.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/localeData.js",
      fallback: "libs/localeData.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/weekOfYear.js",
      fallback: "libs/weekOfYear.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/weekYear.js",
      fallback: "libs/weekYear.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/quarterOfYear.js",
      fallback: "libs/quarterOfYear.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/advancedFormat.js",
      fallback: "libs/advancedFormat.js",
    },
    {
      url: "https://cdn.jsdelivr.net/npm/dayjs@1.10.7/plugin/customParseFormat.js",
      fallback: "libs/customParseFormat.js",
    },
    // moment
    {
      url: "https://cdn.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js",
      fallback: "libs/moment.min.js",
    },
    // vue
    {
      url: isProduction
        ? "https://cdn.jsdelivr.net/npm/vue@3.2.13/dist/vue.global.prod.js"
        : "https://cdn.jsdelivr.net/npm/vue@3.2.13/dist/vue.global.js",
      fallback: "libs/vue.global.js",
    },
    // vue-router
    {
      url: isProduction
        ? "https://cdn.jsdelivr.net/npm/vue-router@4.0.3/dist/vue-router.global.prod.js"
        : "https://cdn.jsdelivr.net/npm/vue-router@4.0.3/dist/vue-router.global.js",
      fallback: "libs/vue-router.global.js",
    },
    // vuex
    {
      url: isProduction
        ? "https://cdn.jsdelivr.net/npm/vuex@4.0.0/dist/vuex.global.prod.js"
        : "https://cdn.jsdelivr.net/npm/vuex@4.0.0/dist/vuex.global.js",
      fallback: "libs/vuex.global.js",
    },
    // axios
    {
      url: "https://cdn.jsdelivr.net/npm/axios@1.7.2/dist/axios.min.js",
      fallback: "libs/axios.min.js",
    },
    // ant-design-vue
    {
      url: "https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.3/dist/antd.min.js",
      fallback: "libs/antd.min.js",
    },
  ],
};

// 本地资源映射
const localResources = [
  // dayjs
  {
    from: path.resolve(__dirname, "../node_modules/dayjs/dayjs.min.js"),
    to: "libs/dayjs.min.js",
  },
  {
    from: path.resolve(__dirname, "../node_modules/dayjs/plugin/weekday.js"),
    to: "libs/weekday.js",
  },
  {
    from: path.resolve(__dirname, "../node_modules/dayjs/plugin/localeData.js"),
    to: "libs/localeData.js",
  },
  {
    from: path.resolve(__dirname, "../node_modules/dayjs/plugin/weekOfYear.js"),
    to: "libs/weekOfYear.js",
  },
  {
    from: path.resolve(__dirname, "../node_modules/dayjs/plugin/weekYear.js"),
    to: "libs/weekYear.js",
  },
  {
    from: path.resolve(
      __dirname,
      "../node_modules/dayjs/plugin/quarterOfYear.js",
    ),
    to: "libs/quarterOfYear.js",
  },
  {
    from: path.resolve(
      __dirname,
      "../node_modules/dayjs/plugin/advancedFormat.js",
    ),
    to: "libs/advancedFormat.js",
  },
  {
    from: path.resolve(
      __dirname,
      "../node_modules/dayjs/plugin/customParseFormat.js",
    ),
    to: "libs/customParseFormat.js",
  },
  // vue
  {
    from: path.resolve(
      __dirname,
      isProduction
        ? "../node_modules/vue/dist/vue.global.prod.js"
        : "../node_modules/vue/dist/vue.global.js",
    ),
    to: "libs/vue.global.js",
  },
  // vue-router
  {
    from: path.resolve(
      __dirname,
      isProduction
        ? "../node_modules/vue-router/dist/vue-router.global.prod.js"
        : "../node_modules/vue-router/dist/vue-router.global.js",
    ),
    to: "libs/vue-router.global.js",
  },
  // vuex
  {
    from: path.resolve(
      __dirname,
      isProduction
        ? "../node_modules/vuex/dist/vuex.global.prod.js"
        : "../node_modules/vuex/dist/vuex.global.js",
    ),
    to: "libs/vuex.global.js",
  },
  // axios
  {
    from: path.resolve(__dirname, "../node_modules/axios/dist/axios.min.js"),
    to: "libs/axios.min.js",
  },
  // ant-design-vue
  {
    from: path.resolve(
      __dirname,
      "../node_modules/ant-design-vue/dist/antd.min.js",
    ),
    to: "libs/antd.min.js",
  },
  // CDN加载脚本
  {
    from: path.resolve(__dirname, "cdn.js"),
    to: "libs/cdn.js",
  },
  // 初始动画样式文件
  {
    from: path.resolve(__dirname, "../src/modules/index/styles/loading.css"),
    to: "libs/loading.css",
  },
];

module.exports = {
  config,
  localResources,
};
```

vue.config.js配置

```js
const { defineConfig } = require("@vue/cli-service");
const fs = require("fs");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CDN_CONFIG = require("./config/cdn-config"); // CDN配置文件

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      // CDN本地资源映射
      new CopyWebpackPlugin({
        patterns: CDN_CONFIG.localResources,
      }),
    ],
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "ant-design-vue": "antd",
      dayjs: "dayjs",
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].inject = false; // 禁用自动注入
      args[0].scriptLoading = "defer"; // 使用defer加载
      args[0].cdn = CDN_CONFIG; // 传入CDN配置
      return args;
    });
  },
});
```

最后在html中手动按顺序依次引入CDN、构建打包资源

```html
<!-- 手动引入 CDN CSS 文件 -->
<% if (htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.css) { %>
<% htmlWebpackPlugin.options.cdn.css.forEach(function(resource) { %>
<link
  rel="stylesheet"
  href="<%= resource.url %>"
  onerror="this.onerror=null;this.href='<%= resource.fallback %>';"
/>
<% }) %> <% } %>
<!-- 手动引入打包后的 CSS 文件 -->
<% for (var i in htmlWebpackPlugin.files.css) { %>
<link rel="stylesheet" href="<%= htmlWebpackPlugin.files.css[i] %>" />
<% } %>
<!-- 手动引入 CDN JS 文件 -->
<script src="libs/cdn.js"></script>
<script>
  CDN_LOAD.loadCDNScripts( <%= JSON.stringify(htmlWebpackPlugin.options.cdn.js) %>, 0, function() {
    // 手动引入打包后的 JS 文件
    CDN_LOAD.loadMainScripts(<%= JSON.stringify(htmlWebpackPlugin.files.js) %>, 0);
    document.getElementById('global-spinner').style.display = 'none';
  }, '<%= process.env.NODE_ENV %>');
</script>
```

## 三、开发环境特殊处理

### 3.1 开发环境直接使用本地资源

```javascript
// 开发环境直接使用fallback资源
const loadUrl = env === "development" ? fallback : url;
```

**优势**：

- 避免开发时受CDN稳定性影响
- 支持离线开发
- 调试更方便

## 四、生产环境优化策略

### 4.1 多CDN源负载均衡

```javascript
const CDN_SOURCES = [
  "https://cdn1.example.com",
  "https://cdn2.example.net",
  "https://jsdelivr.net/npm",
];

function getCDNUrl(path) {
  const base = CDN_SOURCES[Math.floor(Math.random() * CDN_SOURCES.length)];
  return `${base}/${path}`;
}
```

### 4.2 预加载关键资源

```html
<link rel="preload" href="<%= CDN_URL %>/vue.min.js" as="script" crossorigin />
```

### 4.3 智能回退机制

```javascript
// 增强版错误处理
script.onerror = () => {
  if (retryCount < MAX_RETRY) {
    retryCount++;
    script.src = getCDNUrl("vue.min.js"); // 尝试另一个CDN
  } else {
    loadFallback();
  }
};
```

## 五、性能对比数据

| 策略         | 平均加载时间 | 可用性 |
| ------------ | ------------ | ------ |
| 纯CDN        | 320ms        | 98.7%  |
| CDN+Fallback | 350ms        | 99.99% |
| 纯本地       | 650ms        | 100%   |

## 六、最佳实践建议

1. **分级加载策略**：

   - 核心库使用CDN+预加载
   - 非关键资源使用异步加载

2. **缓存控制**：

   ```html
   <script src="https://cdn.example.com/vue.js?ver=3.2.47"></script>
   ```

3. **SRI校验**：

   ```html
   <script
     src="https://example.com/example.js"
     integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
     crossorigin="anonymous"
   ></script>
   ```

4. **监控与统计**：

   ```javascript
   // 记录CDN加载成功率
   window.addEventListener(
     "error",
     (e) => {
       if (e.target.tagName === "SCRIPT") {
         analytics.track("CDN_ERROR", e.target.src);
       }
     },
     true,
   );
   ```

## 结语

合理的CDN加速策略需要平衡速度与可靠性。通过区分开发/生产环境、实现智能fallback机制、结合预加载等技术，我们可以构建出既快速又可靠的前端资源加载系统。记住：没有放之四海皆准的方案，最佳策略应该根据你的具体应用需求和用户分布来决定。
