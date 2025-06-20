import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: [
        {
          text: "Vue",
          icon: "book",
          prefix: "Vue/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "React",
          icon: "book",
          prefix: "React/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "合集",
          icon: "book",
          prefix: "合集/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "网络请求",
          icon: "book",
          prefix: "网络请求/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "性能优化",
          icon: "book",
          prefix: "性能优化/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "Demo",
          icon: "book",
          prefix: "Demo/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "其他",
          icon: "book",
          prefix: "其他/",
          collapsible: true,
          expanded: true,
          children: "structure",
        },
      ],
    },
    "intro",
  ],
});
