---
icon: file-contract
date: 2024-12-01
category:
  - 前端
tag:
  - env
  - 工程化

---

## 环境变量配置与实践全指南（全面解释 + 示例）

> 适用场景：前端（Vite、Vue CLI/Webpack、CRA、Next.js、Nuxt）、Node.js 服务端、容器化（Docker/K8s）、CI/CD。涵盖 **构建时 vs 运行时**、**命名约定**、**优先级与加载顺序**、**安全与密钥管理**、**跨平台**、**类型校验** 等。

---

## TL;DR 要点（快速总结）

- **构建时（Build-time）与运行时（Runtime）必须分清**：多数前端框架会在构建时把环境变量写进打包产物，部署后改 `.env` 不会生效。若需要部署后能改，用运行时注入（`env.js` / `config.json` / Nginx `envsubst`）。
- **前端暴露即不安全**：凡放到浏览器的变量都不是秘密（API 域名、feature 开关可以，密钥或 token 绝不可）。
- **命名前缀**：不同框架用不同前缀暴露给前端（`VITE_`、`VUE_APP_`、`REACT_APP_`、`NEXT_PUBLIC_`、Nuxt 的 `runtimeConfig.public`）。
- **优先级与加载顺序**：一般 `.env.local` > `.env.[mode]` > `.env` > 系统环境；但不同工具略有差别。
- **类型校验**：使用 `envalid`、`zod` 在启动时校验，能大幅降低拼写错误或缺失导致的线上故障。
- **CI/Secrets/容器**：把密钥放在 CI/Secrets 或 Secret Manager（Vault、AWS Secrets Manager），不要提交到仓库或打包进前端产物。

---

## 1. 基本概念与常见误区

### 1.1 环境变量本质
- 环境变量都是字符串（`"true"`、`"123"`），你需要在代码中把它们转换成 boolean、number、array 等。
- 在前端构建工具中，`process.env.*` 或 `import.meta.env.*` 往往在编译阶段被替换为字面量（build-time）。

### 1.2 构建时 vs 运行时（关键）
- **构建时**：变量被静态注入到产物里（例如 `import.meta.env.VITE_...` 在构建后已确定）。如果你希望同一套静态文件在不同环境下工作（dev/staging/prod），不要在构建时 bake 机密或可变配置。
- **运行时**：应用启动或页面加载时读取（服务器端 `process.env`、容器运行时注入、或前端通过 `window.__APP_CONFIG__`/`config.json` 加载）。运行时注入能在部署后更改配置。

### 1.3 常见误区
- “把 API_KEY 放在前端 .env 就安全” —— 错误。前端所有变量都能被终端用户查看。任何秘密必须放服务端或 Secret 管理器。

---

## 2. Node.js（后端）: `.env` + `dotenv` + 校验（推荐做法）

### 2.1 文件结构示例
```
project/
├─ .env.example
├─ .env               # 本地默认（不要提交机密）
├─ .env.production    # 生产构建时可参考（但 secrets 不应该放在这里）
├─ src/
│  └─ config/
│     └─ env.ts
└─ package.json
```

### 2.2 加载与校验（TypeScript 示例）
```ts
// src/config/env.ts
import { config as dotenvLoad } from "dotenv";
import { cleanEnv, str, port, bool } from "envalid";

dotenvLoad(); // 加载 .env 文件到 process.env（不会覆盖已存在的系统环境变量）

export const ENV = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development","test","production"], default: "development" }),
  PORT: port({ default: 3000 }),
  API_BASE_URL: str(),
  ENABLE_FEATURE_X: bool({ default: false }),
});
```

### 2.3 使用时刻意转换类型
```ts
const portNumber: number = ENV.PORT;
const isFeatureX = ENV.ENABLE_FEATURE_X; // boolean
```

### 2.4 启动脚本（推荐 cross-env 做跨平台）
```json
// package.json
"scripts": {
  "dev": "cross-env NODE_ENV=development ts-node src/index.ts",
  "start": "node dist/index.js"
}
```

---

## 3. 前端（构建时）框架差异与示例

### 3.1 Vite（现代推荐）
- **前缀**：`VITE_`（只有以 VITE_ 开头的变量会暴露给客户端）
- **访问**：`import.meta.env.VITE_API_BASE` 或 `import.meta.env.MODE`
- **加载文件**：`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`

**示例 `.env.development`**
```env
VITE_API_BASE=http://localhost:3000
VITE_ENABLE_MOCK=true
```

**代码中使用**
```ts
const base = import.meta.env.VITE_API_BASE;
const isMock = import.meta.env.VITE_ENABLE_MOCK === "true";
```

**类型声明（env.d.ts）**
```ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_ENABLE_MOCK?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**注意**：Vite 在构建时将 `import.meta.env.*` 替换成字符串常量，部署后更改环境不会影响已经构建好的静态文件。

---

### 3.2 Vue CLI / Webpack（Vue 2/3 经典栈）
- **前缀**：`VUE_APP_`
- **访问**：`process.env.VUE_APP_API_BASE`
- **DefinePlugin**：可以自定义注入常量（例如构建元信息）

**vue.config.js**
```js
const webpack = require('webpack');
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __BUILD_TIME__: JSON.stringify(new Date().toISOString())
      })
    ]
  }
}
```

---

### 3.3 Create React App（CRA）
- **前缀**：`REACT_APP_`
- **访问**：`process.env.REACT_APP_API_BASE`

**示例**
```env
REACT_APP_API_BASE=/api
REACT_APP_FEATURE_X=1
```

---

### 3.4 Next.js（SSR / 混合）
- **前缀**：`NEXT_PUBLIC_` 用于客户端可见；无前缀仅在服务器端可读。
- **访问**：服务端 `process.env.SECRET_KEY`，客户端 `process.env.NEXT_PUBLIC_API_BASE`
- Next.js 支持在服务器运行时读取系统环境（部署后可改），但需要注意构建时和运行时的差异（例如在 Edge / SSG 场景）。

**示例 `.env`**
```env
NEXT_PUBLIC_API_BASE=https://api.example.com
SECRET_TOKEN=super-secret
```

---

### 3.5 Nuxt 3（推荐的运行时能力）
- 使用 `runtimeConfig`：分为 `private`（仅服务器可见）和 `public`（客户端可见），且支持运行时注入（不必在构建时 bake）。

**nuxt.config.ts**
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET, // private
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
```

**使用**
```ts
const config = useRuntimeConfig();
console.log(config.public.apiBase);
```

---

## 4. 让静态前端支持“部署后可改”的运行时配置（两种常用方案）

> 适用于: Vite/Cra/Vue-CLI 的静态 `dist/` 文件，希望在不同环境直接复用一份产物。

### 4.1 注入 `env.js`（在 index.html 之前加载）
**部署时生成 public/env.js**
```js
window.__APP_CONFIG__ = {
  API_BASE: "https://api.example.com",
  SENTRY_DSN: "",
  ENABLE_FEATURE_X: false
};
```

**在 index.html 里先引入**
```html
<script src="/env.js"></script>
<script>
  window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
</script>
```

**应用中读取**
```ts
const cfg = (window as any).__APP_CONFIG__ ?? {};
const API_BASE = cfg.API_BASE ?? "/api";
```

**在容器中动态生成 env.js（entrypoint.sh）**
```bash
# /docker-entrypoint.sh
envsubst < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js
nginx -g 'daemon off;'
```

`env.js.template` 示例：
```js
window.__APP_CONFIG__ = {
  API_BASE: "${API_BASE}",
  SENTRY_DSN: "${SENTRY_DSN}"
};
```

### 4.2 外部 `config.json`（请求拉取）
**部署时生成 /config.json（或由后端提供）**，应用首次启动时 fetch `/config.json` 并初始化配置。优点：更易于保护（可在后端上进行权限控制）。

**示例**
```ts
async function loadConfig() {
  const res = await fetch('/config.json');
  return await res.json();
}
const cfg = await loadConfig();
```

---

## 5. 容器化：Docker 与 Kubernetes

### 5.1 Docker 最佳实践
- 不要把密钥 bake 进镜像；在运行时注入环境变量（`docker run -e SECRET=...` 或 `docker-compose` environment）。
- 如果前端需要运行时注入 `env.js`，在容器 entrypoint 用 `envsubst` 替换模板。

**docker-compose 示例**
```yaml
version: "3.8"
services:
  web:
    image: my-spa:latest
    environment:
      - API_BASE=https://api.example.com
    volumes:
      - ./nginx/entrypoint.sh:/entrypoint.sh
    entrypoint: ["/bin/sh", "/entrypoint.sh"]
```

### 5.2 Kubernetes（ConfigMap / Secret）
- 使用 `ConfigMap` 传入非敏感配置，`Secret` 传入敏感信息。
- 在 Pod 中通过 `env` 或 `envFrom` 注入。

**示例**
```yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: web-config }
data:
  API_BASE: "https://api.example.com"
---
apiVersion: v1
kind: Secret
metadata: { name: web-secret }
type: Opaque
stringData:
  SENTRY_DSN: "https://xxxxx"
---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: web
          image: my-spa:latest
          env:
            - name: API_BASE
              valueFrom: { configMapKeyRef: { name: web-config, key: API_BASE } }
            - name: SENTRY_DSN
              valueFrom: { secretKeyRef: { name: web-secret, key: SENTRY_DSN } }
```

---

## 6. CI/CD（以 GitHub Actions 为例）

- 把 secrets 存在仓库的 Secrets，构建时从 Secrets 注入（注意：前端敏感信息仍不要注入到构建进程中）。
- 如果需要构建带某些公开变量的静态包，可在构建 job 的 env 中传入 `VITE_API_BASE` 等非敏感配置。

**示例 workflow**
```yaml
name: Build & Publish
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - name: Build
        env:
          VITE_API_BASE: ${{ secrets.VITE_API_BASE }}
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

**注意**：不要在 logs 中打印 secrets，也不要把 secrets 写入产物中（若确实需要运行时才可访问的密钥，应在服务器/容器 runtime 注入）。

---

## 7. 安全实践与密钥管理

- **前端不存密钥**：任何放入浏览器的变量都能被用户看到（F12、查看源代码、Network）。
- 使用 Secret Manager（Vault、AWS/GCP Secret Manager）或 CI/CD 的 Secrets 机制管理敏感配置。
- **密钥轮换**：制定密钥更换策略并自动化（短期 token 优先，配合 refresh token）。
- **审计与访问控制**：记录谁修改了哪些环境值。

---

## 8. 变量校验、类型化与最佳实践

### 8.1 Node.js（envalid / zod）
```ts
import { cleanEnv, str, port, bool } from "envalid";
export const ENV = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  API_BASE: str(),
  ENABLE_X: bool({ default: false })
});
```

### 8.2 前端运行时配置校验（zod）
```ts
import { z } from "zod";

const ConfigSchema = z.object({
  API_BASE: z.string().url(),
  ENABLE_X: z.boolean().optional()
});

const cfg = (window as any).__APP_CONFIG__ ?? {};
export const APP_CONFIG = ConfigSchema.parse(cfg);
```

### 8.3 TypeScript 声明（Vite）
```ts
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_FLAG?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## 9. 常见操作系统设置环境变量（速查）

- macOS / Linux (bash/zsh):
```bash
export API_BASE=https://api.example.com
node server.js
```

- Windows PowerShell:
```powershell
$env:API_BASE="https://api.example.com"
node server.js
```

- Windows cmd.exe:
```
set API_BASE=https://api.example.com
node server.js
```

- npm script（跨平台）:
```json
"scripts": {
  "dev": "cross-env API_BASE=http://localhost:3000 vite"
}
```

---

## 10. 调试与排错技巧

- **构建时查看替换**：在开发/构建中临时 `console.log(import.meta.env)` 或 `console.log(process.env)` 来检查哪些变量被注入（生产请删除）。
- **容器内查看**：`docker exec -it <container> /bin/sh` 然后 `printenv` 或 `env` 检查变量是否被注入。
- **不要打印 secrets**：避免在 CI 日志或控制台输出敏感数据。
- **优先级问题**：确认 `.env.local` 是否覆写了其他 `.env` 文件（本地开发常犯）。

---

## 11. 示例 `.env.example` 模板

```env
# FRONTEND (Vite)
VITE_API_BASE=
VITE_ENABLE_FEATURE_X=false

# NEXT / Server side
SECRET_TOKEN=
NEXT_PUBLIC_API_BASE=

# Node.js service
PORT=3000
API_BASE=

# Sentry / Logging
SENTRY_DSN=
LOG_LEVEL=info
```

---

## 12. 小结与实践清单（Checklist）

- [ ] 明确哪些变量是“公开的”（放到客户端）哪些是“私有的”（仅服务器）
- [ ] 避免在构建时 bake secrets 到前端产物
- [ ] 使用 `envalid` / `zod` 在启动时校验 env
- [ ] 容器/CI 使用 Secrets / ConfigMap 注入运行时变量
- [ ] 静态站使用 `env.js` 或 `config.json` 实现运行时可改
- [ ] 为关键变量添加类型声明和文档（`.env.example`）
- [ ] 设置密钥轮换与审计机制

---

如果你希望，我可以：
- 按你的技术栈（例如 **Vue 3 + Vite** 或 **Nuxt 3**）生成一页速查卡；
- 把这份文档导出为 Markdown 文件或 PDF，并把文件放到你能下载的位置。

