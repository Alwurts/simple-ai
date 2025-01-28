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

import { VisualizeTextNode } from "@/registry/ui/flow/visualize-text-node";
import { useCallback, useState } from "react";

const VisualizeTextNodeController = ({
	id,
	data,
	...props
}: NodeProps<Node>) => {
	return (
		<VisualizeTextNode
			id={id}
			data={{
				input:
					"### I support markdown\n\nVisualize text coming from other nodes\n\n- 1\n- 2\n- 3",
				status: "success",
			}}
			onDeleteNode={() => {}}
			{...props}
			type="visualize-text"
		/>
	);
};

const nodeTypes: NodeTypes = {
	"visualize-text": VisualizeTextNodeController,
};

const initialNodes = [
	{
		id: "node-1",
		type: "visualize-text",
		position: { x: 0, y: -50 },
		data: { value: 123 },
	},
];

export default function ResizableNodeDemo() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState([]);

	// Add default viewport configuration
	const defaultViewport = { x: 100, y: 150, zoom: 1.3 };

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
