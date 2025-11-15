import type { InferUITools, ToolSet } from "ai";
import { getWeatherTool } from "@/registry/ai/tools/get-weather";
import { webSearchTool } from "@/registry/ai/tools/web-search";

export const tools = {
	"get-weather": getWeatherTool,
	"web-search": webSearchTool,
	// Add more tools here
} satisfies ToolSet;

export type Tools = InferUITools<typeof tools>;

export type toolId = keyof typeof tools;
