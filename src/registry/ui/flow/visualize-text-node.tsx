import { type Node, type NodeProps, Position } from "@xyflow/react";

import { LabeledHandle } from "@/components/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { ResizableNode } from "@/registry/ui/flow/resizable-node";
import { MarkdownContent } from "@/registry/ui/markdown-content";
import { Eye, Trash } from "lucide-react";

type VisualizeTextData = {
	executionState?: NodeExecutionState;
};

export type VisualizeTextNode = Node<VisualizeTextData, "visualize-text"> & {
	type: "visualize-text";
};

export interface VisualizeTextProps extends NodeProps<VisualizeTextNode> {
	onDeleteNode: () => void;
}

export function VisualizeText({
	id,
	selected,
	data,
	deletable,
	onDeleteNode,
}: VisualizeTextProps) {
	const executionStatus = data.executionState?.status;

	return (
		<ResizableNode
			selected={selected}
			className={cn("flex flex-col", {
				"border-orange-500": executionStatus === "processing",
				"border-red-500": executionStatus === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<Eye />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
				<NodeHeaderActions>
					{deletable && (
						<NodeHeaderAction
							onClick={onDeleteNode}
							variant="ghost"
							label="Delete node"
						>
							<Trash />
						</NodeHeaderAction>
					)}
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 flex-1 overflow-auto flex flex-col">
				<div className="flex-1 overflow-auto nodrag nopan nowheel border border-border rounded-md p-2 select-text cursor-auto">
					<MarkdownContent
						id={id}
						content={
							data.executionState?.targets?.input
								? data.executionState?.targets?.input
								: "No text to display"
						}
					/>
				</div>
			</div>
			<div className="flex justify-start pt-2 pb-4 text-sm">
				<LabeledHandle
					id="input"
					title="Input"
					type="target"
					position={Position.Left}
				/>
			</div>
		</ResizableNode>
	);
}
