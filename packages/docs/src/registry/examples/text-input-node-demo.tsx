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

import { useCallback, useState } from "react";
import { TextInputNode } from "@/registry/ui/flow/text-input-node";

const TextInputNodeController = ({ id, data, ...props }: NodeProps<Node>) => {
	const [value, setValue] = useState("Hello World!");

	return (
		<TextInputNode
			id={id}
			data={{
				status: "idle",
				config: { value },
			}}
			{...props}
			type="text-input"
			onTextChange={value => setValue(value)}
			onDeleteNode={() => {}}
		/>
	);
};

const nodeTypes: NodeTypes = {
	"text-input": TextInputNodeController,
};

const initialNodes = [
	{
		id: "node-1",
		type: "text-input",
		position: { x: 0, y: -50 },
		data: {},
	},
];

export default function ResizableNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 120, zoom: 1.2 };

	const onNodesChange = useCallback(
		(changes: NodeChange<Node>[]) =>
			setNodes(nds => applyNodeChanges(changes, nds)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange<never>[]) =>
			setEdges(eds => applyEdgeChanges(changes, eds)),
		[],
	);
	const onConnect = useCallback(
		(connection: Connection) => setEdges(eds => addEdge(connection, eds)),
		[],
	);
	return (
		<div className="w-full h-full">
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
