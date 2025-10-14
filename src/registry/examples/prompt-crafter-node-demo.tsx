"use client";

import "@xyflow/react/dist/style.css";

import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	type Connection,
	type EdgeChange,
	type Node,
	type NodeChange,
	type NodeProps,
	type NodeTypes,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { PromptCrafterNode } from "@/registry/ui/flow/prompt-crafter-node";

const PromptCrafterNodeController = ({
	id,
	data,
	...props
}: NodeProps<Node>) => {
	const [template, setTemplate] = useState("Hello {{name}}");
	const [dynamicHandles, setDynamicHandles] = useState({
		"template-tags": [
			{
				id: "name",
				name: "name",
			},
		],
	});

	const handleCreateInput = useCallback(
		(name: string) => {
			setDynamicHandles({
				...dynamicHandles,
				"template-tags": [
					...dynamicHandles["template-tags"],
					{ id: nanoid(), name },
				],
			});
			return true;
		},
		[dynamicHandles],
	);

	const handleRemoveInput = useCallback(() => {
		setDynamicHandles({
			...dynamicHandles,
			"template-tags": dynamicHandles["template-tags"].filter(
				(input) => input.id !== "name",
			),
		});
		return true;
	}, [dynamicHandles]);

	const handleUpdateInputName = useCallback(
		(handleId: string, newLabel: string) => {
			setDynamicHandles({
				...dynamicHandles,
				"template-tags": dynamicHandles["template-tags"].map((input) =>
					input.id === handleId
						? { ...input, name: newLabel }
						: input,
				),
			});
			return true;
		},
		[dynamicHandles],
	);

	return (
		<PromptCrafterNode
			id={id}
			data={{
				status: "success",
				config: {
					template,
				},
				dynamicHandles,
			}}
			{...props}
			type="prompt-crafter"
			onPromptTextChange={setTemplate}
			onCreateInput={handleCreateInput}
			onRemoveInput={handleRemoveInput}
			onUpdateInputName={handleUpdateInputName}
			onDeleteNode={() => {}}
		/>
	);
};

const nodeTypes: NodeTypes = {
	"prompt-crafter-node": PromptCrafterNodeController,
};

const initialNodes = [
	{
		id: "node-1",
		type: "prompt-crafter-node",
		position: { x: 0, y: -50 },
		data: {},
	},
];

export default function ResizableNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 100, zoom: 1.1 };

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
