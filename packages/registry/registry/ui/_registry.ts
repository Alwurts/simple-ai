import type { RegistryItemDef } from "../../src/types";

export const ui: RegistryItemDef[] = [
  {
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
      files: [{ path: "chat-input.tsx", type: "registry:ui" }],
    },
    preview: "examples/chat-input-demo",
  },
  {
    item: {
      name: "reasoning",
      type: "registry:ui",
      title: "Reasoning",
      description: "Quiet thinking row with markdown.",
      dependencies: ["streamdown"],
      registryDependencies: ["collapsible"],
      files: [{ path: "reasoning.tsx", type: "registry:ui" }],
    },
    preview: "examples/reasoning-demo",
  },
  {
    item: {
      name: "shell",
      type: "registry:ui",
      title: "Shell",
      description: "Sidebar, header, and main content.",
      registryDependencies: ["button", "sidebar"],
      meta: { fullBleed: true, iframeHeight: 720 },
      files: [{ path: "shell.tsx", type: "registry:ui" }],
    },
    preview: "examples/shell-demo",
  },
  {
    item: {
      name: "tool",
      type: "registry:ui",
      title: "Tool",
      description: "Quiet collapsible tool call with input and output.",
      dependencies: ["ai"],
      registryDependencies: ["collapsible"],
      files: [{ path: "tool.tsx", type: "registry:ui" }],
    },
    preview: "examples/tool-demo",
  },
  {
    item: {
      name: "worked",
      type: "registry:ui",
      title: "Worked",
      description: "Fold the agent's work. Keep the answer.",
      registryDependencies: ["collapsible"],
      files: [{ path: "worked.tsx", type: "registry:ui" }],
    },
    preview: "examples/worked-demo",
  },
];
