import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-handler",
    type: "registry:block",
    title: "Chat handler",
    description:
      "Shared Request/Response chat handler. Use with chat-api-next or chat-api-hono.",
    dependencies: ["ai"],
    files: [
      {
        path: "chat-handler.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/chat-handler.ts",
      },
    ],
  },
  preview: "preview",
};

export default def;
