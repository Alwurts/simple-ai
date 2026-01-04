import type { InferUITools } from "ai";
import { loadSkillTool } from "./load-skill-tool";

export const aiTools = {
	"load-skill": loadSkillTool,
};

export type AITools = InferUITools<typeof aiTools>;
export type aiToolId = keyof typeof aiTools;
