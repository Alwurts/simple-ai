import {
	jsonSchema,
	Output,
	smoothStream,
	stepCountIs,
	streamText,
	type Tool,
} from "ai";
import {
	type WorkflowToolId,
	workflowTools,
} from "@/registry/blocks/workflow-01/lib/tools";
import { workflowModel } from "@/registry/blocks/workflow-01/lib/workflow/models";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "../types";
import type { AgentNode } from "./agent.shared";

async function executeAgentNode(
	context: ExecutionContext<AgentNode>,
): Promise<NodeExecutionResult> {
	const { node, edges, accumulatedMessages, writer } = context;

	let output: Parameters<typeof streamText>[0]["experimental_output"];

	if (node.data.sourceType.type === "structured") {
		const schema = node.data.sourceType.schema;

		if (!schema) {
			throw new Error("Schema is required for structured output");
		}

		const jsonSchemaValue = jsonSchema(schema);
		output = Output.object({
			schema: jsonSchemaValue,
		});
	}

	const tools = workflowTools;
	const agentTools: Partial<Record<WorkflowToolId, Tool>> = {};

	for (const toolId of node.data.selectedTools) {
		if (tools[toolId as WorkflowToolId]) {
			agentTools[toolId as WorkflowToolId] =
				tools[toolId as WorkflowToolId];
		}
	}

	const streamResult = streamText({
		model: workflowModel.languageModel(node.data.model),
		system: node.data.systemPrompt,
		messages: accumulatedMessages,
		tools: agentTools,
		stopWhen: stepCountIs(node.data.maxSteps ?? 5),
		experimental_transform: smoothStream(),
		experimental_output: output,
	});

	if (!node.data.hideResponseInChat) {
		writer.merge(
			streamResult.toUIMessageStream({
				sendStart: false,
				sendFinish: false,
			}),
		);
	}

	const response = await streamResult.response;
	const text = await streamResult.text;

	let structured: unknown;
	if (node.data.sourceType.type === "structured") {
		try {
			structured = JSON.parse(text);
		} catch (e) {
			console.error("Failed to parse structured output:", e);
		}
	}

	if (!node.data.excludeFromConversation) {
		accumulatedMessages.push(...response.messages);
	}

	const outgoingEdge = edges.find((edge) => edge.source === node.id);
	const nextNodeId = outgoingEdge ? outgoingEdge.target : null;

	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: node.data,
		},
	});

	return {
		result: {
			text,
			structured,
		},
		nextNodeId,
	};
}

export const agentServerDefinition: NodeServerDefinition<AgentNode> = {
	execute: executeAgentNode,
};
