import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "agent-handle",
    type: "registry:block",
    title: "Agent handle",
    description:
      "Request/Response entry for the assistant agent. Use with chat-api-next or chat-api-hono.",
    dependencies: ["ai"],
    registryDependencies: ["@simple-ai/weather-agent"],
    envVars: {
      AI_GATEWAY_API_KEY: "",
      AI_MODEL: "openai/gpt-4.1-mini",
    },
    docs: `Calls handleAgent(request) with the aliased assistant.

Next.js: also add @simple-ai/chat-api-next.
Hono: also add @simple-ai/chat-api-hono.
TanStack Start: add a server route that calls handleAgent.

Then switch src/features/assistant/lib/chat-transport.ts to DefaultChatTransport({ api: "/api/chat" }).
Set AI_GATEWAY_API_KEY and optionally AI_MODEL.`,
    files: [
      {
        path: "handle-agent.ts",
        type: "registry:lib",
        target: "src/features/assistant/lib/handle-agent.ts",
      },
    ],
  },
  preview: "preview",
};

export default def;
