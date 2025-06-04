import { defineUserConfig } from "vuepress";

import { docsearchPlugin } from '@vuepress/plugin-docsearch'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  dest: "./dist",

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
