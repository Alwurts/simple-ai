import type { Model, ToolResult } from "@/registry/blocks/flow-01/types/ai";
import type { GenerateTextNode } from "@/registry/blocks/flow-01/types/flow";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGroq } from "@ai-sdk/groq";
import { generateText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const {
		prompt,
		system,
		model,
		tools,
	}: {
		prompt: string;
		system: string;
		model: Model;
		tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
	} = data;

	let client: ReturnType<typeof createDeepSeek> | ReturnType<typeof createGroq>;
	switch (model) {
		case "deepseek-chat":
			client = createDeepSeek({
				baseURL: process.env.AI_GATEWAY_DEEPSEEK_URL,
			});
			break;
		case "llama-3.3-70b-versatile":
		case "llama-3.1-8b-instant":
			client = createGroq({
				baseURL: process.env.AI_GATEWAY_GROQ_URL,
			});
			break;
		default:
			throw new Error(`Unsupported model: ${model}`);
	}

	console.log("ai request", { prompt, system, model, tools });

	// Map tools to the format expected by the AI SDK
	const mappedTools = Object.fromEntries(
		tools.map((toolToMap) => [
			toolToMap.name,
			tool({
				description: toolToMap.description,
				parameters: z.object({
					toolValue: z.string(),
				}),
				execute: async ({ toolValue }) => {
					/* console.log("tool execution", {
						name: toolToMap.name,
						value: toolValue,
					}); */
					return toolValue;
				},
			}),
		]),
	);

	console.log("mappedTools", mappedTools);

	try {
		const result = await generateText({
			model: client(model),
			system: system,
			prompt: prompt,
			...(tools.length > 0 && {
				tools: mappedTools,
				maxSteps: 1,
				toolChoice: "required",
			}),
		});

		let toolResults: ToolResult[] = [];
		if (tools.length > 0 && result.toolResults) {
			toolResults = result.toolResults.map((step) => {
				const originalTool = tools.find((tool) => tool.name === step.toolName);
				return {
					id: originalTool?.id || "",
					name: step.toolName,
					description: originalTool?.description || "",
					result: step.result,
				};
			});
		}

		console.log("ai response", {
			text: result.text,
			toolResults: toolResults,
			totalTokens: result.usage?.totalTokens,
		});

		return NextResponse.json({
			text: result.text,
			toolResults: toolResults,
			totalTokens: result.usage?.totalTokens,
		});
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
