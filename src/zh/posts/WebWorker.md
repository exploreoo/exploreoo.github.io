---
icon: pen-to-square
date: 2024-10-17
category:
  - 前端
tag:
  - js
  - api
---

# WebWorker

代码示例

```
export default class WorkerWrapper {
  constructor(work, options) {
    this.worker = new work();
    this.callbacks = new Map();
    this.worker.onmessage = (event) => {
      const { id, data } = event.data;
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(data);
        this.callbacks.delete(id);
      }
    };
  }

  postMessage(data, callback) {
    const id = Math.random().toString(36).substr(2);
    if (callback) {
      this.callbacks.set(id, callback);
    }
    this.worker.postMessage({ id, data });
  }

  // 终止进程
  terminate() {
    this.worker.terminate();
  }
}
```
