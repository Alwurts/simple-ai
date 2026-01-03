import type { InferUITools, ToolUIPart, UIMessage } from "ai";
import { z } from "zod";
import type { AgentToolSet } from "@/lib/ai/tools";

const aiMetadataSchema = z.record(z.string(), z.unknown());

type AIMetadata = z.infer<typeof aiMetadataSchema>;

export const querySchema = z.object({});

const aiDataPartSchema = z.object({});

type AIDataPart = z.infer<typeof aiDataPartSchema>;

type AITools = InferUITools<AgentToolSet>;

export type AIToolUIPart = ToolUIPart<AITools>;

export type AIUIMessage = UIMessage<AIMetadata, AIDataPart, AITools>;
