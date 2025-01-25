import type { FlowEdge, FlowNode } from "@/registry/blocks/flow-01/types/flow";

export const TOOL_USE_CASES: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "a",
			data: {
				config: {
					value: "Hey, how are you?",
				},
			},
			position: { x: -400, y: 200 },
		},
		{
			type: "text-input",
			id: "x",
			data: {
				config: {
					value:
						"You are a helpful assistant that always uses the tool to respond. You always use printValueA and printValueB at the same time to respond to the user. Always use the same value for both tools. Only call each tool one time. GIve your full responsee all at once in a single tool call. IN addition to using the tools you also provide your response normally without tools all at the same time",
				},
			},
			position: { x: 0, y: -150 },
		},
		{
			type: "generate-text",
			id: "b",
			data: {
				dynamicHandles: {
					tools: [
						{
							id: "xyz", // printValue as id works, but xyz doesn't
							name: "printValueA",
							description: "Use this to respond to the user",
							//type: "source",
						},
						{
							id: "tgh", // printValue as id works, but xyz doesn't
							name: "printValueB",
							description: "Use this to respond to the user",
							//type: "source",
						},
					],
				},
				config: {
					model: "llama-3.1-8b-instant",
				},
			},
			position: { x: 450, y: 50 },
		},
		{
			type: "visualize-text",
			id: "c",
			data: {},
			position: { x: 900, y: -100 },
		},
		{
			type: "visualize-text",
			id: "y",
			data: {},
			position: { x: 900, y: 500 },
		},
	],
	edges: [
		{
			type: "custom-edge",
			id: "e1",
			source: "a",
			target: "b",
			sourceHandle: "result",
			targetHandle: "prompt",
		},
		{
			type: "custom-edge",
			id: "e2",
			source: "x",
			target: "b",
			sourceHandle: "result",
			targetHandle: "system",
		},
		{
			type: "custom-edge",
			id: "e4",
			source: "b",
			target: "c",
			sourceHandle: "xyz", // printValue works, but xyz doesn't
			targetHandle: "input",
		},
		{
			type: "custom-edge",
			id: "e5",
			source: "b",
			target: "y",
			sourceHandle: "tgh",
			targetHandle: "input",
		},
	],
};

export const SIMPLE_INPUT_OUTPUT_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "a",
			data: { config: { value: "Hello" } },
			position: { x: -0, y: 0 },
		},
		{ type: "visualize-text", id: "b", data: {}, position: { x: 500, y: 0 } },
	],
	edges: [
		{
			type: "custom-edge",
			id: "e1",
			source: "a",
			target: "b",
			sourceHandle: "result",
			targetHandle: "input",
		},
	],
};

export const PROMPT_CRAFTER_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "a",
			data: { config: { value: "Hello" } },
			position: { x: -0, y: 0 },
		},
		{
			type: "text-input",
			id: "b",
			data: { config: { value: "World" } },
			position: { x: -0, y: 300 },
		},
		{
			type: "prompt-crafter",
			id: "c",
			data: {
				config: { template: "{{input1}}, {{input2}}!" },
				dynamicHandles: {
					"template-tags": [
						{ id: "c-a", name: "input1" },
						{ id: "c-b", name: "input2" },
					],
				},
			},
			position: { x: 500, y: 0 },
		},
		{
			type: "visualize-text",
			id: "d",
			data: {},
			position: { x: 1000, y: 0 },
		},
		{
			type: "text-input",
			id: "e",
			data: { config: { value: "You only answer in German" } },
			position: { x: 600, y: 400 },
		},
		{
			type: "generate-text",
			id: "f",
			data: {
				config: { model: "llama-3.1-8b-instant" },
				dynamicHandles: {
					tools: [],
				},
			},
			position: { x: 1000, y: 300 },
		},
		{
			type: "visualize-text",
			id: "g",
			data: {},
			position: { x: 1500, y: 200 },
		},
	],
	edges: [
		{
			type: "custom-edge",
			id: "a-c",
			source: "a",
			target: "c",
			sourceHandle: "result",
			targetHandle: "c-a",
		},
		{
			type: "custom-edge",
			id: "b-c",
			source: "b",
			target: "c",
			sourceHandle: "result",
			targetHandle: "c-b",
		},
		{
			type: "custom-edge",
			id: "c-d",
			source: "c",
			target: "d",
			sourceHandle: "result",
			targetHandle: "input",
		},
		{
			type: "custom-edge",
			id: "e-f",
			source: "e",
			target: "f",
			sourceHandle: "result",
			targetHandle: "system",
		},
		{
			type: "custom-edge",
			id: "f-d",
			source: "c",
			target: "f",
			sourceHandle: "result",
			targetHandle: "prompt",
		},
		{
			type: "custom-edge",
			id: "f-g",
			source: "f",
			target: "g",
			sourceHandle: "result",
			targetHandle: "input",
		},
	],
};
