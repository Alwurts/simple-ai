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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { TextInputNode as TTextInputNode } from "@/registry/blocks/flow-01/types/flow";
import { type NodeProps, NodeResizer, Position } from "@xyflow/react";
import { PenLine, Trash } from "lucide-react";
import type React from "react";
import { useCallback } from "react";

export function TextInputNode({
	id,
	selected,
	data,
	deletable,
}: NodeProps<TTextInputNode>) {
	const updateNode = useStore((state) => state.updateNode);

	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			updateNode(id, "text-input", { config: { value: e.target.value } });
		},
		[id, updateNode],
	);

	const executionStatus = data.executionState?.status || "idle";
	const statusColors = {
		idle: "bg-muted text-muted-foreground",
		processing: "bg-orange-500 text-white",
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
	};

	return (
		<BaseNode
			selected={selected}
			isProcessing={executionStatus === "processing"}
			className="px-0 pb-0 flex flex-col h-full"
			style={{ minHeight: 250, minWidth: 300 }}
		>
			<NodeResizer
				minWidth={250}
				maxWidth={800}
				minHeight={200}
				maxHeight={800}
				isVisible={selected}
			/>
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Text Input</NodeHeaderTitle>
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
			<div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
				<Textarea
					value={data.config.value || ""}
					onChange={handleTextChange}
					className="w-full flex-1 min-h-[150px] resize-none nodrag"
					placeholder="Enter your text here..."
				/>
			</div>
			<div className="flex justify-end pt-2 pb-4 text-sm">
				<LabeledHandle
					id="result"
					title="Result"
					type="source"
					position={Position.Right}
					className="justify-self-end"
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
