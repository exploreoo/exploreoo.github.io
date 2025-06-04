import { defineUserConfig } from "vuepress";

import { docsearchPlugin } from '@vuepress/plugin-docsearch'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  // 这是因为 浏览器默认会请求根目录的 favicon.ico，而你的网站部署在子路径 /blog/，所以需要 强制让浏览器从 /blog/favicon.ico 加载图标。
  head: [
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }], // 关键点：添加 /blog/ 前缀
  ],

  locales: {
    "/": {
      lang: "en-US",
      title: "WS's Blog",
      description: "",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "WS的博客",
      description: "",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,

  // plugins: [
  //   docsearchPlugin({
  //     appId: '你的appId',
  //     apiKey: '你的apiKey',
  //     indexName: '你的indexName',
  //   }),
  // ],
});
