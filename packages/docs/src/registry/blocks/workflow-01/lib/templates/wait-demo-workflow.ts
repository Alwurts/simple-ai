import { WORKFLOW_MODELS } from "@/registry/blocks/workflow-01/lib/workflow/models";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/types/workflow";

export const WAIT_DEMO_WORKFLOW: { nodes: FlowNode[]; edges: FlowEdge[] } = {
	nodes: [
		{
			id: "start-node",
			type: "start",
			position: {
				x: 0,
				y: 0,
			},
			data: {
				sourceType: {
					type: "text",
				},
			},
			measured: {
				width: 163,
				height: 58,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "initial-agent-node",
			type: "agent",
			position: {
				x: 215.16311438267223,
				y: -0.9015840544455784,
			},
			data: {
				name: "Task Initiator",
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a task initiator. Generate a simple task that requires some processing time. For example: 'I need to process customer feedback data' or 'I need to analyze sales reports'. Keep it brief and clear.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
			},
			measured: {
				width: 182,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "wait-node",
			type: "wait",
			position: {
				x: 472.28701112265446,
				y: -0.9015840544455784,
			},
			data: {
				status: "idle",
				duration: 3,
				unit: "seconds",
			},
			measured: {
				width: 182,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "processing-agent-node",
			type: "agent",
			position: {
				x: 729.4109078626367,
				y: -0.9015840544455784,
			},
			data: {
				name: "Task Processor",
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a task processor. The previous agent initiated a task, and there was a brief wait (simulating processing time). Now complete the task with a detailed response. Provide a comprehensive and helpful result.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
			},
			measured: {
				width: 182,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "end-node",
			type: "end",
			position: {
				x: 986.534804602619,
				y: -0.9015840544455784,
			},
			data: {},
			measured: {
				width: 181,
				height: 58,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "workflow-description-note",
			type: "note",
			position: {
				x: 71.25415144237013,
				y: 163.5453637058922,
			},
			data: {
				content:
					"Wait Node Demo\n\nThis workflow demonstrates the wait/delay node functionality:\n\n1. Task Initiator creates a task\n2. Wait node pauses for 3 seconds (simulating processing)\n3. Task Processor completes the work\n\nThe wait node allows you to:\n- Add realistic delays to workflows\n- Simulate processing time\n- Control execution pacing\n- Test timing-dependent logic\n\nTry adjusting the wait duration!",
			},
			measured: {
				width: 600,
				height: 250,
			},
			selected: false,
			dragging: false,
			width: 600,
			height: 250,
			resizing: false,
		},
	],
	edges: [
		{
			id: "start-to-initiator",
			source: "start-node",
			target: "initial-agent-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "initiator-to-wait",
			source: "initial-agent-node",
			target: "wait-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "wait-to-processor",
			source: "wait-node",
			target: "processing-agent-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "processor-to-end",
			source: "processing-agent-node",
			target: "end-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
	],
};

export const WAIT_DEMO_TEMPLATE = {
	id: "wait-demo",
	name: "Wait Node Demo",
	description: "Demonstrates workflow timing control with delay functionality",
	category: "Examples",
	nodes: WAIT_DEMO_WORKFLOW.nodes,
	edges: WAIT_DEMO_WORKFLOW.edges,
	suggestions: [
		"Process customer feedback with realistic delays",
		"Simulate data processing workflows",
		"Test timing-dependent business logic",
	],
};
