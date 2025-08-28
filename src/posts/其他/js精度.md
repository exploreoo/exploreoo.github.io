---
icon: file-contract
date: 2024-12-17
category:
  - 前端
tag:
  - js
  - 浮点运算
---

# JavaScript 浮点数精度问题

## 一、问题背景

在 JavaScript 中，所有数字（除了 `BigInt`）都采用 **IEEE 754 双精度浮点数**格式存储。  
这会导致许多开发者熟悉的“经典 Bug”：

```js
0.1 + 0.2 === 0.3 // false
0.1 + 0.2         // 0.30000000000000004
```

根本原因在于 **十进制小数不一定能被二进制浮点数精确表示**。  
例如 `0.1` 在二进制里是无限循环小数，计算机只能存储近似值。

---

## 二、常见问题表现

1. **简单加减法出错**
```js
0.1 + 0.7 // 0.7999999999999999
```

2. **乘法、除法存在偏差**
```js
19.9 * 100 // 1989.9999999999998
```

3. **比较结果意外**
```js
0.3 / 0.1 === 3 // false
```

---

## 三、解决思路与方法

### 1. 使用 toFixed 或 toPrecision（适合 UI 显示）
```js
let n = 0.1 + 0.2;
n.toFixed(2); // "0.30"
```

- ✅ 优点：简单快速，适合展示。  
- ⚠️ 缺点：返回字符串，不适合继续参与计算。  

---

### 2. 容忍误差近似比较
利用 `Number.EPSILON` 作为“容差”：

```js
function nearlyEqual(a, b, tolerance = Number.EPSILON) {
  return Math.abs(a - b) < tolerance;
}

nearlyEqual(0.1 + 0.2, 0.3); // true
```

---

### 3. 整数化运算（放大后再缩小）
特别适合金额、权重等业务：

```js
function add(a, b) {
  let m = 10 ** Math.max(
    (a.toString().split('.')[1] || '').length,
    (b.toString().split('.')[1] || '').length
  );
  return (a * m + b * m) / m;
}

add(0.1, 0.2); // 0.3 ✅
```

---

### 4. 高精度库（推荐方案）

适用于金融、科学计算等高要求场景：

```js
import Decimal from "decimal.js";

new Decimal(0.1).plus(0.2).toNumber(); // 0.3
```

常用库：
- [decimal.js](https://github.com/MikeMcl/decimal.js)
- [big.js](https://github.com/MikeMcl/big.js)
- [math.js](https://mathjs.org/)

---

### 5. 使用 BigInt（仅适用于大整数）
```js
let big = 9007199254740991n; // 超过 Number.MAX_SAFE_INTEGER
big + 2n; // 9007199254740993n
```

- ✅ 适合存储和运算超大整数；  
- ⚠️ 不支持小数。  

---

## 四、最佳实践清单

- **UI 显示** → `toFixed()`  
- **浮点数比较** → `Math.abs(a - b) < Number.EPSILON`  
- **金额/权重** → 转换为整数存储（分/毫克等）  
- **精确计算** → 使用 `decimal.js`  
- **大整数** → 使用 `BigInt`  

---

## 五、总结

JavaScript 的精度问题并不是“语言 Bug”，而是 **IEEE 754 双精度浮点数**的必然结果。  
开发者要做的，是根据 **不同场景选择合适的解决方案**：

- 只展示 → `toFixed()`  
- 判断相等 → `EPSILON` 容差  
- 金额计算 → 整数存储  
- 严格精度 → `decimal.js`  
- 大整数 → `BigInt`  

---

📌 **一句话总结**：  
> JavaScript 精度问题无法彻底避免，但可以通过 **合适的工具和实践** 将问题控制在可接受范围内。
