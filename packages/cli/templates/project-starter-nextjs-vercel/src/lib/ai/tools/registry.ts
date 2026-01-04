import type { InferUITools } from "ai";
import { loadSkillTool } from "./(registry)/load-skill";
import { createProductTools } from "./(registry)/products";
import { createWarehouseTools } from "./(registry)/warehouses";

export const getAiTools = (userId: string) => {
	return {
		"load-skill": loadSkillTool,
		...createProductTools(userId),
		...createWarehouseTools(userId),
	};
};

export type AITools = InferUITools<ReturnType<typeof getAiTools>>;
export type aiToolId = keyof ReturnType<typeof getAiTools>;
