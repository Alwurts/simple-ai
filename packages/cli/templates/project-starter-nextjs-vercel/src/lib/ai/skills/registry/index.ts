import type { SkillDefinition } from "@/types/ai";
import { productManagerSkill } from "./product-manager";
import { stockMovementManagerSkill } from "./stock-movement-manager";
import { warehouseManagerSkill } from "./warehouse-manager";

// Registry of all available skills
export const skillDefinitions: Record<string, SkillDefinition> = {
	"product-manager": productManagerSkill,
	"warehouse-manager": warehouseManagerSkill,
	"stock-movement-manager": stockMovementManagerSkill,
};
