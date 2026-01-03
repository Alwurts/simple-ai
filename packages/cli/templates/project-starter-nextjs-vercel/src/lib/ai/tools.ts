import type { UIMessageStreamWriter } from "ai";
import { getWeatherTool } from "./tools/get-weather";

export const getAgentTools = ({ uiStreamWriter }: { uiStreamWriter: UIMessageStreamWriter }) => {
	return {
		"get-weather": getWeatherTool(uiStreamWriter),
	};
};

export type AgentToolSet = ReturnType<typeof getAgentTools>;
