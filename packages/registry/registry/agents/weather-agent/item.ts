import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "weather-agent",
    type: "registry:lib",
    title: "Weather agent",
    description: "ToolLoopAgent that looks up weather.",
    categories: ["agent"],
    dependencies: ["ai", "zod"],
    envVars: {
      AI_GATEWAY_API_KEY: "",
      AI_MODEL: "openai/gpt-4.1-mini",
    },
    docs: `Adds a ToolLoopAgent and aliases it as assistant.

Also add a chat API, then switch the transport:

  npx shadcn@latest add @simple-ai/chat-api-next

Or @simple-ai/chat-api-hono. On TanStack Start, add @simple-ai/agent-handle and call handleAgent from a server route.

In src/features/assistant/lib/chat-transport.ts:

  import { DefaultChatTransport } from "ai";
  export const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
  export const initialChatMessages = undefined;

Set AI_GATEWAY_API_KEY and optionally AI_MODEL.`,
    meta: { iframeHeight: 280 },
    files: [
      {
        path: "agent.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/agent.ts",
      },
      {
        path: "agents/weather-agent.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/agents/weather-agent.ts",
      },
    ],
  },
  preview: "preview",
};

export default def;
