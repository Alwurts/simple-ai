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
	"deepseek-chat",
	"llama-3.3-70b-versatile",
	"llama-3.1-8b-instant",
] as const;

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

export interface Tool {
	id: string;
	name: string;
	description: string;
	result?: string;
}

interface ApiResponse {
	text: string;
	tokens_used?: number;
	toolResults?: Tool[];
}

interface GenerateTextOutput {
	result: string;
	toolResults?: Tool[];
	metadata: {
		model: TModel;
		tokens_used: number;
	};
}
interface GenerateTextInput {
	system: string;
	prompt: string;
}

interface PromptCrafterInput {
	[key: string]: string;
}

// Node configurations
interface GenerateTextConfig {
	model: TModel;
	tools: Tool[];
}

interface PromptCrafterConfig {
	template: string;
	inputs: Array<{ id: string; label: string }>;
}

interface TextInputConfig {
	text: string;
}

// Base interfaces for node data
interface BaseNodeData extends Record<string, unknown> {
	lastRun?: NodeExecutionState;
}

interface GenerateTextData extends BaseNodeData {
	config: GenerateTextConfig;
	lastRun?: NodeExecutionState<GenerateTextInput, GenerateTextOutput>;
}

interface PromptCrafterData extends BaseNodeData {
	config: PromptCrafterConfig;
	lastRun?: NodeExecutionState<PromptCrafterInput, string>;
}

interface TextInputData extends BaseNodeData {
	config: TextInputConfig;
	lastRun?: NodeExecutionState<undefined, string>;
}

interface VisualizeTextData extends BaseNodeData {
	lastRun?: NodeExecutionState<string, undefined>;
}

export type TGenerateTextNode = Node<GenerateTextData, "generate-text">;
export type TVisualizeTextNode = Node<VisualizeTextData, "visualize-text">;
export type TTextInputNode = Node<TextInputData, "text-input">;
export type TPromptCrafterNode = Node<PromptCrafterData, "prompt-crafter">;

type AppNodeTypeUndefined =
	| TGenerateTextNode
	| TVisualizeTextNode
	| TTextInputNode
	| TPromptCrafterNode;

export type AppNode = AppNodeTypeUndefined & {
	type: Exclude<AppNodeTypeUndefined["type"], undefined>;
};

// Type guards for better type safety
function isGenerateTextOutput(output: unknown): output is GenerateTextOutput {
	return (
		!!output &&
		typeof output === "object" &&
		"result" in output &&
		typeof (output as GenerateTextOutput).result === "string" &&
		"metadata" in output &&
		typeof (output as GenerateTextOutput).metadata === "object"
	);
}

// Type guards for node types
/* function isGenerateTextNode(node: AppNode): node is TGenerateTextNode {
	return node.type === "generate-text";
}

function isPromptCrafterNode(node: AppNode): node is TPromptCrafterNode {
	return node.type === "prompt-crafter";
}

function isTextInputNode(node: AppNode): node is TTextInputNode {
	return node.type === "text-input";
}

function isVisualizeTextNode(node: AppNode): node is TVisualizeTextNode {
	return node.type === "visualize-text";
} */

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
	addDynamicTool: (nodeId: string) => string;
	removeDynamicTool: (nodeId: string, toolId: string) => void;
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

const NODE_DELAYS: Record<AppNode["type"], number> = {
	"text-input": DELAY_TIMES.QUICK,
	"visualize-text": DELAY_TIMES.QUICK,
	"prompt-crafter": DELAY_TIMES.QUICK,
	"generate-text": MOCK_AI_RESPONSE ? DELAY_TIMES.GENERATION : 0,
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
	const failedNodes = new Set<string>();

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

	// Function to check if any upstream nodes have failed
	const hasUpstreamFailure = (nodeId: string): boolean => {
		const upstreamNodes = edges
			.filter((edge) => edge.target === nodeId)
			.map((edge) => edge.source);

		return upstreamNodes.some(
			(id) => failedNodes.has(id) || hasUpstreamFailure(id),
		);
	};

	// Function to process a single node
	const processNode = async (nodeId: string) => {
		if (processingNodes.has(nodeId)) {
			return;
		}

		// Skip processing if any upstream nodes have failed
		if (hasUpstreamFailure(nodeId)) {
			// Mark node as processed but don't run it
			const nodeState = nodeStates.get(nodeId);
			if (nodeState) {
				nodeState.processed = true;
			}
			// Update node to idle state since we're skipping it
			get().updateNode(nodeId, {
				lastRun: {
					timestamp: runTime,
					inputs: {},
					status: "idle",
				},
			});
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

			// Check if the node failed during processing
			const node = get().nodes.find((n) => n.id === nodeId);
			if (node?.data.lastRun?.status === "error") {
				failedNodes.add(nodeId);
			} else if (node?.type === "generate-text" && node.data.lastRun?.output) {
				const output = node.data.lastRun.output as GenerateTextOutput;

				// Process tool results if they exist
				if (output.toolResults?.length) {
					// Find edges that connect from this node's tool handles
					const toolEdges = edges.filter(
						(edge) => edge.source === nodeId && edge.sourceHandle !== "output",
					);

					// For each tool result, find matching edge and mark target node as ready
					for (const toolResult of output.toolResults) {
						if (!toolResult.id || !toolResult.result) {
							continue;
						}
						const matchingEdge = toolEdges.find(
							(edge) => edge.sourceHandle === toolResult.id,
						);
						if (matchingEdge) {
							const targetState = nodeStates.get(matchingEdge.target);
							if (targetState) {
								targetState.dependencies.delete(nodeId);
								targetState.isReady = Array.from(
									targetState.dependencies,
								).every((depId) => nodeStates.get(depId)?.processed);
								if (targetState.isReady && !targetState.processed) {
									void processNode(matchingEdge.target);
								}
							}
						}
					}
				}
			}

			// Mark node as processed
			const nodeState = nodeStates.get(nodeId);
			if (nodeState) {
				nodeState.processed = true;
			}

			// Update dependent nodes' readiness and start them if ready
			for (const edge of edges) {
				if (edge.source === nodeId && edge.sourceHandle === "output") {
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
			// Mark node as failed
			failedNodes.add(nodeId);
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
				config: {
					text: "Hey, how are you?",
				},
			},
			position: { x: -400, y: 200 },
		},
		{
			type: "text-input",
			id: "x",
			data: {
				config: {
					text: "You are a helpful assistant that always uses the tool to respond. You always use printValueA and printValueB at the same time to respond to the user. Always use the same value for both tools. Only call each tool one time. GIve your full responsee all at once in a single tool call. IN addition to using the tools you also provide your response normally without tools all at the same time",
				},
			},
			position: { x: 0, y: -150 },
		},
		{
			type: "generate-text",
			id: "b",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
					tools: [
						{
							id: "xyz", // printValue as id works, but xyz doesn't
							name: "printValueA",
							description: "Use this to respond to the user",
						},
						{
							id: "tgh", // printValue as id works, but xyz doesn't
							name: "printValueB",
							description: "Use this to respond to the user",
						},
					],
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
			id: "e1",
			source: "a",
			target: "b",
			sourceHandle: "output",
			targetHandle: "prompt",
		},
		{
			id: "e2",
			source: "x",
			target: "b",
			sourceHandle: "output",
			targetHandle: "system",
		},
		/* {
			id: "e3",
			source: "d",
			target: "b",
			sourceHandle: "output",
			targetHandle: "prompt",
		}, */
		{
			id: "e4",
			source: "b",
			target: "c",
			sourceHandle: "xyz", // printValue works, but xyz doesn't
			targetHandle: "input",
		},
		{
			id: "e5",
			source: "b",
			target: "y",
			sourceHandle: "tgh",
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
			nodes: applyNodeChanges<AppNode>(changes, get().nodes),
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
			edges: get().edges.filter(
				(edge) => edge.source !== id && edge.target !== id,
			),
		});
	},

	addDynamicInput(nodeId) {
		const newId = nanoid();
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "prompt-crafter") {
					return {
						...node,
						data: {
							...node.data,
							//inputs: [...(node.data.inputs || []), { id: newId, label: "" }],
							config: {
								...node.data.config,
								inputs: [
									...(node.data.config.inputs || []),
									{ id: newId, label: "" },
								],
							},
						},
					};
				}
				return node;
			}) as AppNode[],
		});
		return newId;
	},

	removeDynamicInput(nodeId, handleId) {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "prompt-crafter") {
					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								inputs: (node.data.config.inputs || []).filter(
									(input) => input.id !== handleId,
								),
							},
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

	addDynamicTool(nodeId) {
		const newId = nanoid();
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "generate-text") {
					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								tools: [
									...node.data.config.tools,
									{ id: newId, name: "", description: "" },
								],
							},
						},
					};
				}
				return node;
			}),
		});
		return newId;
	},

	removeDynamicTool(nodeId, toolId) {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId && node.type === "generate-text") {
					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								tools: node.data.config.tools.filter(
									(tool) => tool.id !== toolId,
								),
							},
						},
					};
				}
				return node;
			}),
			edges: get().edges.filter(
				(edge) => !(edge.source === nodeId && edge.sourceHandle === toolId),
			),
		});
	},

	createNode(type, position) {
		let newNode: AppNode;

		switch (type) {
			case "generate-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: {
							model: "llama-3.1-8b-instant",
							tools: [],
						},
					},
				};
				break;
			case "prompt-crafter":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: {
							template: "",
							inputs: [],
						},
					},
				};
				break;
			case "visualize-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: {
							text: "",
						},
					},
				};
				break;
			case "text-input":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: {
							text: "",
						},
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
			// Reset all nodes to idle state and clear visualization text
			for (const node of nodes) {
				const updates: Partial<AppNode["data"]> = {
					lastRun: {
						timestamp: runTime,
						inputs: {},
						status: "idle",
					},
				};

				// Reset text only for visualization nodes
				if (node.type === "visualize-text") {
					updates.text = "";
				}

				get().updateNode(node.id, updates);
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

	async getNodeInputs(nodeId) {
		const { nodes, edges } = get();
		const incomingEdges = edges.filter((edge) => edge.target === nodeId);
		const inputsByHandle = new Map<string, string>();

		for (const edge of incomingEdges) {
			const sourceNode = nodes.find((n) => n.id === edge.source);
			if (sourceNode?.data.lastRun?.output) {
				if (sourceNode.type === "generate-text") {
					const output = sourceNode.data.lastRun.output;
					if (edge.sourceHandle === "output") {
						inputsByHandle.set(edge.targetHandle || "", output.result);
					} else {
						// If connected to a tool handle, find the matching tool result
						const toolResult = output.toolResults?.find(
							(t) => t.id === edge.sourceHandle,
						);
						if (toolResult?.result) {
							inputsByHandle.set(edge.targetHandle || "", toolResult.result);
						}
					}
				} else {
					inputsByHandle.set(
						edge.targetHandle || "",
						typeof sourceNode.data.lastRun.output === "string"
							? sourceNode.data.lastRun.output
							: (sourceNode.data.lastRun.output as GenerateTextOutput).result,
					);
				}
			}
		}

		// For generate-text nodes, ensure proper ordering of system and prompt inputs
		const node = nodes.find((n) => n.id === nodeId);
		if (node?.type === "generate-text") {
			return [
				inputsByHandle.get("system") ?? "",
				inputsByHandle.get("prompt") ?? "",
			];
		}

		// For prompt-crafter nodes, maintain input order based on defined inputs array
		if (node?.type === "prompt-crafter") {
			return node.data.config.inputs.map((input) => {
				return inputsByHandle.get(input.id) || "";
			});
		}

		// For other nodes, return all inputs in the order they appear
		return Array.from(inputsByHandle.values());
	},

	async processNode(nodeId, inputs) {
		const node = get().nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "";
		}
		const updateNode = get().updateNode;

		const timestamp = new Date().toISOString();
		let output: string | GenerateTextOutput = "";

		try {
			const delayForNode = NODE_DELAYS[node.type];
			if (delayForNode > 0) {
				await delay(delayForNode);
			}

			switch (node.type) {
				case "text-input": {
					output = node.data.config.text;
					updateNode(nodeId, {
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
					let result: GenerateTextOutput;

					if (MOCK_AI_RESPONSE) {
						result = {
							result: `Model: ${node.data.config.model}\nSystem: ${inputs[0] || ""}\nPrompt: ${inputs[1] || ""}`,
							metadata: {
								model: node.data.config.model,
								tokens_used: 100,
							},
							toolResults: [],
						};
					} else {
						const response = await fetch("/api/ai/flow/generate-text", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								system: inputs[0],
								prompt: inputs[1],
								model: node.data.config.model,
								tools: node.data.config.tools,
							}),
						});

						if (!response.ok) {
							throw new Error(`API call failed: ${response.statusText}`);
						}

						const data = (await response.json()) as ApiResponse;
						result = {
							result: data.text,
							metadata: {
								model: node.data.config.model,
								tokens_used: data.tokens_used || 0,
							},
							toolResults: data.toolResults,
						};
					}

					updateNode(nodeId, {
						lastRun: {
							timestamp,
							inputs: {
								system: inputs[0] || "",
								prompt: inputs[1] || "",
							},
							output: result,
							status: "success",
						},
					});
					output = result;
					break;
				}
				case "prompt-crafter": {
					const inputsMap: Record<string, string> = {};
					node.data.config.inputs.forEach((input, index) => {
						inputsMap[input.label] = inputs[index] || "";
					});

					let text = node.data.config.template;
					for (const [label, value] of Object.entries(inputsMap)) {
						text = text.replace(`{${label}}`, value);
					}
					output = text;

					updateNode(nodeId, {
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
					updateNode(nodeId, {
						config: {
							text: output,
						},
						lastRun: {
							timestamp,
							inputs: inputs[0] || "",
							status: "success",
						},
					});
					break;
				}
			}

			return isGenerateTextOutput(output) ? output.result : output;
		} catch (error) {
			updateNode(nodeId, {
				lastRun: {
					timestamp,
					inputs: {
						system: inputs[0] || "",
						prompt: inputs[1] || "",
					},
					/* inputs:
						node.type === "generate-text"
							? {
									system: inputs[0] || "",
									prompt: inputs[1] || "",
								}
							: inputs[0] || "", */
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});
			return "";
		}
	},
}));

export { useStore };
