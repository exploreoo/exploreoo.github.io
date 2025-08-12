---
icon: pen-to-square
date: 2024-10-17
category:
  - 前端
tag:
  - js
  - api

---

# worker

## WebWorker (专用 Worker)

1. **作用范围**：
    - 仅能被创建它的脚本访问
    - 每个标签页/窗口中的 Worker 实例是独立的
2. **通信方式**：
    - 通过 `postMessage` 与创建它的主线程直接通信
    - 使用 `onmessage` 接收消息
3. **生命周期**：
    - 与创建它的页面绑定，页面关闭时 Worker 终止
4. **典型用途**：
    - 单个页面内的后台计算任务
    - 避免主线程阻塞

## SharedWorker (共享 Worker)

1. **作用范围**：
    - 可被同源下的多个浏览器上下文(标签页、窗口、iframe等)共享
    - 所有同源页面共享同一个 Worker 实例
2. **通信方式**：
    - 通过 `port` 对象进行通信
    - 需要显式调用 `port.start()` 开始通信
    - 每个连接都有独立的端口
3. **生命周期**：
    - 只要有一个连接存在，Worker 就会保持运行
    - 所有连接关闭后，Worker 可能被终止
4. **典型用途**：
    - 跨标签页/窗口的数据共享
    - 多个页面间的状态同步
    - 共享的后台服务

## 代码示例

### WebWorker 示例

```
// 主线程
const worker = new Worker('worker.js');
worker.postMessage('Hello Worker');
worker.onmessage = (e) => {
  console.log('From worker:', e.data);
};

// worker.js
self.onmessage = (e) => {
  console.log('From main:', e.data);
  postMessage('Hello Main');
};
```

### SharedWorker 示例

```
// 主线程
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.start(); // 必须显式启动
sharedWorker.port.postMessage('Hello SharedWorker');
sharedWorker.port.onmessage = (e) => {
  console.log('From shared worker:', e.data);
};

// shared-worker.js
let ports = [];
onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.onmessage = (e) => {
    console.log('From client:', e.data);
    // 可以广播给所有连接的端口
    ports.forEach(p => p.postMessage('Broadcast: ' + e.data));
  };
};
```

## 兼容性注意事项

1. SharedWorker 的浏览器支持度较 WebWorker 低
2. 某些浏览器(如移动端浏览器)可能不支持 SharedWorker
3. 在 Service Worker 环境中不能使用 SharedWorker