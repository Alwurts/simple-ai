import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import type {
	Node,
	Edge,
	EdgeChange,
	NodeChange,
	Connection,
} from "@xyflow/react";

export const MODELS = [
	"gpt-4o",
	"gpt-40-mini",
	"claude-3-5-sonnet",
	"llama-3-8b",
];

export type TModel = (typeof MODELS)[number];

export type TGenerateTextNode = Node<{ model: TModel }, "generate-text">;
export type TVisualizeTextNode = Node<{ text: string }, "visualize-text">;
export type TTextInputNode = Node<{ text: string }, "text-input">;
export type TPromptCrafterNode = Node<
	{
		text: string;
		inputs: string[];
	},
	"prompt-crafter"
>;

type AppNode =
	| TGenerateTextNode
	| TVisualizeTextNode
	| TTextInputNode
	| TPromptCrafterNode;

export interface StoreState {
	nodes: AppNode[];
	edges: Edge[];
	onNodesChange: (changes: NodeChange<AppNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
	onConnect: (connection: Edge | Connection) => void;
	updateNode: (id: string, data: Partial<AppNode["data"]>) => void;
	deleteNode: (id: string) => void;
}

const useStore = createWithEqualityFn<StoreState>((set, get) => ({
	nodes: [
		{
			type: "generate-text",
			id: "a",
			data: { model: "gpt-4o" },
			position: { x: 0, y: 0 },
		},
		{
			type: "visualize-text",
			id: "b",
			data: { text: "### Hello, world!" },
			position: { x: 250, y: 0 },
		},
		{
			type: "text-input",
			id: "c",
			data: { text: "Hello, world!" },
			position: { x: 500, y: 0 },
		},
		{
			type: "prompt-crafter",
			id: "d",
			data: { text: "Hello, world!", inputs: ["tyi", "tyi2", "tyi3"] },
			position: { x: 750, y: 0 },
		},
	],
	edges: [],
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
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
			nodes: get().nodes.map((node) =>
				node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
			) as AppNode[],
		});
	},
	deleteNode(id) {
		set({
			nodes: get().nodes.filter((node) => node.id !== id),
		});
	},
}));

export { useStore };
