import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { executeWorkflow } from "@/registry/blocks/workflow-01/lib/workflow/executor-internal";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/lib/workflow/messages";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		if (!body || typeof body !== "object") {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 },
			);
		}

		const { messages, nodes, edges } = body;

		if (!Array.isArray(messages)) {
			return NextResponse.json(
				{ error: "messages must be an array" },
				{ status: 400 },
			);
		}

		if (!Array.isArray(nodes)) {
			return NextResponse.json(
				{ error: "nodes must be an array" },
				{ status: 400 },
			);
		}

		if (!Array.isArray(edges)) {
			return NextResponse.json(
				{ error: "edges must be an array" },
				{ status: 400 },
			);
		}

		const stream = createUIMessageStream<WorkflowUIMessage>({
			execute: ({ writer }) =>
				executeWorkflow({ nodes, edges, messages, writer }),
		});

		return createUIMessageStreamResponse({ stream });
	} catch (error) {
		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: "Invalid JSON in request body" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 },
		);
	}
}
