import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import type { NextRequest } from "next/server";
import { executeWorkflow } from "@/registry/blocks/workflow-01/lib/workflow/executor";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/lib/workflow/messages";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const {
		messages,
		nodes,
		edges,
	}: { messages: WorkflowUIMessage[]; nodes: FlowNode[]; edges: FlowEdge[] } =
		await req.json();

	const stream = createUIMessageStream<WorkflowUIMessage>({
		execute: ({ writer }) =>
			executeWorkflow({ nodes, edges, messages, writer }),
	});

	return createUIMessageStreamResponse({ stream });
}
