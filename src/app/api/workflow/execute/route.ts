import { serverNodeProcessors } from "@/registry/blocks/flow-01/lib/server/server-node-processors";
import { executeServerWorkflow } from "@/registry/lib/flow/sse-workflow-execution-engine";
import type { WorkflowDefinition } from "@/registry/lib/flow/workflow";
import { NextResponse } from "next/server";

export const maxDuration = 30;

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
					serverNodeProcessors,
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
