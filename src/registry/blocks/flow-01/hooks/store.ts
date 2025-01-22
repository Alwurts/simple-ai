import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import { nanoid } from "nanoid";

export const MODELS = [
	"gpt-4o",
	"gpt-40-mini",
	"claude-3-5-sonnet",
	"llama-3-8b",
];

export type TModel = (typeof MODELS)[number];

interface RuntimeState {
	isRunning: boolean;
	currentNodeIds: string[];
	lastRunTime: string | null;
}

type NodeExecutionStatus = "success" | "error" | "processing" | "idle";

interface NodeExecutionState<TInput = unknown, TOutput = unknown> {
	timestamp: string;
	inputs: TInput;
	output?: TOutput;
	status: NodeExecutionStatus;
	error?: string;
}

interface ApiResponse {
	text: string;
	tokens_used?: number;
}

interface GenerateTextOutput {
	result: string;
	metadata: {
		model: TModel;
		tokens_used: number;
	};
}

interface GenerateTextConfig {
	model: TModel;
}

interface GenerateTextInput {
	system: string;
	prompt: string;
}

interface GenerateTextData extends Record<string, unknown> {
	config: GenerateTextConfig;
	lastRun?: NodeExecutionState<GenerateTextInput, GenerateTextOutput>;
}

interface VisualizeTextData extends Record<string, unknown> {
	text: string;
	lastRun?: NodeExecutionState<string, never>;
}

interface TextInputData extends Record<string, unknown> {
	text: string;
	lastRun?: NodeExecutionState<never, string>;
}

interface PromptCrafterInput {
	[key: string]: string;
}

interface PromptCrafterData extends Record<string, unknown> {
	text: string;
	inputs: Array<{ id: string; label: string }>;
	lastRun?: NodeExecutionState<PromptCrafterInput, string>;
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
	addDynamicInput: (nodeId: string) => string;
	removeDynamicInput: (nodeId: string, handleId: string) => void;
	createNode: (
		type: AppNode["type"],
		position: { x: number; y: number },
	) => AppNode;
	// Flow execution
	startExecution: () => Promise<void>;
	getNodeInputs: (nodeId: string) => Promise<string[]>;
	processNode: (nodeId: string, inputs: string[]) => Promise<string>;
}

export const MOCK_GENERATION =
	"This is a mock generated text. It simulates AI output based on the inputs provided.";

// Global flag for mocking AI responses
export const MOCK_AI_RESPONSE = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DELAY_TIMES = {
	QUICK: 100,
	GENERATION: 1500,
} as const;

const getNodeDelay = (nodeType: AppNode["type"]): number | undefined => {
	switch (nodeType) {
		case "text-input":
		case "visualize-text":
		case "prompt-crafter":
			return DELAY_TIMES.QUICK;
		case "generate-text":
			return MOCK_AI_RESPONSE ? DELAY_TIMES.GENERATION : undefined;
		default:
			return DELAY_TIMES.QUICK;
	}
};

interface NodeDependencyState {
	nodeId: string;
	isReady: boolean;
	dependencies: Set<string>;
	processed: boolean;
}

async function processNodesIndependently(
	nodes: AppNode[],
	edges: Edge[],
	runTime: string,
	set: (state: Partial<StoreState>) => void,
	get: () => StoreState,
) {
	// Track dependency state for each node
	const nodeStates = new Map<string, NodeDependencyState>();
	const processingNodes = new Set<string>();

	// Initialize node states and dependencies
	for (const node of nodes) {
		const incomingEdges = edges.filter((edge) => edge.target === node.id);
		const dependencies = new Set(incomingEdges.map((edge) => edge.source));

		nodeStates.set(node.id, {
			nodeId: node.id,
			isReady: dependencies.size === 0, // Nodes with no dependencies are ready immediately
			dependencies,
			processed: false,
		});
	}

	// Function to process a single node
	const processNode = async (nodeId: string) => {
		if (processingNodes.has(nodeId)) {
			return;
		}
		processingNodes.add(nodeId);

		try {
			// Set node to processing state
			get().updateNode(nodeId, {
				lastRun: {
					timestamp: runTime,
					inputs: {},
					status: "processing",
				},
			});

			const inputs = await get().getNodeInputs(nodeId);
			await get().processNode(nodeId, inputs);

			// Mark node as processed
			const nodeState = nodeStates.get(nodeId);
			if (nodeState) {
				nodeState.processed = true;
			}

			// Update dependent nodes' readiness and start them if ready
			for (const edge of edges) {
				if (edge.source === nodeId) {
					const targetState = nodeStates.get(edge.target);
					if (targetState) {
						targetState.dependencies.delete(nodeId);
						// Check if all dependencies are processed
						targetState.isReady = Array.from(targetState.dependencies).every(
							(depId) => nodeStates.get(depId)?.processed,
						);
						// If node becomes ready, start processing it
						if (targetState.isReady && !targetState.processed) {
							void processNode(edge.target);
						}
					}
				}
			}
		} catch (error) {
			console.error(`Error processing node ${nodeId}:`, error);
			// Mark node as processed even if it failed to avoid deadlock
			const nodeState = nodeStates.get(nodeId);
			if (nodeState) {
				nodeState.processed = true;
			}
		} finally {
			processingNodes.delete(nodeId);
			// Update currently running nodes
			set({
				runtime: {
					isRunning: true,
					currentNodeIds: Array.from(processingNodes),
					lastRunTime: runTime,
				},
			});
		}
	};

	// Start processing all initially ready nodes
	const initialNodes = Array.from(nodeStates.values()).filter(
		(state) => state.isReady,
	);
	await Promise.all(initialNodes.map((state) => processNode(state.nodeId)));

	// Wait until all nodes are processed or we detect a cycle
	while (Array.from(nodeStates.values()).some((state) => !state.processed)) {
		const remainingNodes = Array.from(nodeStates.values()).filter(
			(state) => !state.processed,
		);
		const readyNodes = remainingNodes.filter((state) => state.isReady);

		if (readyNodes.length === 0 && processingNodes.size === 0) {
			// No nodes are ready and none are processing - might be a cycle
			break;
		}

		// Small delay to prevent tight loop
		await delay(100);
	}
}

const useStore = createWithEqualityFn<StoreState>((set, get) => ({
	nodes: [
		{
			type: "text-input",
			id: "a",
			data: {
				text: "Alwurts",
			},
			position: { x: -400, y: 200 },
		} as TTextInputNode,
		{
			type: "text-input",
			id: "x",
			data: {
				text: "You are a helpful assistant.",
			},
			position: { x: 0, y: -150 },
		} as TTextInputNode,
		{
			type: "generate-text",
			id: "b",
			data: {
				config: { model: "gpt-4o" },
			},
			position: { x: 450, y: 50 },
		} as TGenerateTextNode,
		{
			type: "visualize-text",
			id: "c",
			data: {
				text: "",
			},
			position: { x: 900, y: -100 },
		} as TVisualizeTextNode,
		{
			type: "prompt-crafter",
			id: "d",
			data: {
				text: "Hello, {input1}!",
				inputs: [{ id: "input1", label: "input1" }],
			},
			position: { x: 0, y: 150 },
		} as TPromptCrafterNode,
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
		currentNodeIds: [],
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

	addDynamicInput(nodeId: string) {
		const newId = nanoid();
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "prompt-crafter") {
					return {
						...node,
						data: {
							...node.data,
							inputs: [...(node.data.inputs || []), { id: newId, label: "" }],
						},
					};
				}
				return node;
			}) as AppNode[],
		});
		return newId;
	},

	removeDynamicInput(nodeId: string, handleId: string) {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "prompt-crafter") {
					return {
						...node,
						data: {
							...node.data,
							inputs: (node.data.inputs || []).filter(
								(input) => input.id !== handleId,
							),
						},
					};
				}
				return node;
			}) as AppNode[],
			edges: get().edges.filter(
				(edge) => !(edge.target === nodeId && edge.targetHandle === handleId),
			),
		});
	},

	createNode(type: AppNode["type"], position: { x: number; y: number }) {
		let newNode: AppNode;

		switch (type) {
			case "generate-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: { model: "gpt-4o" },
					},
				};
				break;
			case "prompt-crafter":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
						inputs: [],
					},
				};
				break;
			case "visualize-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
					},
				};
				break;
			case "text-input":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
					},
				};
				break;
			default:
				throw new Error(`Unknown node type: ${type}`);
		}

		set({
			nodes: [...get().nodes, newNode],
		});

		return newNode;
	},

	// Flow execution functions
	async startExecution() {
		const { nodes, edges, runtime } = get();
		if (runtime.isRunning) {
			return;
		}

		const runTime = new Date().toISOString();
		set({
			runtime: {
				...runtime,
				isRunning: true,
				lastRunTime: runTime,
				currentNodeIds: [],
			},
		});

		try {
			// Reset all nodes to idle state
			for (const node of nodes) {
				get().updateNode(node.id, {
					lastRun: {
						timestamp: runTime,
						inputs: {},
						status: "idle",
					},
				});
			}

			await processNodesIndependently(nodes, edges, runTime, set, get);
		} finally {
			set({
				runtime: {
					isRunning: false,
					currentNodeIds: [],
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
			if (sourceNode?.data.lastRun?.output) {
				inputsByHandle.set(
					edge.targetHandle || "",
					typeof sourceNode.data.lastRun.output === "string"
						? sourceNode.data.lastRun.output
						: sourceNode.data.lastRun.output.result,
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
			return node.data.inputs.map((input) => {
				return inputsByHandle.get(input.id) || "";
			});
		}

		// For other nodes, return all inputs in the order they appear
		return Array.from(inputsByHandle.values());
	},

	async processNode(nodeId: string, inputs: string[]) {
		const node = get().nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "";
		}

		const timestamp = new Date().toISOString();
		let output:
			| string
			| { result: string; metadata: { model: TModel; tokens_used: number } } =
			"";

		try {
			// Apply appropriate delay based on node type
			const delayForNode = getNodeDelay(node.type);
			if (delayForNode && delayForNode > 0) {
				await delay(delayForNode);
			}

			switch (node.type) {
				case "text-input": {
					output = node.data.text;
					get().updateNode(nodeId, {
						lastRun: {
							timestamp,
							inputs: {},
							output,
							status: "success",
						},
					});
					break;
				}
				case "generate-text": {
					let output: GenerateTextOutput;

					if (MOCK_AI_RESPONSE) {
						// Mock generation with metadata
						output = {
							result: `Model: ${node.data.config.model}\nSystem: ${inputs[0] || ""}\nPrompt: ${inputs[1] || ""}`,
							metadata: {
								model: node.data.config.model,
								tokens_used: 100, // Mock value
							},
						};
					} else {
						// Make actual API call
						try {
							const response = await fetch("/api/ai/flow/generate-text", {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									system: inputs[0],
									prompt: inputs[1],
								}),
							});

							if (!response.ok) {
								throw new Error(`API call failed: ${response.statusText}`);
							}

							const data = (await response.json()) as ApiResponse;
							output = {
								result: data.text,
								metadata: {
									model: node.data.config.model,
									tokens_used: data.tokens_used || 0,
								},
							};
						} catch (error) {
							throw new Error(
								`Failed to generate text: ${error instanceof Error ? error.message : "Unknown error"}`,
							);
						}
					}

					get().updateNode(nodeId, {
						lastRun: {
							timestamp,
							inputs: {
								system: inputs[0] || "",
								prompt: inputs[1] || "",
							},
							output,
							status: "success",
						},
					});
					break;
				}
				case "prompt-crafter": {
					const inputsMap: Record<string, string> = {};
					node.data.inputs.forEach((input, index) => {
						inputsMap[input.label] = inputs[index] || "";
					});

					let text = node.data.text;
					for (const [label, value] of Object.entries(inputsMap)) {
						text = text.replace(`{${label}}`, value);
					}
					output = text;

					get().updateNode(nodeId, {
						lastRun: {
							timestamp,
							inputs: inputsMap,
							output,
							status: "success",
						},
					});
					break;
				}
				case "visualize-text": {
					output = inputs[0] || "";
					get().updateNode(nodeId, {
						text: output,
						lastRun: {
							timestamp,
							inputs: inputs[0] || "",
							status: "success",
						},
					});
					break;
				}
			}

			return typeof output === "string"
				? output
				: (output as GenerateTextOutput).result;
		} catch (error) {
			// Update node with error state
			const errorInputs = (() => {
				switch (node.type) {
					case "generate-text": {
						return {
							system: inputs[0] || "",
							prompt: inputs[1] || "",
						};
					}
					case "prompt-crafter": {
						const inputsMap: Record<string, string> = {};
						node.data.inputs.forEach((input, index) => {
							inputsMap[input.label] = inputs[index] || "";
						});
						return inputsMap;
					}
					case "text-input": {
						return {};
					}
					case "visualize-text": {
						return inputs[0] || "";
					}
					default: {
						return {};
					}
				}
			})();

			get().updateNode(nodeId, {
				lastRun: {
					timestamp,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					inputs: errorInputs as any,
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});
			return "";
		}
	},
}));

export { useStore };
