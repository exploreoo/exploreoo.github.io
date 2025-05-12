---
icon: pen-to-square
date: 2023-03-10
category:
  - 前端
tag:
  - bug
---

# bug合集

- `Angular`**Error: Zone.js has detected that ZoneAwarePromise (window|global).Promise has been overwritten. Most likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)**

  原因：Zone.js检测到ZoneAwarePromise（window | global）.Promise已被覆盖。 最可能的原因是在Zone.js之后加载了Promise polyfill（加载zone.js时不需要填充Promise api。如果必须加载，则在加载zone.js之前执行。）

  解决：

  1. 改的方向就是在zone.js之前加载它，把polyfill.ts里import 'zone.js/dist/zone'的这一行提到main.ts里

2. 在polyfill.ts里import 'zone.js/dist/zone'这一行前面，引入import 'core-js/es/promise'

