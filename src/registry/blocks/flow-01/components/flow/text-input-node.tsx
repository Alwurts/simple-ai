import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { NodeHeaderIcon, NodeHeaderTitle } from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { TextInputNode as TTextInputNode } from "@/registry/blocks/flow-01/types/flow";
import { NodeHeaderDeleteAction } from "@/registry/blocks/flow-01/components/flow/node-header-delete-action";
import { StatusBadge } from "@/registry/blocks/flow-01/components/flow/status-badge";
import { type NodeProps, NodeResizer, Position } from "@xyflow/react";
import { PenLine } from "lucide-react";
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

	const executionStatus = data.executionState?.status;
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
					<StatusBadge status={executionStatus} />
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
