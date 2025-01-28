import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/registry/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { LabeledHandle } from "@/registry/ui/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/registry/ui/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/registry/ui/flow/node-header";
import { ResizableNode } from "@/registry/ui/flow/resizable-node";
import { type Node, type NodeProps, Position } from "@xyflow/react";
import { PenLine, Trash } from "lucide-react";
import type React from "react";
import { useCallback } from "react";

// Text Input

type TextInputConfig = {
	value: string;
};

export type TextInputData = {
	config: TextInputConfig;
	executionState: NodeExecutionState;
};

export type TextInputNode = Node<TextInputData, "text-input"> & {
	type: "text-input";
};

export function TextInput({
	id,
	selected,
	data,
	deletable,
}: NodeProps<TextInputNode>) {
	const updateNode = useStore((state) => state.updateNode);
	const deleteNode = useStore((state) => state.deleteNode);
	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			updateNode(id, "text-input", { config: { value: e.target.value } });
		},
		[id, updateNode],
	);

	const executionStatus = data.executionState?.status;
	return (
		<ResizableNode
			selected={selected}
			executionStatus={executionStatus}
			className="flex flex-col h-full"
		>
			<NodeHeader>
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Text Input</NodeHeaderTitle>
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
			<div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
				<Textarea
					value={data.config.value || ""}
					onChange={handleTextChange}
					className="w-full flex-1 resize-none nodrag nopan nowheel"
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
		</ResizableNode>
	);
}
