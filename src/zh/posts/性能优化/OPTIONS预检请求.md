---
icon: pen-to-square
date: 2025-03-15
category:
  - 前端
tag:
  - http
---

# OPTIONS 预检请求

## 什么是 OPTIONS 预检请求？

必须是**跨域**的场景下，当你通过浏览器发送一个请求时，为了保证**跨域安全控制**，浏览器不会立即发送该请求，而是**自动先发起一个 `OPTIONS` 请求**，询问目标服务器是否允许你真正的请求行为，这就是所谓的**预检请求（preflight request）**。

另外，预检请求**不会携带cookies**，即使设置了**withCredentials: true**或者**credentials: 'include'**。

## 哪些请求会触发预检？

**跨域**场景的前提下，只要**满足以下任一条件**，就会触发预检请求：

- 请求方法不是 `GET`、`POST` 或 `HEAD`（如：`PUT`、`DELETE`）
- 使用了自定义请求头（如：`Authorization`、`X-Token`、`Content-Type: application/json`），也就是除以下这些之外的：
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type`（仅限 `text/plain`、`multipart/form-data`、`application/x-www-form-urlencoded`）

<!-- more -->

## OPTIONS 请求流程简析

请求发出前，浏览器会：

1. 向服务器发一个 `OPTIONS` 请求，头部中包含实际请求的信息（方法、请求头等）。

2. 如果服务器返回了正确的 CORS 头（如 `Access-Control-Allow-*`），浏览器才会继续发实际请求。

   ```
   Access-Control-Allow-Origin: https://example.com
   Access-Control-Allow-Methods: PUT, DELETE
   Access-Control-Allow-Headers: Authorization
   Access-Control-Allow-Credentials: true
   ```

3. 否则，请求会被拦截，控制台报错。

## OPTIONS 请求的优缺点

### 优点：

- **增强安全性**：服务器有机会拒绝潜在危险的跨域请求。
- **标准化机制**：跨浏览器一致，支持精细化跨域控制。

### 缺点：

- **增加性能开销**：每次预检多了一次 HTTP 往返。
- **难以调试**：很多开发者误以为接口被调用多次。
- **受限于浏览器控制**：客户端无法完全规避。

## Vue CLI 中的开发代理如何影响预检？

```js
// vue.config.js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  }
}
```

这个配置让浏览器以为它是在本地请求本地接口，实际上是由 dev server 中转到后端。**因为浏览器感知不到跨域行为，所以不会触发预检请求。**

**一旦进入生产环境**，前后端部署在不同源上，CORS 就生效，预检请求便真实发生。

## HTTP/1.1 与 HTTP/2 对 CORS 预检的影响

虽然 OPTIONS 请求不是 HTTP 协议的专属特性（而是浏览器行为），但不同的协议版本会**对其性能产生明显影响**：

| 特性         | HTTP/1.1                         | HTTP/2                       |
| ------------ | -------------------------------- | ---------------------------- |
| 请求连接数   | 同域最多 6 条连接                | 单连接多路复用，避免连接阻塞 |
| OPTIONS 等待 | 请求顺序执行，预检阻塞主请求     | 并发发起，预检不会阻塞主请求 |
| 延迟表现     | 预检和实际请求串行，延迟高       | 并行传输，整体响应更快       |
| 实践影响     | 预检耗时更明显，尤其高频接口场景 | 即使触发预检，用户感知也较小 |

## 常见场景应用

| 场景                                    | 是否会触发预检？ | 原因                 |
| --------------------------------------- | ---------------- | -------------------- |
| POST + `Content-Type: application/json` | 会               | 非简单请求头         |
| GET 请求，无认证                        | 否               | 简单请求             |
| 使用 fetch + token                      | 会               | 自定义头触发预检     |
| Vue CLI + devServer 代理                | 否               | 非跨域（由代理伪装） |
| 生产环境调用后端接口                    | 会               | 跨域访问             |

## 如何优化预检请求？

1. **尽量使用简单请求**：

   - 请求方法用 `GET` 或 `POST`
   - 请求头避免使用 `application/json`，可用 `x-www-form-urlencoded` 替代

2. **设置预检缓存**：

   - 后端响应中添加 `Access-Control-Max-Age: 3600`，让浏览器缓存预检结果

3. **后端统一允许请求头/方法**：

   - 避免因为接口策略差异导致每个接口都触发预检

4. **使用代理在开发时屏蔽跨域**（仅限开发时）

## 总结

预检请求是现代浏览器出于安全考虑而引入的机制。它本身是中立的，但在实际开发中会带来性能和复杂度的权衡。理解它的原理与触发机制后，我们不仅能正确调试跨域问题，也能在性能上做出有效优化。
