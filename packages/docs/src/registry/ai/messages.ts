import type { UIMessage } from "ai";
import z from "zod";
import type { Tools } from "@/registry/ai/tools/tools-registry";

const metadataSchema = z.object({
	timestamp: z.string().optional(),
	outputTokens: z.number().optional(),
	agent: z
		.object({
			id: z.string(),
			name: z.string(),
			image: z.string().optional(),
		})
		.optional(),
	mentions: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.optional(),
});

type AIUIMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
	someDataPart: z.object({}),
});

type AIUIDataPart = z.infer<typeof dataPartSchema>;

type AIUITools = Tools;

export type AIUIMessage = UIMessage<AIUIMetadata, AIUIDataPart, AIUITools>;
