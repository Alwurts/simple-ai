import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "chat-api-hono",
    type: "registry:block",
    title: "Chat API (Hono)",
    description:
      "Hono POST /api/chat. Add with @simple-ai/chat-page and an agent, then switch the chat transport.",
    dependencies: ["hono"],
    registryDependencies: ["@simple-ai/agent-handle"],
    envVars: {
      AI_GATEWAY_API_KEY: "",
      AI_MODEL: "openai/gpt-4.1-mini",
    },
    docs: `Writes a Hono app at src/features/assistant/lib/chat-hono.ts. Also pulls the weather agent and handleAgent.

Mount with app.route("/", chatApp) or chatApp.fetch(request).

Then in src/features/assistant/lib/chat-transport.ts:

  import { DefaultChatTransport } from "ai";
  export const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  export const initialChatMessages = undefined;

Set AI_GATEWAY_API_KEY and optionally AI_MODEL.`,
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
