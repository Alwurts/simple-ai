import { generateAITextInternal } from "@/registry/lib/flow/generate-ai-text-internal";
import { serverNodeProcessors } from "@/registry/lib/flow/server-node-processors";
import { executeServerWorkflow } from "@/registry/lib/flow/sse-workflow-execution-engine";
import type { WorkflowDefinition } from "@/registry/lib/flow/workflow";
import type { GenerateTextNode } from "@/registry/ui/flow/generate-text-node";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
	try {
		const { workflow } = await req.json();

		if (!workflow) {
			return NextResponse.json(
				{ error: "No workflow data provided" },
				{ status: 400 },
			);
		}

		const workflowDefinition: WorkflowDefinition = workflow;

		// Create a stream for SSE
		const stream = new ReadableStream({
			async start(controller) {
				await executeServerWorkflow(
					workflowDefinition,
					{
						...serverNodeProcessors,
						"generate-text": async (node, targetsData) => {
							const generateNode = node as GenerateTextNode;
							const system = targetsData?.system;
							const prompt = targetsData?.prompt;
							if (!prompt) {
								throw new Error("Prompt not found");
							}

							const result = await generateAITextInternal({
								prompt,
								system,
								model: generateNode.data.config.model,
								tools: generateNode.data.dynamicHandles.tools,
							});

							return result.parsedResult;
						},
					},
					controller,
				);
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
