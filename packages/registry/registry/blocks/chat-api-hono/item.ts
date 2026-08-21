import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-api-hono",
    type: "registry:block",
    title: "Chat API (Hono)",
    description:
      "Hono POST /api/chat. Add with @simple-ai/chat-page, then switch the chat transport.",
    dependencies: ["hono"],
    registryDependencies: ["@simple-ai/chat-handler"],
    files: [
      {
        path: "chat-hono.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/chat-hono.ts",
      },
    ],
  },
  preview: "preview",
};

export default def;
