import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import type { FlowNodeType } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import { getNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import {
	type FlowEdge,
	type FlowNode,
	isNodeOfType,
	type ValidationError,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import {
	canConnectHandle,
	getErrorsForEdge,
	getErrorsForNode,
	isValidConnection,
	validateWorkflow as validateWorkflowFn,
} from "@/registry/blocks/workflow-01/lib/workflow/validation";

export interface WorkflowState {
	nodes: FlowNode[];
	edges: FlowEdge[];
	validationState: {
		valid: boolean;
		errors: ValidationError[];
		warnings: string[];
		lastValidated: number | null;
	};
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
	onConnect: (connection: Connection) => void;
	getNodeById: (nodeId: string) => FlowNode | null;
	getWorkflowData: () => { nodes: FlowNode[]; edges: FlowEdge[] };
	createNode: (
		nodeType: FlowNode["type"],
		position: { x: number; y: number },
	) => FlowNode;
	updateNode: <T extends FlowNodeType>({
		id,
		nodeType,
		data,
	}: {
		id: string;
		nodeType: T;
		data: Partial<Extract<FlowNode, { type: T }>["data"]>;
	}) => void;

	deleteNode: (id: string) => void;

	initializeWorkflow: ({
		nodes,
		edges,
	}: {
		nodes: FlowNode[];
		edges: FlowEdge[];
	}) => void;

	resetNodeStatuses: () => void;
	validateWorkflow: () => void;
	canConnectHandle: (params: {
		nodeId: string;
		handleId: string;
		type: "source" | "target";
	}) => boolean;
}

const useWorkflow = createWithEqualityFn<WorkflowState>((set, get) => ({
	nodes: [],
	edges: [],
	validationState: {
		valid: true,
		errors: [],
		warnings: [],
		lastValidated: null,
	},
	initializeWorkflow: ({ nodes, edges }) => {
		set({ nodes: nodes, edges });
		get().validateWorkflow();
	},
	onNodesChange: (changes) => {
		const filteredChanges = changes.filter((change) => {
			if (change.type === "remove") {
				const node = get().nodes.find((n) => n.id === change.id);
				if (node?.type === "start") {
					return false;
				}
			}
			return true;
		});

		set({
			nodes: applyNodeChanges<FlowNode>(filteredChanges, get().nodes),
		});

		// Only validate on meaningful structural changes
		const shouldValidate = changes.some(
			(change) => change.type === "add" || change.type === "remove",
		);

		if (shouldValidate) {
			get().validateWorkflow();
		}
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});

		// Only validate on structural edge changes
		const shouldValidate = changes.some(
			(change) => change.type === "add" || change.type === "remove",
		);

		if (shouldValidate) {
			get().validateWorkflow();
		}
	},
	onConnect: (connection) => {
		const valid = isValidConnection({
			sourceNodeId: connection.source || "",
			sourceHandle: connection.sourceHandle ?? null,
			targetNodeId: connection.target || "",
			targetHandle: connection.targetHandle ?? null,
			nodes: get().nodes,
			edges: get().edges,
		});

		if (!valid) {
			return;
		}

		const newEdge = addEdge({ ...connection, type: "status" }, get().edges);

		if (!connection.sourceHandle) {
			throw new Error("Source handle not found");
		}

		set({
			edges: newEdge,
		});
		get().validateWorkflow();
	},
	getNodeById: (nodeId) => {
		const node = get().nodes.find((node) => node.id === nodeId);
		return node || null;
	},
	getWorkflowData: () => ({
		nodes: get().nodes,
		edges: get().edges,
	}),
	createNode(nodeType, position) {
		const definition = getNodeDefinition(nodeType);
		if (!definition) {
			throw new Error(`Unknown node type: ${nodeType}`);
		}
		const newNode = definition.client.create(position);
		set((state) => ({
			nodes: [...state.nodes, newNode],
		}));
		get().validateWorkflow();
		return newNode;
	},
	updateNode({ id, nodeType, data }) {
		set((state) => ({
			nodes: state.nodes.map((node) => {
				if (node.id === id && isNodeOfType(node, nodeType)) {
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
		get().validateWorkflow();
	},
	deleteNode(id) {
		const node = get().nodes.find((n) => n.id === id);
		if (node?.type === "start") {
			return;
		}

		set({
			nodes: get().nodes.filter((node) => node.id !== id),
			edges: get().edges.filter(
				(edge) => edge.source !== id && edge.target !== id,
			),
		});
		get().validateWorkflow();
	},
	resetNodeStatuses: () => {
		set((state) => ({
			nodes: state.nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					status: "idle",
				},
			})) as FlowNode[],
		}));
	},
	validateWorkflow: () => {
		const { nodes, edges } = get();
		const result = validateWorkflowFn(nodes, edges);

		const updatedNodes = nodes.map((node) => {
			const nodeErrors = getErrorsForNode(node.id, result.errors);
			return {
				...node,
				data: {
					...node.data,
					validationErrors:
						nodeErrors.length > 0 ? nodeErrors : undefined,
				},
			} as FlowNode;
		});

		const updatedEdges = edges.map((edge) => {
			const edgeErrors = getErrorsForEdge(edge.id, result.errors);
			return {
				...edge,
				data: {
					...edge.data,
					validationErrors:
						edgeErrors.length > 0 ? edgeErrors : undefined,
				},
			};
		});

		set({
			nodes: updatedNodes,
			edges: updatedEdges,
			validationState: {
				valid: result.valid,
				errors: result.errors,
				warnings: result.warnings,
				lastValidated: Date.now(),
			},
		});
	},
	canConnectHandle: ({
		nodeId,
		handleId,
		type,
	}: {
		nodeId: string;
		handleId: string;
		type: "source" | "target";
	}) => {
		const { nodes, edges } = get();
		return canConnectHandle({ nodeId, handleId, type, nodes, edges });
	},
}));

export { useWorkflow };
