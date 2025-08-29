---
icon: file-contract
date: 2025-06-15
category:
  - 前端 
  - es6
tag:
  - es6
star: true
---

# Proxy中的this

## Proxy并不是透明代理

在 JavaScript 中，Proxy 可以拦截并自定义对象的基本操作，但它并不是目标对象的透明代理。即使不做任何拦截，Proxy 也无法完全模拟原始对象的行为，这主要源于 `this` 指向的变化问题。

## this 指向问题

### 1. 方法调用时的 this 指向

```javascript
const target = {
  m() {
    console.log(this === proxy); // true 当通过proxy调用时
  }
};
const handler = {};
const proxy = new Proxy(target, handler);

target.m(); // false - 直接调用，this指向target
proxy.m();  // true  - 通过proxy调用，this指向proxy
```

**关键点**：当通过 Proxy 调用方法时，方法内部的 `this` 会指向 Proxy 实例而非原始对象。

引发的实际问题：

```javascript
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name); // 使用this作为WeakMap的key
  }
  get name() {
    return _name.get(this); // 依赖this取值
  }
}

const jane = new Person('Jane');
const proxy = new Proxy(jane, {});

console.log(jane.name); // 'Jane' - 正常工作
console.log(proxy.name); // undefined - this指向改变导致无法获取值
```

**问题根源**：由于 `this` 指向 proxy 而非原始 jane 实例，WeakMap 无法找到对应的值。

### 2. 内置对象的特殊问题

```javascript
//以Date类型为例
const date = new Date();
const proxy = new Proxy(date, {});

proxy.getDate(); // TypeError: this is not a Date object
```

**原因**：Date 方法内部会校验 `this` 是否为真正的 Date 实例。

解决方案：显式绑定 this

```javascript
const handler = {
  get(target, prop) {
    if (typeof target[prop] === 'function') {
      return target[prop].bind(target); // 绑定到原始对象
    }
    return Reflect.get(target, prop);
  }
};
```

## 深度解析：三种 this 上下文

1. **目标对象 this**：原始对象方法中的 this
2. **Proxy this**：通过 proxy 调用时的 this（指向 proxy）
3. **Handler this**：拦截器方法中的 this（指向 handler 对象）

```javascript
const handler = {
  get(target, prop, receiver) {
    console.log(this === handler); // true
    return Reflect.get(target, prop, receiver);
  }
};

const proxy = new Proxy({}, handler);
proxy.foo; // 输出 true
```



## 为什么Proxy中需要Reflect？

### 1. 原型链中的属性访问

```javascript
const target = {
  get getName() {
    return this.name;
  },
};

const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // return target[key];
    // return Reflect.get(target, key, receiver);
  },
});

const obj = Object.create(proxy);
obj.name = "Alice";
console.log(obj.getName); //undefined
```

1. **直接访问 `target[key]` 的问题**
    - 当调用 `obj.getName` 时，`this` 会指向 `target` 而非 `obj`
    - 导致无法访问 `obj` 上设置的 `name` 属性
    - 结果返回 `undefined`，因为 `target` 没有 `name` 属性
2. **使用 `Reflect.get(target, key, receiver)` 的正确性**
    - `receiver` 参数（这里是 `obj`）会作为 getter 的 `this` 值
    - 保持原型链的完整性，正确返回 `"Alice"`
    - 符合 JavaScript 的原型链查找规则

### 2. 私有属性保护

```javascript
const parent = {
  _secret: "parent secret",
  get secret() {
    return this._secret;
  }
};

const handler = {
  get(target, key, receiver) {
    if (key.startsWith('_')) {
      throw new Error(`Access to private property "${key}" is denied`);
    }
    
    // 方式1: 直接访问
    // return target[key];
    
    // 方式2: 使用 Reflect.get
    return Reflect.get(target, key, receiver);
  }
};

const proxy = new Proxy(parent, handler);
console.log(proxy.secret);
```

1. **直接访问 `target[key]` 的问题**
    - 当访问 `secret` 时，getter 中的 `this._secret` 直接访问 `target`
    - 完全绕过 Proxy 的拦截检查
    - 可以成功访问到 `_secret`，破坏封装性
2. **使用 `Reflect.get` 的正确性**
    - 保持完整的属性访问链
    - 当 getter 中访问 `this._secret` 时，会再次触发 Proxy 的 `get` trap
    - 抛出错误，符合私有属性保护的设计意图

### 结论

1. **保持操作完整性**：
    - 维护完整的原型链和属性访问链
    - 正确处理 getter/setter 中的 `this` 绑定
2. **与 Proxy 完美配合**：
    - `receiver` 参数专门为 Proxy 设计
    - 确保拦截操作的行为一致性
3. **元编程一致性**：
    - 提供与 Proxy traps 一一对应的反射方法
    - 使元编程代码更可预测
4. **符合语言规范**：
    - 实现与引擎内部相同的操作语义
    - 避免手动实现可能导致的边缘情况问题



## 最佳实践

### 1. 使用 Reflect 正确传递 receiver，保持一致性

```javascript
const handler = {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  }
};
```

### 2. 针对内置对象做特殊处理（Set/Map/RegExp/Array等场景）

```javascript
const setHandler = {
  get(target, prop) {
    const value = target[prop];
    if (typeof value === 'function') {
      return function(...args) {
        const result = value.apply(target, args);
        return result === target ? proxy : result; // 保持链式调用
      };
    }
    return value;
  }
};
```

### 3.观察者模式

```javascript
const mapQueue = new Map();

const observe = (key, callback) => {
  if (!mapQueue.has(key)) {
    mapQueue.set(key, []);
  }
  mapQueue.get(key).push(callback);
};
const unobserve = (key, callback) => {
  if (mapQueue.has(key)) {
    mapQueue.get(key).splice(mapQueue.get(key).indexOf(callback), 1);
  }
};
const observable = (obj) => {
  return new Proxy(obj, {
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      if (mapQueue.has(prop)) {
        mapQueue.get(prop).forEach((callback) => callback());
      }
      return result;
    },
  });
};

const obj = observable({
  name: "John",
  age: 20,
});

observe("name", () => {
  console.log(`name changed: ${obj.name}`);
});
observe("name", () => {
  console.log(`function-2`);
});
const test = () => {
  console.log(`unobserve function`);
};
observe("name", test);
unobserve("name", test);

obj.name = "Jane"; 
// 输出
// name changed: Jane
// function-2        
```

### 4.客户端网络请求

```javascript
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl + '/' + propKey);
    }
  });
}
```

