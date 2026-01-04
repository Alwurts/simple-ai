import type { SkillDefinition } from "@/types/ai";
import { notesManagerSkill } from "./notes-manager";

// Registry of all available skills
export const skillDefinitions: Record<string, SkillDefinition> = {
	"notes-manager": notesManagerSkill,
};
