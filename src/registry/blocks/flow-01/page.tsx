"use client";

import { type NodeTypes, ReactFlowProvider } from "@xyflow/react";
import { ReactFlow, Background, Panel } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { DevTools } from "@/components/flow/devtools";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import { GenerateTextNode } from "@/registry/blocks/flow-01/components/flow/generate-text-node";
import { VisualizeTextNode } from "@/registry/blocks/flow-01/components/flow/visualize-text-node";
import { TextInputNode } from "@/registry/blocks/flow-01/components/flow/text-input-node";
import { PromptCrafterNode } from "@/registry/blocks/flow-01/components/flow/prompt-crafter-node";
import { Button } from "@/components/ui/button";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNode,
	"visualize-text": VisualizeTextNode,
	"text-input": TextInputNode,
	"prompt-crafter": PromptCrafterNode,
};

export default function Flow01Page() {
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
			</ReactFlowProvider>
		</div>
	);
}
