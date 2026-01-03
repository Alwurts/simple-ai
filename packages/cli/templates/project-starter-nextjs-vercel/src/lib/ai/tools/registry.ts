import type { InferUITools } from "ai";
import { weatherTool } from "./get-weather";

export const aiTools = {
	"get-weather": weatherTool,
};

export type AITools = InferUITools<typeof aiTools>;
export type aiToolId = keyof typeof aiTools;
