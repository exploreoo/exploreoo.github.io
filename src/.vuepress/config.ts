import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { commentPlugin } from "@vuepress/plugin-comment";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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
      appId: process.env.VUE_APP_ALGOLIA_APP_ID,
      apiKey: process.env.VUE_APP_ALGOLIA_API_KEY,
      indexName: process.env.VUE_APP_ALGOLIA_INDEX_NAME,
    }),
    commentPlugin({
      provider: "Giscus",
      repo: "exploreoo/exploreoo.github.io",
      repoId: "R_kgDOO2SJWw",
      category: "General",
      categoryId: "DIC_kwDOO2SJW84CrEBx",
    }),
  ],
});
