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

import { ResizableNode } from "@/registry/ui/flow/resizable-node";
import { useCallback, useState } from "react";

const TextResizableNode = (props: NodeProps<Node>) => {
	return (
		<ResizableNode
			selected={props.selected}
			className="flex flex-col items-center justify-center p-4"
		>
			<span>Try to resize me</span>
		</ResizableNode>
	);
};

const nodeTypes: NodeTypes = {
	"text-resizable-node": TextResizableNode,
};

const initialNodes = [
	{
		id: "node-1",
		type: "text-resizable-node",
		position: { x: 0, y: 0 },
		data: { value: 123 },
	},
];

export default function ResizableNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 150, zoom: 1 };

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
		<div className="w-[600px] h-[600px] border border-border rounded-md">
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
