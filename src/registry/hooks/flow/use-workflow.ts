import { createNode } from "@/registry/lib/flow/node-factory";
import { SSEWorkflowExecutionClient } from "@/registry/lib/flow/sse-workflow-execution-client";
import {
	type DynamicHandle,
	type FlowEdge,
	type FlowNode,
	type WorkflowDefinition,
	type WorkflowError,
	isNodeOfType,
	isNodeWithDynamicHandles,
	prepareWorkflow,
} from "@/registry/lib/flow/workflow";
import type {
	EdgeExecutionState,
	NodeExecutionState,
} from "@/registry/lib/flow/workflow-execution-engine";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";

export interface WorkflowState {
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
		data: Partial<FlowNode["data"]>,
	) => void;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState> | undefined,
	) => void;
	updateEdgeExecutionState: (
		edgeId: string,
		state: Partial<EdgeExecutionState> | undefined,
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
	// Workflow validation and execution state
	validateWorkflow: () => WorkflowDefinition;
	workflowExecutionState: {
		isRunning: boolean;
		finishedAt: string | null;
		errors: WorkflowError[];
		timesRun: number;
	};
	// execution
	startExecution: () => Promise<{
		status: "success" | "error";
		message: string;
		error?: Error;
		validationErrors?: WorkflowError[];
	}>;
	// Initialize workflow with nodes and edges
	initializeWorkflow: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}

const useWorkflow = createWithEqualityFn<WorkflowState>((set, get) => ({
	nodes: [],
	edges: [],
	workflowExecutionState: {
		isRunning: false,
		finishedAt: null,
		errors: [],
		timesRun: 0,
	},
	initializeWorkflow: (nodes: FlowNode[], edges: FlowEdge[]) => {
		set({ nodes, edges });
		get().validateWorkflow();
	},
	validateWorkflow: () => {
		const { nodes, edges } = get();
		const workflow = prepareWorkflow(nodes, edges);

		// Reset edge execution states
		for (const edge of workflow.edges) {
			get().updateEdgeExecutionState(edge.id, {
				error: undefined,
			});
		}

		// Update states for errors if any
		if (workflow.errors.length > 0) {
			for (const error of workflow.errors) {
				switch (error.type) {
					case "multiple-sources-for-target-handle":
					case "cycle":
						for (const edge of error.edges) {
							get().updateEdgeExecutionState(edge.id, {
								error,
							});
						}
						break;
					case "missing-required-connection":
						get().updateNodeExecutionState(error.node.id, {
							status: "idle",
							timestamp: new Date().toISOString(),
							error,
						});
						break;
				}
			}
		}

		set((state) => ({
			workflowExecutionState: {
				...state.workflowExecutionState,
				errors: workflow.errors,
			},
		}));
		return workflow;
	},
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges<FlowNode>(changes, get().nodes),
		});
		get().validateWorkflow();
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
		get().validateWorkflow();
	},
	onConnect: (connection) => {
		const newEdge = addEdge({ ...connection, type: "status" }, get().edges);
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
		get().validateWorkflow();
	},
	getNodeById: (nodeId) => {
		const node = get().nodes.find((node) => node.id === nodeId);
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
			nodes: currentState.nodes.map((node) => {
				if (node.id === nodeId) {
					return {
						...node,
						data: {
							...node.data,
							executionState: {
								...node.data?.executionState,
								...state,
							},
						},
					} as FlowNode;
				}
				return node;
			}),
		}));
	},
	updateEdgeExecutionState: (edgeId, state) => {
		set((currentState) => ({
			edges: currentState.edges.map((edge) => {
				if (edge.id === edgeId) {
					return {
						...edge,
						data: {
							...edge.data,
							executionState: {
								...edge.data?.executionState,
								...state,
							},
						},
					};
				}
				return edge;
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
							dynamicHandles: {
								...node.data.dynamicHandles,
								[handleCategory]: newHandles,
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
	// Runtime

	async startExecution() {
		// Check if workflow has already run successfully
		if (get().workflowExecutionState.timesRun > 3) {
			const message =
				"Workflow has already run successfully and cannot be run again";
			console.warn(message);
			return {
				status: "error",
				message,
				error: new Error(message),
			};
		}

		// Reset execution state for all nodes
		set((state) => ({
			nodes: state.nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					executionState: {
						status: "idle",
						timestamp: new Date().toISOString(),
					},
				},
			})) as FlowNode[],
		}));

		const workflow = get().validateWorkflow();

		if (workflow.errors.length > 0) {
			const message = "Workflow validation failed";
			return {
				status: "error",
				message,
				error: new Error(message),
				validationErrors: workflow.errors,
			};
		}

		// Set execution state to running
		set((state) => ({
			workflowExecutionState: {
				...state.workflowExecutionState,
				isRunning: true,
			},
		}));

		try {
			const sseClient = new SSEWorkflowExecutionClient();
			const { updateNodeExecutionState } = get();

			await new Promise((resolve, reject) => {
				sseClient.connect(workflow, {
					onNodeUpdate: (nodeId, state) => {
						updateNodeExecutionState(nodeId, state);
					},
					onError: (error) => {
						console.error("Error in execution:", error);
						reject(error);
					},
					onComplete: ({ timestamp }) => {
						set((state) => ({
							workflowExecutionState: {
								...state.workflowExecutionState,
								finishedAt: timestamp,
								timesRun: state.workflowExecutionState.timesRun + 1,
							},
						}));
						resolve(undefined);
					},
				});
			});

			return {
				status: "success",
				message: "Workflow executed successfully",
			};
		} catch (error) {
			console.error("Workflow execution failed:", error);
			return {
				status: "error",
				message: "Workflow execution failed",
				error: error instanceof Error ? error : new Error(String(error)),
			};
		} finally {
			// Reset execution state when done
			set((state) => ({
				workflowExecutionState: {
					...state.workflowExecutionState,
					isRunning: false,
				},
			}));
		}
	},
}));

export { useWorkflow };
