---
icon: file-contract
date: 2025-02-20
category:
  - 前端
tag:
  - React
---

# useLayoutEffect Vs useEffect

`useLayoutEffect` 和 `useEffect` 都是 React 提供的 Hook，用于处理副作用，但它们在执行时机上有重要区别。

## 主要区别

| 特性             | `useEffect`                  | `useLayoutEffect`              |
| ---------------- | ---------------------------- | ------------------------------ |
| **执行时机**     | 在浏览器绘制**之后**异步执行 | 在浏览器绘制**之前**同步执行   |
| **对用户的影响** | 可能导致布局闪烁             | 阻止浏览器绘制直到 effect 完成 |
| **使用场景**     | 数据获取、订阅等             | 需要同步读取/操作 DOM 的情况   |
| **性能影响**     | 对渲染性能影响较小           | 可能阻塞渲染，导致性能问题     |

<!-- more -->

## 详细解释

### 1. 执行时机

- **`useEffect`**:

  - 在组件渲染到屏幕**之后**执行
  - 异步执行，不会阻塞浏览器绘制

- **`useLayoutEffect`**:
  - 在 React 计算完 DOM 变更后，但在浏览器实际绘制**之前**执行
  - 同步执行，会阻塞浏览器绘制

### 2. 使用场景示例

**适合 `useLayoutEffect` 的情况**：

```jsx
function Tooltip() {
  const ref = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // 在浏览器绘制前测量元素位置
    const { top, left } = ref.current.getBoundingClientRect();
    setPosition({ top, left });
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", ...position }}>
      Tooltip
    </div>
  );
}
```

**适合 `useEffect` 的情况**：

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 异步获取数据
    fetchUser(userId).then((data) => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

### 3. 为什么选择其中一个而不是另一个

- **使用 `useLayoutEffect` 当**：

  - 你需要读取 DOM 布局并同步触发重渲染
  - 你需要执行 DOM 操作以避免视觉闪烁或不一致

- **使用 `useEffect` 当**：
  - 你的副作用不需要与 DOM 交互
  - 你的代码可以容忍短暂的布局不一致
  - 你需要执行数据获取或订阅等异步操作

## 重要注意事项

1. **服务端渲染 (SSR)**：

   - `useLayoutEffect` 在 SSR 期间会导致警告（因为它不能在服务端执行）
   - 在 SSR 应用中，React 建议先用 `useEffect`，如果发现问题再考虑 `useLayoutEffect`

2. **性能影响**：

   - 过度使用 `useLayoutEffect` 可能导致性能问题，因为它会阻塞渲染
   - 大多数情况下 `useEffect` 是更好的默认选择

3. **执行顺序**：
   - 在同一个组件中，`useLayoutEffect` 总是比 `useEffect` 先执行

## 经验法则

1. **默认使用 `useEffect`** - 这是最安全的选择
2. **只有在需要同步测量或操作 DOM 时才使用 `useLayoutEffect`**
3. **如果你不确定，先尝试 `useEffect`，只有出现视觉问题时再考虑 `useLayoutEffect`**
