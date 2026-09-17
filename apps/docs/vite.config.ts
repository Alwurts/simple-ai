import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const root = dirname(fileURLToPath(import.meta.url));
const uiShadcn = resolve(root, "../../packages/ui/src/components/shadcn");
const chatInput = resolve(
  root,
  "../../packages/registry/registry/ui/chat-input.tsx"
);
const shell = resolve(root, "../../packages/registry/registry/ui/shell.tsx");
const reasoning = resolve(
  root,
  "../../packages/registry/registry/ui/reasoning.tsx"
);
const tool = resolve(root, "../../packages/registry/registry/ui/tool.tsx");
const worked = resolve(root, "../../packages/registry/registry/ui/worked.tsx");
const worldCard = resolve(
  root,
  "../../packages/registry/registry/ui/world-card.tsx"
);
const vrButton = resolve(
  root,
  "../../packages/registry/registry/ui/vr-button.tsx"
);
const vrChatInput = resolve(
  root,
  "../../packages/registry/registry/ui/vr-chat-input.tsx"
);
const vrMessageScroller = resolve(
  root,
  "../../packages/registry/registry/ui/vr-message-scroller.tsx"
);
const vrTool = resolve(root, "../../packages/registry/registry/ui/vr-tool.tsx");
const vrWorked = resolve(
  root,
  "../../packages/registry/registry/ui/vr-worked.tsx"
);
const vrReasoning = resolve(
  root,
  "../../packages/registry/registry/ui/vr-reasoning.tsx"
);
const vrMarkdown = resolve(
  root,
  "../../packages/registry/registry/ui/vr-markdown.tsx"
);
const utils = resolve(root, "../../packages/ui/src/lib/utils.ts");
const MDX_TYPES = /^(mdx\/types|\*\.mdx)$/;
const ANY_MODULE = /.*/;

const config = defineConfig(async () => ({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@/components/ui/chat-input", replacement: chatInput },
      { find: "@/components/ui/shell", replacement: shell },
      { find: "@/components/ui/reasoning", replacement: reasoning },
      { find: "@/components/ui/tool", replacement: tool },
      { find: "@/components/ui/worked", replacement: worked },
      { find: "@/components/ui/world-card", replacement: worldCard },
      { find: "@/components/ui/vr-button", replacement: vrButton },
      { find: "@/components/ui/vr-chat-input", replacement: vrChatInput },
      {
        find: "@/components/ui/vr-message-scroller",
        replacement: vrMessageScroller,
      },
      { find: "@/components/ui/vr-tool", replacement: vrTool },
      { find: "@/components/ui/vr-worked", replacement: vrWorked },
      { find: "@/components/ui/vr-reasoning", replacement: vrReasoning },
      { find: "@/components/ui/vr-markdown", replacement: vrMarkdown },
      { find: "@/components/ui", replacement: uiShadcn },
      { find: "@/lib/utils", replacement: utils },
    ],
  },
  optimizeDeps: {
    exclude: ["@types/mdx"],
    esbuildOptions: {
      plugins: [
        {
          name: "ignore-mdx-types",
          setup(build) {
            build.onResolve({ filter: MDX_TYPES }, () => ({
              path: "mdx-types-stub",
              namespace: "mdx-stub",
            }));
            build.onLoad({ filter: ANY_MODULE, namespace: "mdx-stub" }, () => ({
              contents: "export {}",
              loader: "js",
            }));
          },
        },
      ],
    },
  },
  plugins: [
    mdx(await import("./source.config")),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}));

export default config;
