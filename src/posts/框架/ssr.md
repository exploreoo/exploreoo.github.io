---
icon: file-contract
date: 2024-12-01
category:
  - 前端
tag:
  - vue
  - SSR
---

# SSR

## 引言

服务器端渲染（Server-Side Rendering，简称 SSR）是指在服务器端生成 HTML 内容并发送到客户端的过程。与客户端渲染（Client-Side Rendering，简称 CSR）相比，SSR 可以提高首屏加载速度和 SEO 友好性。
如需更高级的集成框架可以使用nuxtjs

<!-- more -->

### 文件结构

```
my-ssr-app/
├── dist/                      # 构建输出目录
├── public/                    # 公共资源目录
│   └── index.html             # HTML 模板
├── src/                       # 源代码目录
│   ├── entry-client.js        # 客户端入口文件
│   ├── entry-server.js        # 服务器端入口文件
|   └── main.js
├── package.json               # 项目配置文件
├── server.js                  # Express 服务器配置
└── vue.config.js   					 # Webpack 服务器端配置
```

## 构造流程

### 1. 安装必要的依赖

SSR 需要一些额外的依赖包，如 `@vue/server-renderer` 和 `express`。在项目根目录下运行以下命令安装这些依赖：

```shell
npm install @vue/server-renderer express webpack-manifest-plugin webpack-node-externals --save-dev
```

相关版本：

```
"@vue/cli-service": "~5.0.0",
"express": "^4.21.2",
"@vue/server-renderer": "^3.5.13",
"webpack-manifest-plugin": "^5.0.0",
"webpack-node-externals": "^3.0.0"
```

### 2. 配置 Webpack

SSR 需要两个 Webpack 配置：一个用于客户端打包，另一个用于服务器端打包。服务器端需要输出node环境的编译输出，为了拿到对应入口的路径，需要借助WebpackManifestPlugin形成映射表。

#### vue.config.js

```
const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

let SSR = process.env.SSR;

module.exports = {
  outputDir: SSR ? "dist/server" : "dist/client",
  configureWebpack: (config) => {
    if (SSR) {
      // 服务器端打包配置
      return {
        entry: "./src/entry-server.js",
        target: "node",
        output: {
          libraryTarget: "commonjs2",
        },
        externals: [webpackNodeExternals({ allowlist: /\.(css|vue)$/ })],
        plugins: [
          new CleanWebpackPlugin(),
          new WebpackManifestPlugin({ fileName: "ssr-manifest.json" }),
        ],
      };
    } else {
      // 客户端打包配置
      return {
        entry: "./src/entry-client.js",
        plugins: [
          new CleanWebpackPlugin(),
        ],
      };
    }
  },
};

```

### 3. 改造main.js

main文件不再直接挂载vue实例，改造为方法提供给客户端、服务端渲染调用。

```
import { createSSRApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory, createMemoryHistory } from "vue-router";
import routes from "./router";
import { createStoreInstance } from "./store";

export function createApp() {
  const SSR = typeof window === "undefined";
  const history = SSR ? createMemoryHistory() : createWebHistory();
  const router = createRouter({ history, routes });
  const store = createStoreInstance();

  const app = createSSRApp(App);
  app.use(router);
  app.use(store);

  return { app, router, store };
}
```

### 4. 创建入口文件

创建两个入口文件：`entry-client.js` 和 `entry-server.js`。

#### entry-client.js

```
import { createApp } from "./main";

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.isReady().then(() => {
  app.mount("#app");
});
```

#### entry-server.js

```
import { createApp } from "./main";

export default function render () {
  const { app, router, store } = createApp();

  return {
    app,
    router,
    store,
  };
}
```

### 5. 创建服务器

创建 `server.js` 文件，用于设置 Express 服务器：

```
const express = require("express");
const fs = require("fs");
const path = require("path");
const { renderToString } = require("@vue/server-renderer");
const manifest = require("./dist/server/ssr-manifest.json");

const server = express();
const entry = path.join(__dirname, "./dist", "server", manifest["main.js"]);
const render = require(entry).default;

/**
 * 1.使用 server.use(express.static(path.join(__dirname, './dist/client'))); 会导致所有请求路径都被静态文件中间件处理，从而可能跳过服务器端渲染逻辑。
 * 2.通过细粒度的静态文件服务配置，或者在配置静态文件服务时排除应用程序的路由，可以确保服务器端渲染逻辑（包括 asyncData 的触发）能够正常工作。
 */
server.use(
  "/img",
  express.static(path.join(__dirname, "./dist/client", "img"))
);
server.use("/js", express.static(path.join(__dirname, "./dist/client", "js")));
server.use(
  "/css",
  express.static(path.join(__dirname, "./dist/client", "css"))
);
server.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "./dist/client", "favicon.ico"))
);

server.get("*", async (req, res) => {
  const { app, router, store } = render();
  router.push(req.url);
  await router.isReady();

  try {
    const matchedComponents = router.currentRoute.value.matched;
    // console.log(1, matchedComponents);
    // 主动触发所有匹配组件的 asyncData 函数
    await Promise.all(
      matchedComponents.map((Component) => {
        console.log(2, Component);
        if (Component.components.default.methods.asyncData) {
          return Component.components.default.methods.asyncData({
            app,
            router,
            store,
          });
        }
      })
    );

    const appContent = await renderToString(app);

    fs.readFile(
      path.join(__dirname, "./dist/client/index.html"),
      (err, html) => {
        if (err) {
          throw err;
        }

        html = html
          .toString()
          .replace('<div id="app">', `<div id="app">${appContent}`)
          .replace(
            "</script>",
            `</script><script type="application/javascript">window.__INITIAL_STATE__=${JSON.stringify(
              store.state
            )}</script>`
          );
        res.setHeader("Content-Type", "text/html");
        res.send(html);
      }
    );
  } catch (err) {
    if (err.code === 404) {
      res.status(404).end("Page not found");
    } else {
      res.status(500).end("Internal Server Error");
    }
  }
});

server.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});
```

### 6. 构建和运行

在 `package.json` 中添加构建和启动脚本：

```
"scripts": {
    "build:client": "vue-cli-service build",
    "build:server": "cross-env SSR=1 vue-cli-service build",
    "build": "npm run build:client && npm run build:server",
    "start": "node server.js"
}
```

运行以下命令构建项目并启动服务器：

```
npm run build
npm start
```

访问 `http://localhost:8080`，你将看到服务器端渲染的 Vue 应用。

## SSR优缺点

### 优点

1. **更快的首屏加载速度**：SSR 可以在服务器端生成完整的 HTML 页面，减少客户端渲染的时间，从而提高首屏加载速度。
2. **更好的 SEO**：搜索引擎可以更好地抓取和索引服务器端渲染的内容，从而提高 SEO 友好性。
3. **更好的用户体验**：SSR 可以在用户请求页面时立即返回完整的 HTML 内容，减少白屏时间，提高用户体验。

### 缺点

1. **更复杂的配置**：SSR 需要额外的 Webpack 配置和服务器端代码，增加了项目的复杂性。
2. **更高的服务器负载**：服务器需要处理更多的渲染任务，可能会增加服务器的负载。
3. **开发调试困难**：SSR 的调试和开发相对复杂，需要处理更多的边界情况和错误。
