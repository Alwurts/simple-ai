import { type Node, type NodeProps, Position } from "@xyflow/react";

import { Separator } from "@/components/ui/separator";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { BaseNodeData } from "@/registry/blocks/flow-01/types/flow";
import { LabeledHandle } from "@/registry/ui/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/registry/ui/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/registry/ui/flow/node-header";
import { ResizableNode } from "@/registry/ui/flow/resizable-node";
import { MarkdownContent } from "@/registry/ui/markdown-content";
import { Eye, Trash } from "lucide-react";

type VisualizeTextData = BaseNodeData;

export type VisualizeTextNode = Node<VisualizeTextData, "visualize-text"> & {
	type: "visualize-text";
};

export function VisualizeText({
	id,
	selected,
	data,
	deletable,
}: NodeProps<VisualizeTextNode>) {
	const deleteNode = useStore((state) => state.deleteNode);
	const executionStatus = data.executionState?.status;

	return (
		<ResizableNode
			selected={selected}
			executionStatus={executionStatus}
			className="flex flex-col"
		>
			<NodeHeader>
				<NodeHeaderIcon>
					<Eye />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
				<NodeHeaderActions>
					{deletable && (
						<NodeHeaderAction
							onClick={() => deleteNode(id)}
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
