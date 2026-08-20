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
  "../../packages/registry/registry/components/chat-input/chat-input.tsx"
);
const shell = resolve(
  root,
  "../../packages/registry/registry/components/shell/shell.tsx"
);
const reasoning = resolve(
  root,
  "../../packages/registry/registry/components/reasoning/reasoning.tsx"
);
const tool = resolve(
  root,
  "../../packages/registry/registry/components/tool/tool.tsx"
);
const chatVoiceButton = resolve(
  root,
  "../../packages/registry/registry/components/chat-voice-button/chat-voice-button.tsx"
);
const utils = resolve(root, "../../packages/ui/src/lib/utils.ts");

const config = defineConfig(async () => ({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@/components/ui/chat-input", replacement: chatInput },
      { find: "@/components/ui/shell", replacement: shell },
      { find: "@/components/ui/reasoning", replacement: reasoning },
      { find: "@/components/ui/tool", replacement: tool },
      {
        find: "@/components/ui/chat-voice-button",
        replacement: chatVoiceButton,
      },
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
            build.onResolve({ filter: /^(mdx\/types|\*\.mdx)$/ }, () => ({
              path: "mdx-types-stub",
              namespace: "mdx-stub",
            }));
            build.onLoad({ filter: /.*/, namespace: "mdx-stub" }, () => ({
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
