import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import {
	type DynamicHandle,
	isNodeWithDynamicHandles,
	isNodeOfType,
	type FlowEdge,
	type FlowNode,
	type FlowNodeDataTypeMap,
	type GenerateTextNode,
	type TextInputNode,
	type VisualizeTextNode,
	type PromptCrafterNode,
} from "@/registry/blocks/flow-01/types/flow";

interface RuntimeState {
	isRunning: boolean;
	currentNodeIds: string[];
}
export interface StoreState {
	nodes: FlowNode[];
	edges: FlowEdge[];
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
	onConnect: (connection: FlowEdge | Connection) => void;
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
	runtime: RuntimeState;
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
}));

export { useStore };
