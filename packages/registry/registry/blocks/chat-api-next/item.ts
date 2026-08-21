import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-api-next",
    type: "registry:block",
    title: "Chat API (Next.js)",
    description:
      "App Router POST /api/chat. Add with @simple-ai/chat-page, then switch the chat transport.",
    registryDependencies: ["@simple-ai/chat-handler"],
    files: [
      {
        path: "route.ts",
        type: "registry:file",
        target: "src/app/api/chat/route.ts",
      },
    ],
  },
  preview: "preview",
};

export default def;
