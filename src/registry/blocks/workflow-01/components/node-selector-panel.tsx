import { Panel } from "@xyflow/react";
import { Bot, FileText, GitBranch, Square } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

const nodeTypes = [
	{
		type: "agent",
		label: "Agent",
		icon: Bot,
	},
	{
		type: "if-else",
		label: "If/Else",
		icon: GitBranch,
	},
	{
		type: "note",
		label: "Note",
		icon: FileText,
	},
	{
		type: "end",
		label: "End",
		icon: Square,
	},
];

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
