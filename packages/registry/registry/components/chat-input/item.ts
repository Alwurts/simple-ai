import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-input",
    type: "registry:ui",
    title: "Chat input",
    description: "Chat input with mentions and streaming status.",
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
