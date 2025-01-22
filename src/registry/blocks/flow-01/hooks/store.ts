import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";

export const MODELS = [
	"gpt-4o",
	"gpt-40-mini",
	"claude-3-5-sonnet",
	"llama-3-8b",
];

export const MOCK_GENERATION =
	"This is a mock generated text. It simulates AI output based on the inputs provided.";

export type TModel = (typeof MODELS)[number];

interface RuntimeState {
	isRunning: boolean;
	currentNodeId: string | null;
	lastRunTime: string | null; // ISO timestamp of last execution
}

interface GenerateTextData extends Record<string, unknown> {
	model: TModel;
	output?: string;
}

interface VisualizeTextData extends Record<string, unknown> {
	text: string;
}

interface TextInputData extends Record<string, unknown> {
	text: string;
	output?: string;
}

interface PromptCrafterData extends Record<string, unknown> {
	text: string;
	inputs: string[];
	output?: string;
}

export type TGenerateTextNode = Node<GenerateTextData, "generate-text">;
export type TVisualizeTextNode = Node<VisualizeTextData, "visualize-text">;
export type TTextInputNode = Node<TextInputData, "text-input">;
export type TPromptCrafterNode = Node<PromptCrafterData, "prompt-crafter">;

export type AppNode =
	| TGenerateTextNode
	| TVisualizeTextNode
	| TTextInputNode
	| TPromptCrafterNode;

export interface StoreState {
	nodes: AppNode[];
	edges: Edge[];
	runtime: RuntimeState;
	onNodesChange: (changes: NodeChange<AppNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
	onConnect: (connection: Edge | Connection) => void;
	updateNode: (id: string, data: Partial<AppNode["data"]>) => void;
	deleteNode: (id: string) => void;
	// Flow execution
	startExecution: () => Promise<void>;
	getNodeInputs: (nodeId: string) => Promise<string[]>;
	processNode: (nodeId: string, inputs: string[]) => Promise<string>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to perform topological sort
function topologicalSort(nodes: AppNode[], edges: Edge[]): string[] {
	const graph = new Map<string, Set<string>>();
	const inDegree = new Map<string, number>();

	// Initialize graph and in-degree
	for (const node of nodes) {
		graph.set(node.id, new Set());
		inDegree.set(node.id, 0);
	}

	// Build graph and calculate in-degrees
	for (const edge of edges) {
		const source = edge.source;
		const target = edge.target;
		graph.get(source)?.add(target);
		inDegree.set(target, (inDegree.get(target) || 0) + 1);
	}

	// Find nodes with no dependencies
	const queue: string[] = [];
	for (const node of nodes) {
		if ((inDegree.get(node.id) || 0) === 0) {
			queue.push(node.id);
		}
	}

	const result: string[] = [];
	while (queue.length > 0) {
		const nodeId = queue[0];
		if (!nodeId) {
			break;
		}
		queue.shift();
		result.push(nodeId);

		const neighbors = graph.get(nodeId);
		if (!neighbors) {
			continue;
		}

		for (const neighbor of Array.from(neighbors)) {
			inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
			if ((inDegree.get(neighbor) || 0) === 0) {
				queue.push(neighbor);
			}
		}
	}

	return result;
}

const useStore = createWithEqualityFn<StoreState>((set, get) => ({
	nodes: [
		{
			type: "text-input",
			id: "a",
			data: { text: "Alwurts" },
			position: { x: -400, y: 200 },
		},
		{
			type: "text-input",
			id: "x",
			data: { text: "You are a helpful assistant." },
			position: { x: 0, y: -150 },
		},
		{
			type: "generate-text",
			id: "b",
			data: { model: "gpt-4o" },
			position: { x: 450, y: 50 },
		},
		{
			type: "visualize-text",
			id: "c",
			data: { text: "### Hello, world!" },
			position: { x: 800, y: -100 },
		},
		{
			type: "prompt-crafter",
			id: "d",
			data: { text: "Hello, {input1}!", inputs: ["input1"] },
			position: { x: 0, y: 150 },
		},
	],
	edges: [
		{
			id: "e1",
			source: "a",
			target: "d",
			sourceHandle: "output",
			targetHandle: "input1",
		},
		{
			id: "e2",
			source: "x",
			target: "b",
			sourceHandle: "output",
			targetHandle: "system",
		},
		{
			id: "e3",
			source: "d",
			target: "b",
			sourceHandle: "output",
			targetHandle: "prompt",
		},
		{
			id: "e4",
			source: "b",
			target: "c",
			sourceHandle: "output",
			targetHandle: "input",
		},
	],
	runtime: {
		isRunning: false,
		currentNodeId: null,
		lastRunTime: null,
	},

	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
		});
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},
	onConnect: (connection) => {
		set({
			edges: addEdge(connection, get().edges),
		});
	},
	updateNode(id, data) {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === id) {
					return { ...node, data: { ...node.data, ...data } };
				}
				return node;
			}) as AppNode[],
		});
	},
	deleteNode(id) {
		set({
			nodes: get().nodes.filter((node) => node.id !== id),
		});
	},

	// Flow execution functions
	async startExecution() {
		const { nodes, edges, runtime } = get();
		if (runtime.isRunning) {
			return;
		}

		const runTime = new Date().toISOString();
		set({ runtime: { ...runtime, isRunning: true, lastRunTime: runTime } });

		try {
			// Clear previous outputs
			for (const node of nodes) {
				if (node.type !== "visualize-text") {
					get().updateNode(node.id, { output: undefined });
				}
			}

			// Get nodes in topological order
			const sortedNodeIds = topologicalSort(nodes, edges);

			// Process nodes in order
			for (const nodeId of sortedNodeIds) {
				set({
					runtime: {
						isRunning: true,
						currentNodeId: nodeId,
						lastRunTime: runTime,
					},
				});
				const inputs = await get().getNodeInputs(nodeId);
				await get().processNode(nodeId, inputs);
			}
		} finally {
			set({
				runtime: {
					isRunning: false,
					currentNodeId: null,
					lastRunTime: runTime,
				},
			});
		}
	},

	async getNodeInputs(nodeId: string) {
		const { nodes, edges } = get();
		const incomingEdges = edges.filter((edge) => edge.target === nodeId);
		const inputsByHandle = new Map<string, string>();

		for (const edge of incomingEdges) {
			const sourceNode = nodes.find((n) => n.id === edge.source);
			if (sourceNode?.data.output) {
				inputsByHandle.set(
					edge.targetHandle || "",
					sourceNode.data.output as string,
				);
			}
		}

		// For generate-text nodes, ensure proper ordering of system and prompt inputs
		const node = nodes.find((n) => n.id === nodeId);
		if (node?.type === "generate-text") {
			return [
				inputsByHandle.get("system") || "",
				inputsByHandle.get("prompt") || "",
			];
		}

		// For prompt-crafter nodes, maintain input order based on defined inputs array
		if (node?.type === "prompt-crafter") {
			return node.data.inputs.map((inputName) => {
				return inputsByHandle.get(inputName) || "";
			});
		}

		// For other nodes, return all inputs in the order they appear
		return Array.from(inputsByHandle.values());
	},

	async processNode(nodeId: string, inputs: string[]) {
		await delay(200); // Simulate processing time
		const { nodes } = get();
		const node = nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "";
		}

		let output = "";

		switch (node.type) {
			case "text-input": {
				output = node.data.text;
				break;
			}
			case "generate-text": {
				output = `Model: ${node.data.model}\nSystem: ${inputs[0] || ""}\nPrompt: ${inputs[1] || ""}`;
				break;
			}
			case "prompt-crafter": {
				let text = node.data.text;
				for (let i = 0; i < inputs.length; i++) {
					text = text.replace(`{${node.data.inputs[i]}}`, inputs[i] || "");
				}
				output = text;
				break;
			}
			case "visualize-text": {
				output = inputs[0] || "";
				get().updateNode(nodeId, { text: output });
				break;
			}
		}

		// Store the output in the node's data if it's not a visualize-text node
		if (node.type !== "visualize-text") {
			get().updateNode(nodeId, { output });
		}
		return output;
	},
}));

export { useStore };
