import type { InferUITools, ToolSet } from "ai";
import { exaTool } from "@/registry/ai/tools/exa-tool";
import { firecrawlTool } from "@/registry/ai/tools/firecrawl-tool";
import { getWeatherTool } from "@/registry/ai/tools/get-weather";

export const tools = {
	"get-weather": getWeatherTool,
	"exa-tool": exaTool,
	"firecrawl-tool": firecrawlTool,
	// Add more tools here
} satisfies ToolSet;

export type Tools = InferUITools<typeof tools>;

export type toolId = keyof typeof tools;
