export interface ToolResult {
	id: string;
	name: string;
	result: string;
}

export interface ApiResponse {
	text: string;
	toolResults?: ToolResult[];
	totalTokens?: number;
}

export const MODELS = [
	"deepseek-chat",
	"llama-3.3-70b-versatile",
	"llama-3.1-8b-instant",
	"deepseek-r1-distill-llama-70b"
] as const;

export type Model = (typeof MODELS)[number];
