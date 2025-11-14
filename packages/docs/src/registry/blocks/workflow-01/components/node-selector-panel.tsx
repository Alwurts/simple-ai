import { Panel } from "@xyflow/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { getAllNodeDefinitions } from "@/registry/blocks/workflow-01/lib/workflow/nodes";

const nodeDefinitions = getAllNodeDefinitions().filter(
	(def) => def.shared.type !== "start",
);
const nodeTypes = nodeDefinitions.map((def) => ({
	type: def.shared.type,
	label: def.client.meta.label,
	icon: def.client.meta.icon,
}));

export function NodeSelectorPanel() {
	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Panel
			position="top-left"
			className="bg-card p-4 rounded-lg shadow-md border w-64"
		>
			<div className="flex flex-col gap-2">
				<h3 className="font-semibold text-sm mb-2">Add Nodes</h3>
				<div className="flex flex-col gap-2">
					{nodeTypes.map((nodeType) => (
						<Button
							key={nodeType.type}
							variant="outline"
							className="cursor-grab justify-start text-left"
							draggable
							onDragStart={(e) => onDragStart(e, nodeType.type)}
						>
							<nodeType.icon className="mr-2" />
							{nodeType.label}
						</Button>
					))}
				</div>
			</div>
		</Panel>
	);
}
