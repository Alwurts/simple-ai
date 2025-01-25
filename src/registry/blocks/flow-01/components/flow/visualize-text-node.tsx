import { type NodeProps, NodeResizer, Position } from "@xyflow/react";

import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { NodeHeaderIcon, NodeHeaderTitle } from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Separator } from "@/components/ui/separator";
import { NodeHeaderDeleteAction } from "@/registry/blocks/flow-01/components/flow/node-header-delete-action";
import { StatusBadge } from "@/registry/blocks/flow-01/components/flow/status-badge";
import type { VisualizeTextNode as TVisualizeTextNode } from "@/registry/blocks/flow-01/types/flow";
import { MarkdownContent } from "@/registry/ui/markdown-content";
import { Eye } from "lucide-react";

export function VisualizeTextNode({
	id,
	selected,
	data,
	deletable,
}: NodeProps<TVisualizeTextNode>) {
	const executionStatus = data.executionState?.status;

	return (
		<BaseNode
			selected={selected}
			isProcessing={executionStatus === "processing"}
			className="px-0 pb-0 flex flex-col h-full"
			style={{ minHeight: 250, minWidth: 300, maxHeight: 800, maxWidth: 800 }}
		>
			<NodeResizer
				nodeId={id}
				minWidth={250}
				maxWidth={800}
				minHeight={200}
				maxHeight={800}
				isVisible={selected}
				//lineClassName="border-blue-400"
				//handleClassName="bg-white border-2 border-blue-400 rounded-sm h-3 w-3"
			/>
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<Eye />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
				<NodeHeaderActions>
					<StatusBadge status={executionStatus} />
					{deletable && <NodeHeaderDeleteAction id={id} />}
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
		</BaseNode>
	);
}
