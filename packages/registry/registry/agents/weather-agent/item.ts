import type { RegistryItemDef } from "../../../src/types";

const def: RegistryItemDef = {
  item: {
    name: "weather-agent",
    type: "registry:lib",
    title: "Weather agent",
    description: "Answers weather questions for a city.",
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
    meta: {
      summary: "Answers weather questions for a city.",
      instructions:
        "You are a weather assistant. Use getWeather to answer weather questions.",
      model: "openai/gpt-4.1-mini",
      env: ["AI_GATEWAY_API_KEY"],
      tools: [
        {
          name: "getWeather",
          description: "Get the weather in a location",
          inputs: [
            { name: "location", type: "string", description: "City name" },
          ],
          exampleOutput: {
            location: "Tokyo",
            temperatureF: 72,
            conditions: "clear",
          },
        },
      ],
      samplePrompts: [
        "What's the weather in Tokyo?",
        "Do I need a jacket in Chicago today?",
        "Compare London and Lisbon this afternoon.",
      ],
      exampleTurn: {
        user: "What's the weather in Tokyo?",
        tool: {
          name: "getWeather",
          input: { location: "Tokyo" },
          output: {
            location: "Tokyo",
            temperatureF: 72,
            conditions: "clear",
          },
        },
        assistant: "72°F and clear in Tokyo.",
      },
      wire: {
        ui: "@simple-ai/chat-page",
        apis: [
          { stack: "Next.js", item: "@simple-ai/chat-api-next" },
          { stack: "Hono", item: "@simple-ai/chat-api-hono" },
          {
            stack: "TanStack Start",
            item: "@simple-ai/agent-handle",
            note: "Call handleAgent from a server route.",
          },
        ],
      },
    },
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
