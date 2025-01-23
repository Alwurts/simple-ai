"use client";

import {
	Controls,
	MiniMap,
	type NodeTypes,
	ReactFlowProvider,
} from "@xyflow/react";
import { Background, Panel, ReactFlow, useReactFlow } from "@xyflow/react";
import type React from "react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { DevTools } from "@/components/flow/devtools";
import { Button } from "@/components/ui/button";
import { GenerateTextNode } from "@/registry/blocks/flow-01/components/flow/generate-text-node";
import { NodesPanel } from "@/registry/blocks/flow-01/components/flow/nodes-panel";
import { PromptCrafterNode } from "@/registry/blocks/flow-01/components/flow/prompt-crafter-node";
import { TextInputNode } from "@/registry/blocks/flow-01/components/flow/text-input-node";
import { VisualizeTextNode } from "@/registry/blocks/flow-01/components/flow/visualize-text-node";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";
import { prepareWorkflow } from "./lib/workflow";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNode,
	"visualize-text": VisualizeTextNode,
	"text-input": TextInputNode,
	"prompt-crafter": PromptCrafterNode,
};

function Flow() {
	const store = useStore(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
			runtime: store.runtime,
			//startExecution: store.startExecution,
			createNode: store.createNode,
		}),
		shallow,
	);

	const { screenToFlowPosition } = useReactFlow();

	const onDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	const onDrop = (event: React.DragEvent) => {
		event.preventDefault();

		const type = event.dataTransfer.getData(
			"application/reactflow",
		) as FlowNode["type"];

		// Check if the dropped element is valid
		if (!type) {
			return;
		}

		// Get the position of the drop
		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		store.createNode(type, position);
	};

	return (
		<ReactFlow
			nodes={store.nodes}
			edges={store.edges}
			onNodesChange={store.onNodesChange}
			onEdgesChange={store.onEdgesChange}
			onConnect={store.onConnect}
			nodeTypes={nodeTypes}
			onDragOver={onDragOver}
			onDrop={onDrop}
			fitView
		>
			<Background />
			<DevTools />
			<Controls />
			<MiniMap />
			<NodesPanel />
			<Panel position="top-right" className="flex gap-2 items-center">
				{store.runtime.currentNodeIds.length > 0 && (
					<div className="text-sm text-muted-foreground">
						Processing node: {store.runtime.currentNodeIds.join(", ")}
					</div>
				)}
				<Button
					onClick={() => {
						const workflow = prepareWorkflow(store.nodes, store.edges);
						console.log(workflow);
					}}
					disabled={store.runtime.isRunning}
				>
					{store.runtime.isRunning ? "Running..." : "Run Flow"}
				</Button>
			</Panel>
		</ReactFlow>
	);
}

export default function Flow01Page() {
	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>
		</div>
	);
}
