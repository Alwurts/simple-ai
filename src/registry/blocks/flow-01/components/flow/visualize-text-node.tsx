import { type NodeProps, NodeResizer, Position } from "@xyflow/react";

import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	type TVisualizeTextNode,
	useStore,
} from "@/registry/blocks/flow-01/hooks/store";
import { MarkdownContent } from "@/registry/ui/markdown-content";
import { Eye, Trash } from "lucide-react";
import { useCallback } from "react";

export function VisualizeTextNode({
	id,
	selected,
	data,
	deletable,
}: NodeProps<TVisualizeTextNode>) {
	const runtime = useStore((state) => state.runtime);
	const isProcessing = runtime.isRunning && runtime.currentNodeIds.includes(id);

	const executionStatus = data.lastRun?.status || "idle";
	const statusColors = {
		idle: "bg-muted text-muted-foreground",
		processing: "bg-orange-500 text-white",
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
	} as const;

	return (
		<BaseNode
			selected={selected}
			isProcessing={isProcessing}
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
					<Badge
						variant="secondary"
						className={cn("mr-2 font-normal", statusColors[executionStatus])}
					>
						{executionStatus}
					</Badge>
					{deletable && <NodeHeaderDeleteAction id={id} />}
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 flex-1 overflow-auto flex flex-col">
				<div className="flex-1 overflow-auto nodrag nopan nowheel border border-border rounded-md p-2 select-text cursor-auto">
					<MarkdownContent
						id={id}
						content={
							data.lastRun?.inputs.length
								? data.lastRun?.inputs
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

const NodeHeaderDeleteAction = ({ id }: { id: string }) => {
	const deleteNode = useStore((state) => state.deleteNode);
	const handleClick = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<NodeHeaderAction onClick={handleClick} variant="ghost" label="Delete node">
			<Trash />
		</NodeHeaderAction>
	);
};
