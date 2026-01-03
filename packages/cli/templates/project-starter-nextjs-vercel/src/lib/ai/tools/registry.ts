import type { InferUITools, UIMessageStreamWriter } from "ai";
import { getWeatherTool } from "./get-weather";

export const getAiTools = ({ uiStreamWriter }: { uiStreamWriter: UIMessageStreamWriter }) => {
	return {
		"get-weather": getWeatherTool(uiStreamWriter),
	};
};

export type AITools = InferUITools<ReturnType<typeof getAiTools>>;
export type aiToolId = keyof ReturnType<typeof getAiTools>;
