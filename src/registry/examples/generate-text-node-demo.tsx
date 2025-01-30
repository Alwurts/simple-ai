"use client";

import "@xyflow/react/dist/style.css";

import {
	Background,
	type Connection,
	type EdgeChange,
	type Node,
	type NodeChange,
	type NodeProps,
	type NodeTypes,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from "@xyflow/react";

import type { Model } from "@/registry/ui/model-selector";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { GenerateTextNode } from "../ui/flow/generate-text-node";

const GenerateTextNodeController = ({
	id,
	data,
	...props
}: NodeProps<Node>) => {
	const [model, setModel] = useState<Model>("deepseek-chat");
	const [toolHandles, setToolHandles] = useState({
		tools: [
			{
				id: "name",
				name: "name",
			},
		],
	});

	const handleCreateTool = useCallback(() => {
		setToolHandles({
			...toolHandles,
			tools: [...toolHandles.tools, { id: nanoid(), name: "name" }],
		});
		return true;
	}, [toolHandles]);

	const handleRemoveTool = useCallback(() => {
		setToolHandles({
			...toolHandles,
			tools: toolHandles.tools.filter((tool) => tool.id !== "name"),
		});
		return true;
	}, [toolHandles]);

	const handleUpdateTool = useCallback(
		(toolId: string, newName: string, newDescription?: string) => {
			setToolHandles({
				...toolHandles,
				tools: toolHandles.tools.map((tool) =>
					tool.id === toolId
						? { ...tool, name: newName, description: newDescription }
						: tool,
				),
			});
			return true;
		},
		[toolHandles],
	);

	return (
		<GenerateTextNode
			id={id}
			data={{
				status: "idle",
				config: { model },
				dynamicHandles: toolHandles,
			}}
			{...props}
			type="generate-text"
			onModelChange={(model) => setModel(model)}
			onCreateTool={handleCreateTool}
			onRemoveTool={handleRemoveTool}
			onUpdateTool={handleUpdateTool}
			onDeleteNode={() => {}}
		/>
	);
};

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNodeController,
};

const initialNodes = [
	{
		id: "node-1",
		type: "generate-text",
		position: { x: 0, y: -130 },
		data: {},
	},
];

export default function ResizableNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 200, zoom: 1.1 };

	const onNodesChange = useCallback(
		(changes: NodeChange<Node>[]) =>
			setNodes((nds) => applyNodeChanges(changes, nds)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange<never>[]) =>
			setEdges((eds) => applyEdgeChanges(changes, eds)),
		[],
	);
	const onConnect = useCallback(
		(connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
		[],
	);
	return (
		<div className="w-full max-w-[600px] h-[450px] border border-border rounded-md">
			<ReactFlowProvider>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					defaultViewport={defaultViewport}
					/* fitView */
				>
					<Background />
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	);
}
