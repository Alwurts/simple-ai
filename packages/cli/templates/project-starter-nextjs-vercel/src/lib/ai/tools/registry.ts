import type { InferUITools } from "ai";
import { createInventoryTools } from "./(registry)/inventory";
import { loadSkillTool } from "./(registry)/load-skill";

export const getAiTools = (userId: string) => {
	return {
		"load-skill": loadSkillTool,
		...createInventoryTools(userId),
	};
};

export type AITools = InferUITools<ReturnType<typeof getAiTools>>;
export type aiToolId = keyof ReturnType<typeof getAiTools>;
