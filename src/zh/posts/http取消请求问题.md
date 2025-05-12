---
icon: pen-to-square
date: 2025-02-26
category:
  - 前端
tag:
  - 性能优化
---

# http取消请求问题

## 问题场景

在实现ESOP文档显示功能时，需要根据文档分类和工序查询大文件（视频/文档）并解析。由于解析接口耗时，当用户快速切换分类或工序时，会遇到以下核心问题：

1. **请求异常**  
   批量取消旧请求后立即发起新请求，Network面板无新请求产生

2. **进度条异常**  
   NProgress进度条在取消操作后不显示

## 问题分析

### 请求取消机制失效

```javascript
function queryStep() {
  if (this.source) {
    this.source.cancel("Operation canceled by the user.");
  }
  this.source = axios.CancelToken.source(); // 关键点
  this.refreshQuery();
}
```

**问题本质**：  
当使用同一个`CancelToken.source()`实例时，旧请求取消操作会污染新请求的令牌实例，导致请求未实际发出。

### 进度条同步控制问题

拦截器配置：

```javascript
axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // 同步执行
  },
  (error) => {
    NProgress.done();
  },
);

axios.interceptors.response.use(
  (response) => NProgress.done(),
  (error) => NProgress.done(),
);
```

**问题本质**：  
取消操作(`source.cancel()`)作为同步代码会立即触发响应拦截器的`error`分支，导致进度条提前关闭。

<!-- more -->

---

## 解决方案

### 方案一：请求计数器模式（推荐）

#### 实现原理

```javascript
let requestCount = 0;

const responseHandler = () => {
  requestCount--;
  if (requestCount === 0) NProgress.done();
};

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    requestCount++;
    if (requestCount === 1) NProgress.start();
    return config;
  },
  (error) => {
    responseHandler();
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    responseHandler();
    return response;
  },
  (error) => {
    responseHandler();
    return Promise.reject(error);
  },
);
```

**方案优势**：

1. 自动处理并发请求
2. 精确控制进度条状态
3. 避免取消操作的副作用

### 方案二：异步任务隔离

#### 实现原理

```javascript
function queryStep() {
  if (this.source) {
    this.source.cancel("Operation canceled by the user.");
  }
  this.source = axios.CancelToken.source();

  // 将新请求放入事件队列下一周期
  setTimeout(() => {
    this.refreshQuery();
  }, 0);
}
```

---

## 方案对比

| 维度         | 请求计数器       | 异步隔离         |
| ------------ | ---------------- | ---------------- |
| 适用场景     | 多并发请求场景   | 简单请求场景     |
| 代码侵入性   | 需要改造拦截器   | 仅修改业务方法   |
| 维护成本     | 需要全局状态管理 | 局部修改即可     |
| 进度条精确度 | 精确控制（推荐） | 可能有微小延迟   |
| 浏览器兼容性 | 全兼容           | 依赖事件循环机制 |

---

## 实施建议

1. **常规项目首选方案一**  
   适合中大型项目，建立全局请求管理机制

2. **快速修复可选用方案二**  
   适合紧急问题修复或简单项目场景

3. **注意axios版本兼容性**

   ```bash
   npm install axios@^1.3.4 --save # 推荐稳定版本
   ```

4. **必要测试用例**

   ```javascript
   // 测试用例示例
   test("快速切换请求应正确显示进度条", async () => {
     const source1 = axios.CancelToken.source();
     const source2 = axios.CancelToken.source();
   
     // 发起并取消请求
     axios.get("/api1", { cancelToken: source1.token });
     source1.cancel();
   
     // 发起新请求
     await axios.get("/api2", { cancelToken: source2.token });
   
     expect(NProgress.isStarted()).toBe(false);
   });
   ```

---

## 总结

通过本文的两种方案，开发者可以：

1. 彻底解决请求取消导致的进度条异常
2. 确保高频操作下的请求可靠性
3. 提升用户交互体验

> "优秀的请求管理就像空气——用户感受不到它的存在，但缺失时体验会立即崩溃。" - 前端工程之道

实际应用中建议根据项目规模选择方案，并配合完善的单元测试。更多前端工程化实践技巧，欢迎关注我的博客专栏。
