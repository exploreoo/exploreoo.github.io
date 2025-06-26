---
icon: pen-to-square
date: 2025-02-13
category:
  - 前端
tag:
  - websocket
---

# 重学WebSocket

## 概念

WebSocket是一种在单个TCP连接上进行全双工通信的协议，于2011年被IETF标准化为RFC 6455。它允许服务端主动向客户端推送数据，实现了真正的实时通信。

## 与HTTP对比

| 特性         | HTTP             | WebSocket          |
| ------------ | ---------------- | ------------------ |
| 通信模式     | 请求-响应        | 全双工             |
| 连接持续时间 | 短连接           | 长连接             |
| 头部开销     | 每个请求都有头部 | 初始握手后开销极小 |
| 数据推送     | 只能客户端发起   | 双方都可主动推送   |
| 适用场景     | 传统网页浏览     | 实时应用           |

## 工作原理

### 1 握手过程

WebSocket连接始于一个特殊的HTTP升级请求：

```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

服务器响应：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

### 2 数据帧格式

WebSocket数据帧采用二进制格式传输，基本结构如下：

```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
```

## 使用场景

### 1 实时聊天应用

WebSocket是构建聊天应用的理想选择，可以实现即时消息传递、在线状态更新等功能。

### 2 实时游戏

多人在线游戏需要低延迟的双向通信，WebSocket能够满足这一需求。

### 3 金融交易系统

股票行情、加密货币价格等实时数据推送。

### 4 协同编辑工具

如Google Docs类似的多人实时协作编辑功能。

### 5 物联网(IoT)控制

实时监控和控制物联网设备。

## WebSocket客户端实现

### 1 浏览器API

```javascript
const socket = new WebSocket('wss://example.com/chat');

// 连接建立
socket.onopen = (event) => {
  console.log('连接已建立');
  socket.send('Hello Server!');
};

// 接收消息
socket.onmessage = (event) => {
  console.log(`收到消息: ${event.data}`);
};

// 错误处理
socket.onerror = (error) => {
  console.error('WebSocket错误:', error);
};

// 连接关闭
socket.onclose = (event) => {
  console.log('连接关闭', event.code, event.reason);
};
```

### 2 发送不同类型数据

```javascript
// 发送文本
socket.send('Hello World');

// 发送JSON
socket.send(JSON.stringify({ type: 'message', content: 'Hello' }));

// 发送二进制数据
const buffer = new ArrayBuffer(128);
socket.send(buffer);
```

## WebSocket服务端实现(Node.js)

### 1 使用ws库

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('新客户端连接');
  
  // 接收消息
  ws.on('message', (message) => {
    console.log(`收到消息: ${message}`);
    // 广播给所有客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 连接关闭
  ws.on('close', () => {
    console.log('客户端断开连接');
  });
    
  ws.on('error', (err) => {
    console.log('错误', err);
  });
});
```

### 2 心跳机制实现

```javascript
// 心跳检测
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});
```

## 生产环境最佳实践

### 1 安全措施

1. 始终使用WSS(WebSocket Secure)
2. 验证Origin头部
3. 实现认证和授权
4. 限制消息大小

### 2 性能优化

1. 启用压缩
   ```javascript
   const wss = new WebSocket.Server({
     perMessageDeflate: true
   });
   ```
2. 使用二进制协议替代JSON
3. 实现消息批处理

### 3 错误处理和恢复

1. 实现自动重连
   ```javascript
   function connect() {
     const socket = new WebSocket(url);
     
     socket.onclose = () => {
       setTimeout(connect, 1000);
     };
   }
   ```
2. 优雅降级方案
3. 网络状态检测

## 常见问题解决方案

### 1 连接限制问题

浏览器对同一域名的WebSocket连接数有限制(通常6个)，解决方案：
- 使用子域名分散连接
- 复用连接，多路复用消息

### 2 跨域问题

```javascript
const wss = new WebSocket.Server({
  verifyClient: (info, callback) => {
    const origin = info.origin.match(/\.?example\.com$/);
    callback(origin);
  }
});
```

### 3 负载均衡问题

1. 使用粘性会话(Sticky Session)
2. 通过Redis共享连接状态

## 替代方案

### 1 Server-Sent Events (SSE)

适合服务器到客户端的单向通信场景。

### 2 WebTransport

新兴的基于QUIC协议的传输技术。

### 3 WebRTC

适合点对点(P2P)通信场景。
