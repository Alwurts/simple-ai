import { ToolLoopAgent, tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get the weather in a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  execute: async ({ location }) => ({
    location,
    temperatureF: 72,
    conditions: "clear",
  }),
});

export const weatherAgent = new ToolLoopAgent({
  model: process.env.AI_MODEL ?? "openai/gpt-4.1-mini",
  instructions:
    "You are a weather assistant. Use getWeather to answer weather questions.",
  tools: { getWeather },
});
