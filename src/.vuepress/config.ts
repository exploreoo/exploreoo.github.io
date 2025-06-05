import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { commentPlugin } from '@vuepress/plugin-comment'

export default defineUserConfig({
  base: "/",

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

  plugins: [
    // docsearchPlugin({
    //   appId: '你的appId',
    //   apiKey: '你的apiKey',
    //   indexName: '你的indexName',
    // }),
    commentPlugin({
      provider: 'Giscus',
      repo: 'exploreoo/exploreoo.github.io',
      repoId: 'R_kgDOO2SJWw',
      category: 'General',
      categoryId: 'DIC_kwDOO2SJW84CrEBx',
    }),
  ],
});
