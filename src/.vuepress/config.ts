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
    docsearchPlugin({
      appId: 'IHBMSXPS86',
      apiKey: 'ef8c6a7d640d8995506193777f336d70',
      indexName: 'exploreooio',
    }),
    commentPlugin({
      provider: 'Giscus',
      repo: 'exploreoo/exploreoo.github.io',
      repoId: 'R_kgDOO2SJWw',
      category: 'General',
      categoryId: 'DIC_kwDOO2SJW84CrEBx',
    }),
  ],
});
