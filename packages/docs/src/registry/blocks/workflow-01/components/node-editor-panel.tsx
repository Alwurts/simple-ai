import { Panel } from "@xyflow/react";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";
import { getNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import type { FlowNode } from "@/registry/blocks/workflow-01/types/workflow";

export function NodeEditorPanel({ nodeId }: { nodeId: FlowNode["id"] }) {
	const node = useWorkflow(state => state.getNodeById(nodeId));
	if (!node) {
		return <NodeEditorPanelNotFound />;
	}

	if (node.type === "note") {
		return null;
	}

	const definition = getNodeDefinition(node.type);
	if (!definition) {
		return <NodeEditorPanelNotFound />;
	}

	const PanelComponent = definition.client.panelComponent;

	return (
		<Panel
			position="top-right"
			className="bg-card p-4 rounded-lg shadow-md border w-96 max-h-[calc(100vh-5rem)] overflow-y-auto"
		>
			<h3 className="font-semibold text-sm mb-3 capitalize">
				{node.type} Node
			</h3>
			<PanelComponent node={node} />
		</Panel>
	);
}

function NodeEditorPanelNotFound() {
	return (
		<Panel
			position="top-right"
			className="bg-card p-4 rounded-lg shadow-md border w-96 max-h-[calc(100vh-4rem)] overflow-y-auto"
		>
			<div>Node not found</div>
		</Panel>
	);
}
