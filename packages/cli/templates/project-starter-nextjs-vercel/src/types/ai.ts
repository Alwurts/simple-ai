import type { LanguageModelUsage, ToolUIPart, UIMessage } from "ai";
import { z } from "zod";
import type { AITools } from "@/lib/ai/tools/registry";

const aiMetadataSchema = z.object({
	createdAt: z.iso.datetime(),
	status: z.enum(["pending", "success", "error"]),
	modelId: z.string().optional(),
	usage: z.custom<LanguageModelUsage>().optional(),
	responseTime: z.number().optional(),
});

type AIMetadata = z.infer<typeof aiMetadataSchema>;

export const querySchema = z.object({});

const aiDataPartSchema = z.object({});

type AIDataPart = z.infer<typeof aiDataPartSchema>;

export type AIToolUIPart = ToolUIPart<AITools>;

export type AIUIMessage = UIMessage<AIMetadata, AIDataPart, AITools>;

export type BaseAIUIMessage = UIMessage<AIMetadata, AIDataPart>;

// Skill Definition

export const skillDefinitionSchema = z.object({
	name: z.string(),
	description: z.string(),
	content: z.string(),
	availableTools: z.array(z.string()),
});

export type SkillDefinition = z.infer<typeof skillDefinitionSchema>;
