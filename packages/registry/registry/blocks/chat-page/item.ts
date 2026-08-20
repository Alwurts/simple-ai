import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-page",
    type: "registry:block",
    title: "Chat page",
    description:
      "Full-screen assistant chat inside the app shell — transcript, tools, files, mentions, and the simple-ai input.",
    registryDependencies: [
      "bubble",
      "button",
      "chat-token",
      "collapsible",
      "dropdown-menu",
      "empty",
      "input-group",
      "message",
      "message-scroller",
      "resizable",
      "sidebar",
      "@simple-ai/chat-input",
      "@simple-ai/chat-voice-button",
      "@simple-ai/reasoning",
      "@simple-ai/shell",
      "@simple-ai/tool",
    ],
    dependencies: ["@ai-sdk/react", "@shadcn/helpers", "ai", "streamdown"],
    meta: { iframeHeight: 900 },
    files: [
      {
        path: "page.tsx",
        type: "registry:page",
        target: "src/routes/assistant.tsx",
      },
      {
        path: "lib/mock-chat-messages.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/mock-chat-messages.ts",
      },
      {
        path: "components/app-sidebar.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/app-sidebar.tsx",
      },
      {
        path: "components/full-screen-chat.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/full-screen-chat.tsx",
      },
      {
        path: "components/chat-input.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/chat-input.tsx",
      },
      {
        path: "components/chat-message-parts.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/chat-message-parts.tsx",
      },
      {
        path: "components/chat-side-panel.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/chat-side-panel.tsx",
      },
      {
        path: "components/file-explorer-tree.tsx",
        type: "registry:component",
        target: "src/features/assistant/components/file-explorer-tree.tsx",
      },
      {
        path: "hooks/use-chat-side-panel.ts",
        type: "registry:hook",
        target: "src/features/assistant/hooks/use-chat-side-panel.ts",
      },
      {
        path: "lib/mock-workspace-tree.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/mock-workspace-tree.ts",
      },
      {
        path: "lib/mock-members.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/mock-members.ts",
      },
      {
        path: "lib/ai-types.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/ai-types.ts",
      },
    ],
  },
  preview: "page",
};

export default def;
