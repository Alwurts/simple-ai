"use client";

import "@xyflow/react/dist/style.css";

import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";

import { StatusEdge } from "@/registry/ui/flow/status-edge";

const defaultNodes = [
	{
		id: "1",
		position: { x: 200, y: 200 },
		data: { label: "Node" },
	},
	{
		id: "2",
		position: { x: 400, y: 400 },
		data: { label: "Node" },
	},
];

const defaultEdges = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		type: "status",
		data: {
			error: true,
		},
	},
];

const edgeTypes = {
	status: StatusEdge,
};

export default function StatusEdgeDemo() {
	const defaultViewport = { x: -150, y: -50, zoom: 1.1 };

	return (
		<div className="w-[600px] h-[600px] border border-border rounded-md">
			<ReactFlowProvider>
				<ReactFlow
					defaultNodes={defaultNodes}
					defaultEdges={defaultEdges}
					edgeTypes={edgeTypes}
					defaultViewport={defaultViewport}
				>
					<Background />
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	);
}
