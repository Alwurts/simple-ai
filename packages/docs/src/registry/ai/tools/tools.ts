import type { InferUITools, ToolSet } from "ai";
import { firecrawlTool } from "@/registry/ai/tools/firecrawl";
import { getWeatherTool } from "@/registry/ai/tools/get-weather";

export const tools = {
	"get-weather": getWeatherTool,
	firecrawl: firecrawlTool,
	// Add more tools here
} satisfies ToolSet;

export type Tools = InferUITools<typeof tools>;

export type toolId = keyof typeof tools;
