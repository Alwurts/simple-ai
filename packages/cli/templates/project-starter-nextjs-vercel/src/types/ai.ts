import type { LanguageModelUsage, ToolUIPart, UIMessage } from "ai";
import { z } from "zod";
import type { AITools } from "@/lib/ai/tools/registry";

const aiMetadataSchema = z.object({
	createdAt: z.iso.datetime(),
	status: z.enum(["pending", "success", "error"]),
	usage: z.custom<LanguageModelUsage>().optional(),
	responseTime: z.number().optional(),
});

type AIMetadata = z.infer<typeof aiMetadataSchema>;

export const querySchema = z.object({});

const aiDataPartSchema = z.object({});

type AIDataPart = z.infer<typeof aiDataPartSchema>;

export type AIToolUIPart = ToolUIPart<AITools>;

export type AIUIMessage = UIMessage<AIMetadata, AIDataPart, AITools>;
