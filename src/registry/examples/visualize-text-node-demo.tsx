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
	type NodeTypes,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { VisualizeTextNode } from "@/registry/ui/flow/visualize-text-node";

const nodeTypes: NodeTypes = {
	"visualize-text": VisualizeTextNode,
};

const initialNodes = [
	{
		id: "node-1",
		type: "visualize-text",
		position: { x: 0, y: -50 },
		data: {
			input: "### I support markdown\n\nVisualize text coming from other nodes\n\n- 1\n- 2\n- 3",
			status: "success",
		},
	},
];

export default function VisualizeTextNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 75, zoom: 1 };

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
