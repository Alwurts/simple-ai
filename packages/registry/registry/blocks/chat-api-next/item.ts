import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-api-next",
    type: "registry:block",
    title: "Chat API (Next.js)",
    description:
      "App Router POST /api/chat. Add with @simple-ai/chat-page and an agent, then switch the chat transport.",
    registryDependencies: ["@simple-ai/agent-handle"],
    envVars: {
      AI_GATEWAY_API_KEY: "",
      AI_MODEL: "openai/gpt-4.1-mini",
    },
    docs: `Writes src/app/api/chat/route.ts. Also pulls the weather agent and handleAgent.

Then in src/features/assistant/lib/chat-transport.ts:

  import { DefaultChatTransport } from "ai";
  export const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  export const initialChatMessages = undefined;

Set AI_GATEWAY_API_KEY and optionally AI_MODEL.`,
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
