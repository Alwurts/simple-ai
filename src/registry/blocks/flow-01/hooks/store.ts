import { PROMPT_CRAFTER_WORKFLOW } from "@/registry/blocks/flow-01/lib/examples";
import { createClientExecutionEngine } from "@/registry/blocks/flow-01/lib/execution/client/client-execution-engine";
import { nodeProcessors } from "@/registry/blocks/flow-01/lib/execution/client/node-processors-client";
import { ServerExecutionClient } from "@/registry/blocks/flow-01/lib/execution/client/server-execution-client";
import { createNode } from "@/registry/blocks/flow-01/lib/node-factory";
import { prepareWorkflow } from "@/registry/blocks/flow-01/lib/workflow";
import {
	type DynamicHandle,
	type FlowEdge,
	type FlowNode,
	type FlowNodeDataTypeMap,
	hasTargets,
	isNodeOfType,
	isNodeWithDynamicHandles,
} from "@/registry/blocks/flow-01/types/flow";
import type { NodeExecutionState } from "@/registry/blocks/flow-01/types/execution";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";

export type ExecutionMode = "client" | "server";

export interface StoreState {
	nodes: FlowNode[];
	edges: FlowEdge[];
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
	onConnect: (connection: Connection) => void;
	getNodeById: (nodeId: string) => FlowNode;
	createNode: (
		nodeType: FlowNode["type"],
		position: { x: number; y: number },
	) => FlowNode;
	updateNode: <T extends FlowNode["type"]>(
		id: string,
		nodeType: T,
		data: Partial<FlowNodeDataTypeMap[T]>,
	) => void;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState>,
	) => void;
	deleteNode: (id: string) => void;
	addDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handle: Omit<DynamicHandle, "id">,
	) => string;
	removeDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handleId: string,
	) => void;
	executionMode: ExecutionMode;
	setExecutionMode: (mode: ExecutionMode) => void;
	// execution
	startExecution: () => Promise<void>;
	getNodeTargetsData: (nodeId: string) => Record<string, string> | undefined;
}

const useStore = createWithEqualityFn<StoreState>((set, get) => ({
	...PROMPT_CRAFTER_WORKFLOW,
	executionMode: "client",
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
		const newEdge = addEdge(connection, get().edges);
		const sourceNode = get().getNodeById(connection.source);

		if (!connection.sourceHandle) {
			throw new Error("Source handle not found");
		}

		const sourceExecutionState = sourceNode.data.executionState;

		if (sourceExecutionState?.sources) {
			const sourceHandleData =
				sourceExecutionState.sources[connection.sourceHandle];
			const nodes = get().nodes.map((node) => {
				if (node.id === connection.target && connection.targetHandle) {
					return {
						...node,
						data: {
							...node.data,
							executionState: node.data.executionState
								? {
										...node.data.executionState,
										targets: {
											...node.data.executionState.targets,
											[connection.targetHandle]: sourceHandleData,
										},
									}
								: {
										status: "success",
										timestamp: new Date().toISOString(),
										targets: {
											[connection.targetHandle]: sourceHandleData,
										},
									},
						},
					};
				}
				return node;
			});

			set({
				nodes: nodes as FlowNode[],
			});
		}

		set({
			edges: newEdge,
		});
	},
	getNodeById: (nodeId) => {
		const node = get().nodes.find((n) => n.id === nodeId);
		if (!node) {
			throw new Error(`Node with id ${nodeId} not found`);
		}
		return node;
	},
	createNode(nodeType, position) {
		const newNode = createNode(nodeType, position);
		set((state) => ({
			nodes: [...state.nodes, newNode],
		}));
		return newNode;
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
	updateNodeExecutionState: (nodeId, state) => {
		set((currentState) => ({
			nodes: currentState.nodes.map((n) => {
				if (n.id === nodeId) {
					return {
						...n,
						data: {
							...n.data,
							executionState: {
								...n.data.executionState,
								...state,
								timestamp: state.timestamp || new Date().toISOString(),
							} as NodeExecutionState,
						},
					} as FlowNode;
				}
				return n;
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
							dynamicHandles: {
								...node.data.dynamicHandles,
								[handleCategory]: [
									...(node.data.dynamicHandles[
										handleCategory as keyof typeof node.data.dynamicHandles
									] || []),
									{
										...handle,
										id: newId,
									},
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
					] as DynamicHandle[];
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
	setExecutionMode: (mode) => {
		set({ executionMode: mode });
	},
	// Runtime
	getNodeTargetsData: (nodeId) => {
		const node = get().getNodeById(nodeId);
		if (!hasTargets(node)) {
			return undefined;
		}
		const edgesConnectedToNode = get().edges.filter(
			(edge) => edge.target === nodeId,
		);
		const targetsData: Record<string, string> = {};
		for (const edge of edgesConnectedToNode) {
			const sourceNode = get().getNodeById(edge.source);
			const sourceNodeExecutionState = sourceNode.data.executionState;
			if (!sourceNodeExecutionState?.sources) {
				throw new Error(
					`Execution state not found for source node with id ${edge.source}`,
				);
			}
			const sourceNodeResult =
				sourceNodeExecutionState.sources[edge.sourceHandle];
			targetsData[edge.targetHandle] = sourceNodeResult;
		}
		return targetsData;
	},
	async startExecution() {
		const { nodes, edges, executionMode } = get();
		const workflow = prepareWorkflow(nodes, edges);

		if (workflow.errors.length > 0) {
			throw new Error(workflow.errors.map((error) => error.message).join("\n"));
		}

		// Reset execution status for all nodes
		set((state) => ({
			nodes: state.nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					executionState: {
						...node.data.executionState,
						status: "idle",
					},
				},
			})) as FlowNode[],
		}));

		if (executionMode === "client") {
			const { getNodeTargetsData, updateNodeExecutionState, getNodeById } =
				get();

			const engine = createClientExecutionEngine({
				workflow,
				getNodeTargetsData,
				updateNodeExecutionState,
				getNodeById,
				processNode: async (nodeId, targetsData) => {
					const node = get().getNodeById(nodeId);
					const processor = nodeProcessors[node.type];
					return await processor(node, targetsData);
				},
			});

			await engine.execute(workflow.executionOrder);
		} else {
			const sseClient = new ServerExecutionClient();
			const { updateNodeExecutionState } = get();

			return new Promise((resolve, reject) => {
				sseClient.connect(workflow, {
					onProgress: (progress) => {
						updateNodeExecutionState(progress.nodeId, {
							status: progress.status,
							timestamp: progress.timestamp,
						});
					},
					onNodeUpdate: (nodeId, state) => {
						updateNodeExecutionState(nodeId, state);
					},
					onError: (error, nodeId) => {
						if (nodeId) {
							updateNodeExecutionState(nodeId, {
								status: "error",
								error: error.message,
								timestamp: new Date().toISOString(),
							});
						}
						reject(error);
					},
					onComplete: () => {
						resolve();
					},
				});
			});
		}
	},
}));

export { useStore };
