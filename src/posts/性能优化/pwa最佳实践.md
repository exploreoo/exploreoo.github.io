---
icon: file-contract
date: 2025-04-10
category:
  - 前端
tag:
  - vue
  - PWA
---

# Vue CLI+PWA

## 什么是 PWA（Progressive Web App 渐进式网络应用）

PWA 是一种结合了 Web 与原生应用优势的前端技术架构，核心能力包括：

- **离线访问**：即使断网也能使用应用
- **可安装**：可以被添加到手机主屏幕，像 App 一样运行
- **性能优化**：资源按需缓存，提高加载速度
- **自动更新**：通过 Service Worker 实现静默或提示式资源更新

<!-- more -->

---

## 集成 Vue CLI PWA 插件

在 Vue CLI 5 项目中集成 PWA使用的是@vue/cli-plugin-pwa，其实也是基于 Google Chrome 团队的 workbox开发的，参考https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
使用安装命令：

```bash
vue add pwa
```

---

## 配置 vue.config.js

以下是一份推荐的完整配置，适用于大多数业务场景：

```js
module.exports = {
  pwa: {
    // 应用名称，会注入 index.html 和 manifest.json 的 name 字段
    name: "My App",
    // 主题色，会注入 <meta name="theme-color" />
    themeColor: "#42b983",
    // Windows 磁贴颜色 <meta name="msapplication-TileColor" />
    msTileColor: "#000000",
    // 设置是否以 Web App 模式运行（iOS 专用）<meta name="apple-mobile-web-app-capable" />
    appleMobileWebAppCapable: "yes",
    // iOS 状态栏样式 <meta name="apple-mobile-web-app-status-bar-style" />
    appleMobileWebAppStatusBarStyle: "black",
    // manifest.json 的自定义配置，会与插件默认值合并
    // manifestOptions: {
    //   short_name: 'App',
    //   start_url: '.',
    //   display: 'standalone',
    //   background_color: '#ffffff',
    //   icons: [
    //     {
    //       src: '/img/icons/android-chrome-192x192.png',
    //       sizes: '192x192',
    //       type: 'image/png'
    //     },
    //     {
    //       src: '/img/icons/android-chrome-512x512.png',
    //       sizes: '512x512',
    //       type: 'image/png'
    //     }
    //   ]
    // },

    // Service Worker 插件模式
    // 'GenerateSW': 自动生成 SW（推荐）
    // 'InjectManifest': 使用自定义的 service-worker 源文件
    workboxPluginMode: "GenerateSW",
    // workbox 的详细配置项
    workboxOptions: {
      // 仅在使用 InjectManifest 时需要指定
      // swSrc: 'src/service-worker.js',

      // 跳过等待，立即激活新 SW
      skipWaiting: true,
      // 激活新 SW 后立即接管所有页面
      clientsClaim: true,
      // 指定缓存白名单（默认使用 Workbox 生成的规则）
      exclude: [/\.map$/, /manifest\.json$/],
      // **运行时缓存配置**（重点）
      runtimeCaching: [
        // 首页 HTML，确保用户获取最新内容
        {
          urlPattern: /^\/(index\.html)?$/,
          handler: "NetworkFirst",
          options: {
            cacheName: "html-cache",
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24, // 1 天
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // JS 和 CSS 文件，使用缓存同时后台更新
        {
          urlPattern: /\.(?:js|css)$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-resources",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 图片资源，使用缓存优先策略
        {
          urlPattern: /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "image-cache",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 60, // 60 天
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // 字体资源
        {
          urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "font-cache",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 60,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // CDN 第三方依赖（如 jsDelivr / unpkg）
        {
          urlPattern: /^https:\/\/(cdn\.jsdelivr\.net|unpkg\.com)\//,
          handler: "CacheFirst",
          options: {
            cacheName: "cdn-cache",
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        // // 可选：API 接口缓存（仅在有 API 请求时使用）
        // {
        //   urlPattern: /^https:\/\/your-api\.com\/.+/,
        //   handler: "NetworkFirst",
        //   method: "GET",
        //   options: {
        //     cacheName: "api-cache",
        //     expiration: {
        //       maxEntries: 30,
        //       maxAgeSeconds: 60 * 60 * 24,
        //     },
        //     cacheableResponse: {
        //       statuses: [0, 200],
        //     },
        //   },
        // },
      ],
    },

    // 是否启用 service worker 注册（默认 true）
    // 如果设置为 false，将不会注册任何 SW
    // 通常在开发环境中可以关闭
    // 注意：这不是官方文档中的标准字段，但部分社区方案支持
    // workboxEnabled: process.env.NODE_ENV === 'production'
  },
};
```

### handler参数配置，也就是workbox策略

- Stale While Revalidate（重新验证时过期）

  此策略将对网络请求使用缓存来响应（如果有），并在后台更新缓存。如果未缓存，它将等待网络响应并使用它。

- Network First（网络优先）

  此策略将尝试首先从网络获得响应。如果收到响应，它将把它传递给浏览器，并将其保存到缓存中。如果网络请求失败，将使用最后一个缓存的响应。

- Cache First（缓存优先）

  此策略将首先检查缓存中是否有响应，如果有响应，则使用该策略。如果请求不在缓存中，则将使用网络，并将任何有效响应添加到缓存中，然后再传递给浏览器。

- Network Only（仅网络）

  强制响应来自网络。

- Cache Only（仅缓存）

- 强制响应来自缓存。

---

## 注册 Service Worker

在 `main.js` 中引入：

```js
import "./registerServiceWorker";
```

然后在 `src/registerServiceWorker.js` 中监听更新并提示用户刷新页面：

```js
import { register } from "register-service-worker";

if (!("serviceWorker" in navigator)) {
  console.log("【PWA】PWA not supported");
}
if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "【PWA】App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB",
      );
    },
    registered() {
      console.log("【PWA】Service worker has been registered.");
    },
    cached() {
      console.log("【PWA】Content has been cached for offline use.");
    },
    updatefound() {
      console.log("【PWA】New content is downloading.");
    },
    updated() {
      console.log("【PWA】New content is available; please refresh.");
      // if (confirm("检测到新版本，是否更新？")) {
      //   window.location.reload();
      // }
    },
    offline() {
      console.log(
        "【PWA】No internet connection found. App is running in offline mode.",
      );
    },
    error(error) {
      console.error("【PWA】Error during service worker registration:", error);
    },
  });
}
```

---

## 开发与测试技巧

- 开发环境下默认不启用 PWA（避免调试缓存）
- 建议使用 `live-server dist/` 或 `serve -s dist` 方式本地测试生产版本
- 打开 DevTools → Application → Service Workers 查看缓存与更新状态

---

## 常见问题解答

### 为什么断网后不能访问页面？

确保你访问的是构建后的生产环境，并已注册成功的 Service Worker。首次访问必须联网才能缓存资源。

### 为什么更新了代码，但浏览器没更新内容？

默认 Service Worker 安装后不会立刻接管，需设置：

```js
workboxOptions: {
  skipWaiting: true,
  clientsClaim: true
}
```

并在更新时主动 `reload()` 页面。
