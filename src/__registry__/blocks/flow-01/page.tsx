"use client";

import { type NodeTypes, ReactFlowProvider } from "@xyflow/react";
import { ReactFlow, Background } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import { GenerateTextNode } from "@/registry/blocks/flow-01/components/flow/generate-text-node";
import { DevTools } from "@/components/flow/devtools";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNode,
};

export default function Flow01Page() {
	const store = useStore(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
		}),
		shallow,
	);

	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<ReactFlow
					nodes={store.nodes}
					edges={store.edges}
					onNodesChange={store.onNodesChange}
					onEdgesChange={store.onEdgesChange}
					onConnect={store.onConnect}
					nodeTypes={nodeTypes}
					fitView
				>
					<Background />
					<DevTools />
				</ReactFlow>
			</ReactFlowProvider>
		</div>
	);
}
