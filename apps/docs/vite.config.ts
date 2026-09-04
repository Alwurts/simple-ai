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
const composer = resolve(
  root,
  "../../packages/registry/registry/components/composer/composer.tsx"
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
const worked = resolve(
  root,
  "../../packages/registry/registry/components/worked/worked.tsx"
);
const utils = resolve(root, "../../packages/ui/src/lib/utils.ts");
const MDX_TYPES = /^(mdx\/types|\*\.mdx)$/;
const ANY_MODULE = /.*/;

const config = defineConfig(async () => ({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: "@/components/ui/composer", replacement: composer },
      { find: "@/components/ui/shell", replacement: shell },
      { find: "@/components/ui/reasoning", replacement: reasoning },
      { find: "@/components/ui/tool", replacement: tool },
      { find: "@/components/ui/worked", replacement: worked },
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
