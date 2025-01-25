"use client";

import {
	Controls,
	type EdgeTypes,
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CustomEdge } from "@/registry/blocks/flow-01/components/flow/custom-edge";
import { GenerateTextNode } from "@/registry/blocks/flow-01/components/flow/generate-text-node";
import { NodesPanel } from "@/registry/blocks/flow-01/components/flow/nodes-panel";
import { PromptCrafterNode } from "@/registry/blocks/flow-01/components/flow/prompt-crafter-node";
import { TextInputNode } from "@/registry/blocks/flow-01/components/flow/text-input-node";
import { VisualizeTextNode } from "@/registry/blocks/flow-01/components/flow/visualize-text-node";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";
import type { WorkflowError } from "@/registry/blocks/flow-01/types/workflow";
import { AlertCircle, Copy } from "lucide-react";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNode,
	"visualize-text": VisualizeTextNode,
	"text-input": TextInputNode,
	"prompt-crafter": PromptCrafterNode,
};

const edgeTypes: EdgeTypes = {
	"custom-edge": CustomEdge,
};

function ErrorIndicator({
	errors,
}: { errors: WorkflowError[] }): React.ReactElement | null {
	if (errors.length === 0) {
		return null;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="text-red-500">
					<AlertCircle className="h-5 w-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="center" className="w-80 mt-4 mr-4">
				<div className="space-y-2">
					<h4 className="font-medium">Workflow Errors</h4>
					<div className="space-y-1">
						{errors.map((error) => (
							<div
								key={`${error.type}-${error.message}`}
								className="text-sm text-red-500"
							>
								{error.message}
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

function Flow() {
	const store = useStore(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
			startExecution: store.startExecution,
			createNode: store.createNode,
			workflowExecutionState: store.workflowExecutionState,
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

	const handleExport = () => {
		const exportData = {
			nodes: store.nodes.map((node) => ({
				type: node.type,
				id: node.id,
				data: {
					...node.data,
					executionState: undefined,
				},
				position: node.position,
				width: node.width,
				height: node.height,
			})),
			edges: store.edges.map((edge) => ({
				...edge,
				data: {
					...edge.data,
					executionState: undefined,
				},
			})),
		};
		navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
	};

	return (
		<ReactFlow
			nodes={store.nodes}
			edges={store.edges}
			onNodesChange={store.onNodesChange}
			onEdgesChange={store.onEdgesChange}
			onConnect={store.onConnect}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
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
				<ErrorIndicator errors={store.workflowExecutionState.errors} />
				<Button
					onClick={handleExport}
					variant="outline"
					className="flex gap-2 items-center"
				>
					<Copy className="h-4 w-4" />
					Export Flow
				</Button>
				<Button
					onClick={() => {
						store.startExecution();
					}}
					disabled={
						store.workflowExecutionState.errors.length > 0 ||
						store.workflowExecutionState.isRunning
					}
				>
					{store.workflowExecutionState.isRunning ? "Running..." : "Run Flow"}
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
