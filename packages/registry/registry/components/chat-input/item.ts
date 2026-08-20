import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-input",
    type: "registry:ui",
    title: "Chat Input",
    description:
      "A TipTap chat input with typed mentions, streaming status, and an imperative handle.",
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
    files: [{ path: "chat-input.tsx", type: "registry:ui" }],
  },
  preview: "preview",
};

export default def;
