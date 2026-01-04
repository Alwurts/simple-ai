import { type InferUITool, tool } from "ai";
import { z } from "zod";
import { getSkillDefinition } from "@/lib/ai/skills/skill-service";
import { skillDefinitionSchema } from "@/types/ai";

const loadSkillParamsSchema = z.object({
	name: z.string().describe("The name of the skill to load (e.g., 'notes-manager')."),
});

export type LoadSkillParams = z.infer<typeof loadSkillParamsSchema>;

const loadSkillResultSchema = z.union([
	z.object({
		success: z.literal(true),
		definition: skillDefinitionSchema,
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type LoadSkillResult = z.infer<typeof loadSkillResultSchema>;

export const loadSkillTool = tool({
	description:
		"Load instructions for a specific skill. Use this to gain context on how to use a skill.",
	inputSchema: loadSkillParamsSchema,
	outputSchema: loadSkillResultSchema,
	execute: async ({ name }) => {
		const definition = await getSkillDefinition(name);
		if (!definition) {
			return { error: `Skill '${name}' not found or is invalid.` };
		}
		return { definition };
	},
});

export type LoadSkillTool = InferUITool<typeof loadSkillTool>;
