import type { SkillDefinition } from "@/types/ai";
import { inventoryManagerSkill } from "./inventory-manager";

// Registry of all available skills
export const skillDefinitions: Record<string, SkillDefinition> = {
	"inventory-manager": inventoryManagerSkill,
};
