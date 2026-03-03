// @ts-nocheck
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import remarkGfm from "remark-gfm";
import { SITE_URL } from "./src/consts";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap(), tailwind(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "rose-pine-moon",
      },
    },
    remarkPlugins: [
      remarkGfm,
      () => {
        return (tree) => {
          let imageCount = 0;
          // 递归处理所有节点
          const addLoadingAttribute = (node) => {
            if (node.type === "image") {
              // 第一张图片使用 eager，其他使用 lazy
              node.data = node.data || {};
              node.data.hProperties = node.data.hProperties || {};
              node.data.hProperties.loading =
                imageCount === 0 ? "eager" : "lazy";
              node.data.hProperties.decoding = "async";
              imageCount++;
            }
            if (node.children && Array.isArray(node.children)) {
              node.children.forEach((child) => addLoadingAttribute(child));
            }
          };
          addLoadingAttribute(tree);
        };
      },
    ],
  },
  server: {
    host: true,
  },
});
