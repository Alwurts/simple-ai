import type { SkillDefinition } from "@/types/ai";
import { skillDefinitions } from "./registry/index";

/**
 * Lists all available skills.
 * @returns A Map of skillName -> SkillDefinition.
 */
export async function listSkillsMetadata(): Promise<Map<string, SkillDefinition>> {
	const skills = new Map<string, SkillDefinition>();

	for (const [skillName, skillDef] of Object.entries(skillDefinitions)) {
		skills.set(skillName, skillDef);
	}

	return skills;
}

/**
 * Loads the full content of a specific skill.
 * @param skillName The name of the skill to load.
 * @returns A Promise resolving to the skill's content, or null if not found.
 */
export async function getSkillDefinition(skillName: string): Promise<SkillDefinition | null> {
	const skillDef = skillDefinitions[skillName];
	if (!skillDef) {
		console.warn(`[Skills] Requested skill '${skillName}' not found.`);
		return null;
	}

	return skillDef;
}

/**
 * Formats the available skills into a string suitable for the system prompt.
 * @returns A formatted string listing skills, e.g., "- [notes-manager]: Manage personal notes."
 */
export async function formatSkillsForPrompt(): Promise<string> {
	const skills = await listSkillsMetadata();
	if (skills.size === 0) {
		return "No skills are currently available.";
	}

	return Array.from(skills.entries())
		.map(([name, skill]) => `- **[${name}]**: ${skill.description}`)
		.join("\n");
}
