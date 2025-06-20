import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/en/",
  "/en/demo/",
  {
    text: "Posts",
    icon: "pen-to-square",
    prefix: "/en/posts/",
    children: [
      {
        text: "Apple",
        icon: "pen-to-square",
        prefix: "/en/posts/apple/",
        children: [
          { text: "Apple1", icon: "pen-to-square", link: "1" },
          { text: "Apple2", icon: "pen-to-square", link: "2" },
          "3",
          "4",
        ],
      },
      {
        text: "Banana",
        icon: "pen-to-square",
        prefix: "/en/posts/banana/",
        children: [
          {
            text: "Banana 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "Banana 2",
            icon: "pen-to-square",
            link: "2",
          },
          "3",
          "4",
        ],
      },
      { text: "Cherry", icon: "pen-to-square", link: "/en/posts/cherry" },
      { text: "Dragon Fruit", icon: "pen-to-square", link: "/en/posts/dragonfruit" },
      "/en/posts/tomato",
      "/en/posts/strawberry",
    ],
  },
  // {
  //   text: "V2 Docs",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/",
  // },
]);
