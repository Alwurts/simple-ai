"use client";

import {
	Background,
	Controls,
	type EdgeTypes,
	MiniMap,
	type NodeTypes,
	ReactFlow,
	ReactFlowProvider,
	useOnSelectionChange,
	useReactFlow,
} from "@xyflow/react";
import { type DragEvent, useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Workflow } from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	AppHeader,
	AppHeaderIcon,
	AppHeaderSeparator,
	AppHeaderTitle,
} from "@/registry/blocks/workflow-01/components/app-header";
import {
	AppLayout,
	AppLayoutInset,
	AppLayoutSidebar,
} from "@/registry/blocks/workflow-01/components/app-layout";
import { Chat } from "@/registry/blocks/workflow-01/components/chat";
import { NodeEditorPanel } from "@/registry/blocks/workflow-01/components/node-editor-panel";
import { NodeSelectorPanel } from "@/registry/blocks/workflow-01/components/node-selector-panel";
import { ThemeToggle } from "@/registry/blocks/workflow-01/components/theme-toggle";
import { ValidationStatus } from "@/registry/blocks/workflow-01/components/validation-status";
import { AgentNode } from "@/registry/blocks/workflow-01/components/workflow/agent-node";
import { EndNode } from "@/registry/blocks/workflow-01/components/workflow/end-node";
import { IfElseNode } from "@/registry/blocks/workflow-01/components/workflow/if-else-node";
import { NoteNode } from "@/registry/blocks/workflow-01/components/workflow/note-node";
import { StartNode } from "@/registry/blocks/workflow-01/components/workflow/start-node";
import { StatusEdge } from "@/registry/blocks/workflow-01/components/workflow/status-edge";
import { DEFAULT_TEMPLATE } from "@/registry/blocks/workflow-01/lib/templates";
import { WORKFLOW_TOOL_DESCRIPTIONS } from "@/registry/blocks/workflow-01/lib/tools";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/lib/workflow/messages";
import type { FlowNode } from "@/registry/blocks/workflow-01/lib/workflow/types";
import { useWorkflow } from "@/registry/blocks/workflow-01/workflow/use-workflow";

const nodeTypes: NodeTypes = {
	start: StartNode,
	agent: AgentNode,
	end: EndNode,
	"if-else": IfElseNode,
	note: NoteNode,
};

const edgeTypes: EdgeTypes = {
	status: StatusEdge,
};

export function Flow() {
	const { theme } = useTheme();
	const store = useWorkflow(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
			createNode: store.createNode,
			initializeWorkflow: store.initializeWorkflow,
			updateNode: store.updateNode,
		}),
		shallow,
	);

	const [selectedNodes, setSelectedNodes] = useState<FlowNode[]>([]);

	const { messages, sendMessage, status, stop, setMessages } =
		useChat<WorkflowUIMessage>({
			transport: new DefaultChatTransport({
				api: "/api/workflow",
			}),
			onData: (dataPart) => {
				if (dataPart.type === "data-node-execution-status") {
					store.updateNode({
						id: dataPart.data.nodeId,
						nodeType: dataPart.data.nodeType,
						data: { status: dataPart.data.status },
					});

					if (
						dataPart.data.status === "error" &&
						dataPart.data.error
					) {
						console.error(
							`Node ${dataPart.data.nodeId} error:`,
							dataPart.data.error,
						);
					}
				}
			},
		});

	const isLoading = status === "streaming" || status === "submitted";

	useOnSelectionChange({
		onChange: ({ nodes }) => {
			setSelectedNodes(nodes as FlowNode[]);
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to initialize the workflow only once
	useEffect(() => {
		store.initializeWorkflow({
			nodes: DEFAULT_TEMPLATE.nodes,
			edges: DEFAULT_TEMPLATE.edges,
		});
	}, []);

	const { screenToFlowPosition } = useReactFlow();

	const onDragOver = useCallback((event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: DragEvent) => {
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
		},
		[screenToFlowPosition, store.createNode],
	);

	return (
		<AppLayout>
			<AppLayoutInset>
				<AppHeader>
					<AppHeaderIcon>
						<Workflow />
					</AppHeaderIcon>
					<AppHeaderTitle className="ml-2">
						Workflow Builder
					</AppHeaderTitle>
					<AppHeaderSeparator />
					<ThemeToggle />
					<ValidationStatus />
					<SidebarTrigger className="ml-auto" />
				</AppHeader>

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
					colorMode={theme === "dark" ? "dark" : "light"}
					nodesDraggable={!isLoading}
					nodesConnectable={!isLoading}
					nodesFocusable={!isLoading}
					edgesFocusable={!isLoading}
					elementsSelectable={!isLoading}
				>
					<Background />
					<Controls />
					<MiniMap />
					<NodeSelectorPanel />

					{selectedNodes.length === 1 && (
						<NodeEditorPanel
							nodeId={selectedNodes[0].id}
							toolDescriptions={WORKFLOW_TOOL_DESCRIPTIONS}
						/>
					)}
				</ReactFlow>
			</AppLayoutInset>
			<AppLayoutSidebar>
				<Chat
					messages={messages}
					sendMessage={sendMessage}
					status={status}
					stop={stop}
					setMessages={setMessages}
				/>
			</AppLayoutSidebar>
		</AppLayout>
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
