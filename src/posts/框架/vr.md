---
icon: file-contract
date: 2024-08-02
category:
  - 前端
  - vue
  - React
tag:
  - 框架
  - vue
  - React
---

# 框架选型设计（vue/react）

## 1. 设计理念

| 特性     | Vue                                              | React                            |
| -------- | ------------------------------------------------ | -------------------------------- |
| 定位     | 渐进式框架                                       | UI 库                            |
| 编程范式 | 选项式（Option API） + 组合式（Composition API） | 函数式                           |
| 架构设计 | 内聚（内建路由、状态管理）                       | 解耦（核心只管视图，其他靠社区） |
| 组件形式 | vue文件（模板 + JS）                             | JSX（JS + XML）                  |

Vue 更强调易用性和渐进增强，适合快速开发。其内置了黑魔法，例如：SFC、宏函数、指令、scoped等；

React 更强调灵活性和函数式编程，更适合复杂业务需求。

<!-- more -->

---

## 2. 响应式系统

### Vue：基于 Proxy 的响应式系统

Vue 3 引入 Proxy 作为响应式核心，实现了更高效的依赖追踪与自动更新。

```js
const state = reactive({ count: 0 });

watchEffect(() => {
  console.log(state.count);
});
```

- **属性级追踪**响应依赖，更新粒度更细；
- 响应式核心独立（@vue/reactivity 可单独使用）

### React：基于 Hooks 的状态管理

React 的响应式依赖于状态更新机制，通过 `useState` 和 `useEffect` 控制组件更新。

```js
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, [count]);
```

- 虚拟 DOM 全量 Diff，依赖手动优化（如 `React.memo`），状态更新触发组件函数整体重新执行
- 副作用管理需要开发者显式控制

---

## 3. 优化

- Vue 使用模板编译生成的 VNode，通过 patchFlag 和静态提升优化 DOM diff 性能：

    - 编译时优化：静态节点只生成一次；

    - PatchFlag 提高渲染效率；
    - 更新更具针对性，Diff 更细粒度；

- React 16 引入 Fiber 架构，实现了异步可中断渲染：

    - 可中断更新任务，避免卡顿；

    - 支持优先级调度（React Scheduler）；
    - 适配 Concurrent Mode，支持时间切片；


---

## 4. 生态系统与社区对比

| 项目类型 | Vue                  | React                             |
| -------- | -------------------- | --------------------------------- |
| 路由管理 | vue-router（官方）   | react-router（社区）              |
| 状态管理 | Vuex / Pinia（官方） | Redux / Recoil / Zustand（社区）  |
| 构建工具 | Vite / Vue CLI       | Create React App / Vite / Next.js |
| SSR 支持 | Nuxt.js              | Next.js                           |

React 在全球范围内生态更庞大，尤其在服务器端渲染、构建系统上领先一步。而 Vue 在国内拥有强大的社区支持，官方生态整合度高，上手快、迭代快。

---

## 5. 性能与优化对比

| 场景             | 优势者 | 原因                       |
| ---------------- | ------ | -------------------------- |
| 首屏渲染速度     | Vue    | 模板静态提升优化明显       |
| 局部状态更新     | Vue    | Proxy + 属性级依赖追踪     |
| 并发任务处理     | React  | Fiber 架构更适合任务调度   |
| 大型应用可维护性 | React  | 函数式架构更利于分层与解耦 |

---

## 6. 选型建议

### 选择 Vue：

- 需要快速上线、团队偏向传统开发方式
- 更重视开发效率而非极致性能

### 选择 React：

- 项目规模较大、技术架构需高度定制
- 团队具备 TS、函数式编程经验
- 需要支持并发渲染、渐进式加载、高性能动画等复杂场景


