import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "intro",
    {
      text: "随笔",
      icon: "signature",
      prefix: "posts/",
      children: [
        {
          text: "框架",
          icon: "folder-minus",
          prefix: "框架/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "合集",
          icon: "folder-minus",
          prefix: "合集/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "网络",
          icon: "folder-minus",
          prefix: "网络/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "性能优化",
          icon: "folder-minus",
          prefix: "性能优化/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "Demo",
          icon: "folder-minus",
          prefix: "Demo/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "其他",
          icon: "folder-minus",
          prefix: "其他/",
          collapsible: true,
          expanded: true,
          children: "structure",
        },
      ],
    },
  ],
});
