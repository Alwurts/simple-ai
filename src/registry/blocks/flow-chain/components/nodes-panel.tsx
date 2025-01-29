import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Eye, PenLine } from "lucide-react";
import type React from "react";

const nodeTypes = [
	{
		type: "visualize-text",
		label: "Visualize Text",
		icon: Eye,
	},
	{
		type: "text-input",
		label: "Text Input",
		icon: PenLine,
	},
];

export function NodesPanel() {
	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Panel position="top-center" className="flex gap-2">
			{nodeTypes.map((nodeType) => (
				<Button
					key={nodeType.type}
					variant="outline"
					className="cursor-grab"
					draggable
					onDragStart={(e) => onDragStart(e, nodeType.type)}
				>
					<nodeType.icon className="mr-2 h-4 w-4" />
					{nodeType.label}
				</Button>
			))}
		</Panel>
	);
}
