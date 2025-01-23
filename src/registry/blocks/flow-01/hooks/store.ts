import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, Edge, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import {
	type DynamicHandle,
	isNodeWithDynamicHandles,
	isNodeOfType,
	type FlowNode,
	type FlowNodeDataTypeMap,
	type GenerateTextNode,
	type TextInputNode,
	type VisualizeTextNode,
	type PromptCrafterNode,
} from "@/registry/blocks/flow-01/types/flow";
import { generateText } from "../lib/ai";

interface RuntimeState {
	isRunning: boolean;
	currentNodeIds: string[];
	lastRunTime: string | null;
}
export interface StoreState {
	nodes: FlowNode[];
	edges: Edge[];
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
	onConnect: (connection: Edge | Connection) => void;
	updateNode: <T extends FlowNode["type"]>(
		id: string,
		nodeType: T,
		data: Partial<FlowNodeDataTypeMap[T]>,
	) => void;
	deleteNode: (id: string) => void;
	createNode: (
		nodeType: FlowNode["type"],
		position: { x: number; y: number },
	) => FlowNode;
	addDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string, // Change to more specific type depending on node type
		handle: Omit<DynamicHandle, "id">,
	) => string;
	removeDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string, // Change to more specific type depending on node type
		handleId: string,
	) => void;
	// Flow execution
	runtime: RuntimeState;
	startExecution: () => Promise<void>;
	getNodeInputs: (nodeId: string) => Promise<string[]>;
	processNode: (nodeId: string, inputs: string[]) => Promise<string>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* const DELAY_TIMES = {
	QUICK: 100,
	GENERATION: 1500,
} as const; */

/* const NODE_DELAYS: Record<AppNode["type"], number> = {
	"text-input": DELAY_TIMES.QUICK,
	"visualize-text": DELAY_TIMES.QUICK,
	"prompt-crafter": DELAY_TIMES.QUICK,
	"generate-text": MOCK_AI_RESPONSE ? DELAY_TIMES.GENERATION : 0,
}; */

interface NodeDependencyState {
	nodeId: string;
	isReady: boolean;
	dependencies: Set<string>;
	processed: boolean;
}

// Add type for sources
type NodeSources = {
	result: string;
	[key: string]: string;
};

async function processNodesIndependently(
	nodes: FlowNode[],
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

		const node = nodes.find((n) => n.id === nodeId);
		if (!node) {
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
			get().updateNode(nodeId, node.type, {
				executionState: {
					timestamp: new Date().toISOString(),
					status: "idle",
				},
			});
			return;
		}

		processingNodes.add(nodeId);

		try {
			// Set node to processing state
			get().updateNode(nodeId, node.type, {
				executionState: {
					timestamp: new Date().toISOString(),
					status: "processing",
				},
			});

			const inputs = await get().getNodeInputs(nodeId);
			await get().processNode(nodeId, inputs);

			// Check if the node failed during processing
			const updatedNode = get().nodes.find((n) => n.id === nodeId);
			if (updatedNode?.data.executionState?.status === "error") {
				failedNodes.add(nodeId);
			} else if (updatedNode?.type === "generate-text") {
				const sources = updatedNode.data.executionState?.sources as
					| NodeSources
					| undefined;
				if (sources) {
					// Find edges that connect from this node's tool handles
					const toolEdges = edges.filter(
						(edge) => edge.source === nodeId && edge.sourceHandle !== "output",
					);

					// For each tool source, find matching edge and mark target node as ready
					for (const [sourceId, _] of Object.entries(sources)) {
						if (sourceId === "result") {
							continue;
						}
						const matchingEdge = toolEdges.find(
							(edge) => edge.sourceHandle === sourceId,
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
							type: "source",
						},
						{
							id: "tgh", // printValue as id works, but xyz doesn't
							name: "printValueB",
							description: "Use this to respond to the user",
							type: "source",
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
			nodes: applyNodeChanges<FlowNode>(changes, get().nodes),
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
	updateNode(id, type, data) {
		set((state) => ({
			nodes: state.nodes.map((node) => {
				if (node.id === id && isNodeOfType(node, type)) {
					return {
						...node,
						data: {
							...node.data,
							...data,
						},
					};
				}
				return node;
			}),
		}));
	},
	deleteNode(id) {
		set({
			nodes: get().nodes.filter((node) => node.id !== id),
			edges: get().edges.filter(
				(edge) => edge.source !== id && edge.target !== id,
			),
		});
	},
	addDynamicHandle(nodeId, type, handleCategory, handle) {
		const newId = nanoid();
		set({
			nodes: get().nodes.map((node) => {
				if (
					node.id === nodeId &&
					isNodeWithDynamicHandles(node) &&
					isNodeOfType(node, type)
				) {
					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								dynamicHandles: {
									...node.data.dynamicHandles,
									[handleCategory]: [
										...node.data.dynamicHandles[
											handleCategory as keyof typeof node.data.dynamicHandles // Change to more specific type
										],
										{
											...handle,
											id: newId,
										},
									],
								},
							},
						},
					};
				}

				return node;
			}),
		});
		return newId;
	},
	removeDynamicHandle(nodeId, type, handleCategory, handleId) {
		set({
			nodes: get().nodes.map((node) => {
				if (
					node.id === nodeId &&
					isNodeWithDynamicHandles(node) &&
					isNodeOfType(node, type)
				) {
					const dynamicHandles = node.data.dynamicHandles;
					const handles = dynamicHandles[
						handleCategory as keyof typeof dynamicHandles
					] as DynamicHandle[]; // Remove with type guard or more specific type
					const newHandles = handles.filter((handle) => handle.id !== handleId);

					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								dynamicHandles: {
									...node.data.dynamicHandles,
									[handleCategory]: newHandles,
								},
							},
						},
					};
				}
				return node;
			}),
			edges: get().edges.filter((edge) => {
				if (edge.source === nodeId && edge.sourceHandle === handleId) {
					return false;
				}
				if (edge.target === nodeId && edge.targetHandle === handleId) {
					return false;
				}
				return true;
			}),
		});
	},
	createNode(nodeType, position) {
		switch (nodeType) {
			case "generate-text": {
				const newNode: GenerateTextNode = {
					id: nanoid(),
					type: nodeType,
					position,
					data: {
						config: {
							model: "llama-3.1-8b-instant",
						},
						dynamicHandles: {
							tools: [],
						},
					},
				};
				set((state) => ({
					nodes: [...state.nodes, newNode],
				}));
				return newNode;
			}
			case "prompt-crafter": {
				const newNode: PromptCrafterNode = {
					id: nanoid(),
					type: nodeType,
					position,
					data: {
						config: {
							template: "",
						},
						dynamicHandles: {
							"template-tags": [],
						},
					},
				};
				set((state) => ({
					nodes: [...state.nodes, newNode],
				}));
				return newNode;
			}
			case "visualize-text": {
				const newNode: VisualizeTextNode = {
					id: nanoid(),
					type: nodeType,
					position,
					data: {},
				};
				set((state) => ({
					nodes: [...state.nodes, newNode],
				}));
				return newNode;
			}
			case "text-input": {
				const newNode: TextInputNode = {
					id: nanoid(),
					type: nodeType,
					position,
					data: {
						config: {
							value: "",
						},
					},
				};
				set((state) => ({
					nodes: [...state.nodes, newNode],
				}));
				return newNode;
			}
			default:
				throw new Error(`Unknown node type: ${nodeType}`);
		}
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
				const updates: Partial<FlowNode["data"]> = {
					executionState: {
						timestamp: runTime,
						status: "idle",
					},
				};

				// Reset text only for visualization nodes
				/* if (node.type === "visualize-text") {
					updates.text = "";
				} */

				get().updateNode(node.id, node.type, updates);
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
			if (sourceNode?.data.executionState?.sources) {
				const sources = sourceNode.data.executionState.sources as NodeSources;
				if (sourceNode.type === "generate-text") {
					if (edge.sourceHandle === "output") {
						inputsByHandle.set(edge.targetHandle || "", sources.result);
					} else if (edge.sourceHandle && sources[edge.sourceHandle]) {
						// If connected to a tool handle, get the tool source
						inputsByHandle.set(
							edge.targetHandle || "",
							sources[edge.sourceHandle],
						);
					}
				} else {
					// For other nodes, just get the result source
					inputsByHandle.set(edge.targetHandle || "", sources.result);
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

		// For prompt-crafter nodes, maintain input order based on template tags
		if (node?.type === "prompt-crafter") {
			return node.data.dynamicHandles["template-tags"].map((tag) => {
				return inputsByHandle.get(tag.id) || "";
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
		const updateNode = get().updateNode;

		const timestamp = new Date().toISOString();
		let output = "";

		try {
			switch (node.type) {
				case "text-input": {
					output = node.data.config.value;
					updateNode(nodeId, node.type, {
						executionState: {
							timestamp,
							sources: {
								result: output,
							},
							status: "success",
						},
					});
					break;
				}
				case "generate-text": {
					const response = await generateText({
						model: node.data.config.model,
						system: inputs[0] || "",
						prompt: inputs[1] || "",
						tools: node.data.dynamicHandles.tools,
					});

					// Create sources object with result and tool results
					const sources: NodeSources = {
						result: response.text,
					};

					// Add tool results to sources
					if (response.toolResults?.length) {
						for (const toolResult of response.toolResults) {
							if (toolResult.id && toolResult.result) {
								sources[toolResult.id] = toolResult.result;
							}
						}
					}

					updateNode(nodeId, node.type, {
						executionState: {
							timestamp,
							sources,
							status: "success",
						},
					});
					output = response.text;
					break;
				}
				case "prompt-crafter": {
					const templateTags = node.data.dynamicHandles["template-tags"];
					const inputsMap: Record<string, string> = {};
					templateTags.forEach((tag, index) => {
						inputsMap[tag.id] = inputs[index] || "";
					});

					let text = node.data.config.template;
					for (const [id, value] of Object.entries(inputsMap)) {
						const tag = templateTags.find((t) => t.id === id);
						if (tag) {
							text = text.replace(`{${tag.name}}`, value);
						}
					}
					output = text;

					updateNode(nodeId, node.type, {
						executionState: {
							timestamp,
							targets: inputsMap,
							sources: {
								result: output,
							},
							status: "success",
						},
					});
					break;
				}
				case "visualize-text": {
					output = inputs[0] || "";
					updateNode(nodeId, node.type, {
						executionState: {
							timestamp,
							targets: {
								input: inputs[0] || "",
							},
							status: "success",
						},
					});
					break;
				}
			}

			return output;
		} catch (error) {
			updateNode(nodeId, node.type, {
				executionState: {
					timestamp,
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});
			return "";
		}
	},
}));

export { useStore };
