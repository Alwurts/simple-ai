"use client";

import { type NodeTypes, ReactFlowProvider } from "@xyflow/react";
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
import type { AppNode } from "@/registry/blocks/flow-01/hooks/store";
import { nanoid } from "nanoid";

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
			startExecution: store.startExecution,
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

		const type = event.dataTransfer.getData("application/reactflow");

		// Check if the dropped element is valid
		if (!type) {
			return;
		}

		// Get the position of the drop
		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		let newNode: AppNode;

		switch (type) {
			case "generate-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						config: { model: "gpt-4o" },
					},
				};
				break;
			case "prompt-crafter":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
						inputs: [],
					},
				};
				break;
			case "visualize-text":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
					},
				};
				break;
			case "text-input":
				newNode = {
					id: nanoid(),
					type,
					position,
					data: {
						text: "",
					},
				};
				break;
			default:
				return;
		}

		store.onNodesChange([
			{
				type: "add",
				item: newNode,
			},
		]);
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
			<NodesPanel />
			<Panel position="top-right" className="flex gap-2 items-center">
				{store.runtime.currentNodeId && (
					<div className="text-sm text-muted-foreground">
						Processing node: {store.runtime.currentNodeId}
					</div>
				)}
				<Button
					onClick={() => store.startExecution()}
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
