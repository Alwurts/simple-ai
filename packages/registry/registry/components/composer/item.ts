import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "composer",
    type: "registry:ui",
    title: "Composer",
    description: "TipTap composer with mentions and streaming status.",
    dependencies: [
      "@tiptap/core",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-mention",
      "@tiptap/extension-placeholder",
      "@tiptap/suggestion",
      "ai",
    ],
    registryDependencies: ["input-group"],
    files: [{ path: "composer.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
