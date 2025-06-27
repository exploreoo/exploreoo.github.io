---
icon: pen-to-square
date: 2024-05-17
category:
  - 前端
tag:
  - VUe
---

# vue2、Vue3对比

## 1. 性能提升

- #### 模板编译器优化

    - **Vue 2**：模板编译结果中包含了**较多的运行时代码**，运行时成本较高

    - **Vue 3**：通过静态提升（Static Hoisting）和静态节点标记（Patch Flag）优化了虚拟 DOM 的 patch 过程，减少了运行时的开销

- ### diff算法优化

    - **Vue 2**：在比较新旧虚拟DOM树时，采用的是**深度优先遍历**，逐层比较节点，这种方式在**处理大量节点时可能会有性能问题**

    - **Vue 3**：编译时标记静态节点，减少运行时开销
      - **静态提升**：将静态节点提升到编译阶段，避免在每次渲染时重新创建这些节点
      - **缓存优化**：缓存一些计算结果，避免重复计算
      - **块级优化**：将模板分成多个块，每个块只包含动态内容，静态内容会被提升到块外部。这使得块内的比较更加高效

- ### Tree-shaking 支持

    - **Vue 2**：整体打包，无法按需引入

    - **Vue 3**：基于 ES Module 架构，支持 Tree-shaking，减小打包体积

<!-- more -->

---

## 2. API风格

- ### Options API

    Vue 2 使用的是经典的 Options API，将代码按照 `data`、`methods`、`computed` 等配置项分块编写。

    ```js
    export default {
      data() {
        return { count: 0 };
      },
      methods: {
        increment() {
          this.count++;
        },
      },
    };
    ```

- ### Composition API

    Vue 3 引入了 Composition API，可以用函数组织逻辑，更加灵活、可组合性强，使用 `setup` 入口函数。

    ```js
    import { ref } from "vue";
    
    export default {
      setup() {
        const count = ref(0);
        const increment = () => count.value++;
        return { count, increment };
      },
    };
    ```

---

## 3. 响应式

- Vue 2

    - 使用 `Object.defineProperty` 实现响应式。

    - 如果有一个很深的对象，需要深层次递归生成响应式，存在性能问题。
    - 无法监听对象属性的新增/删除，无法检测到数组的直接变动，例如通过索引直接修改数组元素。通过vue.$set解决

- Vue 3

    - 使用基于 `Proxy` 的响应式系统，整体深度代理，劫持13种对象操作，结合 `reflect` 实现。

    - 使用 `ref` 和 `reactive` 来定义响应式对象，`ref` 对于引用类型会自动转为 `reactive` 方法，基本数据类型则是使用使用 `Object.defineProperty` 

---

## 4. **新特性**

- ### Fragment

    - Vue 2：组件必须有一个根节点。

    - Vue 3：支持多个根节点，无需额外包裹标签。

- ### Teleport

    用于将子组件的 DOM 渲染到父组件 DOM 层级以外的位置（例如模态框）。

    ```html
    <teleport to="body">
      <div class="modal">...</div>
    </teleport>
    ```

- ### Suspense

    异步组件加载时的占位和错误处理。

---

## 5. TypeScript支持

- **Vue 2**：对 TypeScript 支持不完整
- **Vue 3**：源码用 TypeScript 重写，提供更好的类型推断

---

## 6. 生命周期钩子变化

Vue 3 中新增了一套用于 Composition API 的生命周期钩子名称，虽然与 Options API 保持一致功能，但使用上有细微差别：

| Vue 2         | Vue 3 (Composition API) |
| ------------- | ----------------------- |
| beforeCreate  | **使用 setup()**        |
| created       | **使用 setup()**        |
| beforeMount   | onBeforeMount           |
| mounted       | onMounted               |
| beforeUpdate  | onBeforeUpdate          |
| updated       | onUpdated               |
| beforeDestroy | onBeforeUnmount         |
| destroyed     | onUnmounted             |

---

## 7. 其他改动

**v-model 升级**

- Vue 2：一个组件仅支持一个 `v-model`。
- Vue 3：支持多个 `v-model`（如 `v-model:title`、`v-model:content`）。



## 废弃与升级

Vue 3 中移除了以下一些不推荐使用的 API：

### `Vue.config.keyCodes`

- Vue 2：允许自定义按键修饰符别名。

  ```
  Vue.config.keyCodes = {
    v: 86
  };
  ```

- Vue 3：推荐使用原生的 `KeyboardEvent.key` 属性来处理按键事件。

### `Vue.config.ignoredElements`

- Vue 2：允许指定 Vue 应该忽略的自定义元素。

  ```
  Vue.config.ignoredElements = ['my-custom-element'];
  ```

- Vue 3：推荐使用`isCustomElement`选项来配置。

  ```
  const app = createApp(App, {
    isCustomElement: tag => tag.startsWith('my-')
  });
  ```

### `Vue.set` 和 `Vue.delete`

- Vue 2：用于在对象上添加或删除属性，使其响应式。

  ```
  Vue.set(obj, 'newProp', 'newValue');
  Vue.delete(obj, 'prop');
  ```

- Vue 3：使用`proxy`实现响应式系统，能够直接监听对象属性的新增和删除。

  ```
  const obj = reactive({});
  obj.newProp = 'newValue'; // 自动响应式
  delete obj.prop; // 自动响应式
  ```

### `Vue.observable`

- Vue 2：用于创建一个响应式对象。

  ```
  const state = Vue.observable({ count: 0 });
  ```

- Vue 3：推荐使用`reactive`代替。

  ```
  const state = reactive({ count: 0 });
  ```

### `filters`

- Vue 2：允许在模板中使用过滤器来格式化输出。

  ```
  <div>{{ message | capitalize }}</div>
  ```

- Vue 3：推荐使用方法或计算属性来代替。

  ```
  setup() {
      const capitalize = (str) => str.toUpperCase();
      return { capitalize };
  }
  ```

### `inline-template`

- Vue 2：允许在组件上内联模板。

  ```
  <my-component inline-template>
  ```

- Vue 3：推荐使用单文件组件（SFC）或其他模板定义方式。

### `functional` 组件选项

- Vue 2：允许定义无状态、无实例的函数式组件。

  ```
  Vue.component('my-component', {
      functional: true,
      render(h, context) {
        return h('div', context.props.message);
      }
    });
  ```

- Vue 3：推荐使用简化的函数式组件定义。

  ```
  const MyComponent = (props) => {
      return h('div', props.message);
  };
  ```

### `scopeId`

- Vue 2：用于在组件中设置作用域 ID。

  ```
  Vue.component('my-component', {
    template: '<div>Scoped</div>',
    _scopeId: 'data-v-123'
  });
  ```

- Vue 3：推荐使用单文件组件（SFC）中的 `scoped` 样式。

### `v-on.native`

- Vue 2：用于在组件上监听原生 DOM 事件。

  ```
  <my-component v-on:click.native="handleClick"></my-component>
  ```

- Vue 3：移除了该修饰符，推荐在组件内部使用`emits`选项来定义事件。

  ```
  <my-component @click="handleClick"></my-component>
  ```

### `$on`, `$off`, `$once`

- Vue 2：用于在组件实例上或者`EventBus`监听和移除事件。

  ```
  this.$on('event', this.handler);
  this.$off('event', this.handler);
  this.$once('event', this.handler);
  ```

- Vue 3：移除了这些方法，推荐使用组合式 API或 `mitt`选项来处理事件。

---

## 生态兼容与迁移

- Vue 3 发布后，官方也推出了 [Vue 2.7 "Naruto"](https://github.com/vuejs/core/releases/tag/v2.7.0)，引入部分 Vue 3 的语法特性（如 Composition API）以便平滑迁移。
- 提供了 [官方迁移工具](https://v3-migration.vuejs.org/) 帮助开发者从 Vue 2 平滑升级。
