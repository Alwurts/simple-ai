//import { createInventoryTools } from "./(registry)/inventory";

import type { InferUITools } from "ai";
import { loadSkillTool } from "./(registry)/load-skill";

export const getAiTools = (_userId: string) => {
	return {
		"load-skill": loadSkillTool,
		//...createInventoryTools(userId),
	};
};

export type AITools = InferUITools<ReturnType<typeof getAiTools>>;
export type aiToolId = keyof ReturnType<typeof getAiTools>;
