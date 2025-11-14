"use client";

import {
	Background,
	Controls,
	type EdgeTypes,
	MiniMap,
	type NodeTypes,
	Panel,
	ReactFlow,
	ReactFlowProvider,
	useReactFlow,
} from "@xyflow/react";
import { type DragEvent, useEffect } from "react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { ErrorIndicator } from "@/registry/blocks/flow-orchestrator/components/error-indicator";
import { NodesPanel } from "@/registry/blocks/flow-orchestrator/components/nodes-panel";
import { DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW } from "@/registry/blocks/flow-orchestrator/lib/developer-tasks-orchestrator";
import { useWorkflow } from "@/registry/hooks/flow/use-workflow";
import type { FlowNode } from "@/registry/lib/flow/workflow";
import { GenerateTextNodeController } from "@/registry/ui/flow/generate-text-node-controller";
import { PromptCrafterNodeController } from "@/registry/ui/flow/prompt-crafter-node-controller";
import { StatusEdgeController } from "@/registry/ui/flow/status-edge-controller";
import { TextInputNodeController } from "@/registry/ui/flow/text-input-node-controller";
import { VisualizeTextNodeController } from "@/registry/ui/flow/visualize-text-node-controller";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNodeController,
	"visualize-text": VisualizeTextNodeController,
	"text-input": TextInputNodeController,
	"prompt-crafter": PromptCrafterNodeController,
};

const edgeTypes: EdgeTypes = {
	status: StatusEdgeController,
};

export function Flow() {
	const store = useWorkflow(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
			startExecution: store.startExecution,
			createNode: store.createNode,
			workflowExecutionState: store.workflowExecutionState,
			initializeWorkflow: store.initializeWorkflow,
		}),
		shallow,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to initialize the workflow only once
	useEffect(() => {
		store.initializeWorkflow(
			DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW.nodes,
			DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW.edges,
		);
	}, []);

	const { screenToFlowPosition } = useReactFlow();

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		const type = event.dataTransfer.getData(
			"application/reactflow",
		) as FlowNode["type"];

		if (!type) {
			return;
		}

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		store.createNode(type, position);
	};

	const onStartExecution = async () => {
		const result = await store.startExecution();
		if (result.status === "error") {
			console.error(result.error);
		}
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
			<Controls />
			<MiniMap />
			<NodesPanel />
			<Panel position="top-right" className="flex gap-2 items-center">
				<ErrorIndicator errors={store.workflowExecutionState.errors} />
				<Button
					onClick={onStartExecution}
					title={
						store.workflowExecutionState.timesRun > 1
							? "Disabled for now"
							: "Run the workflow"
					}
					disabled={
						store.workflowExecutionState.errors.length > 0 ||
						store.workflowExecutionState.isRunning ||
						store.workflowExecutionState.timesRun > 1
					}
				>
					{store.workflowExecutionState.isRunning
						? "Running..."
						: "Run Flow"}
				</Button>
			</Panel>
		</ReactFlow>
	);
}

export default function Page() {
	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>
		</div>
	);
}
