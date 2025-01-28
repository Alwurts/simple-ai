import { LabeledHandle } from "@/components/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { ResizableNode } from "@/registry/ui/flow/resizable-node";
import { type Node, type NodeProps, Position } from "@xyflow/react";
import { PenLine, Trash } from "lucide-react";

// Text Input

type TextInputConfig = {
	value: string;
};

export type TextInputData = {
	config: TextInputConfig;
	executionState?: NodeExecutionState;
};

export type TextInputNode = Node<TextInputData, "text-input"> & {
	type: "text-input";
};

export interface TextInputProps extends NodeProps<TextInputNode> {
	onTextChange: (value: string) => void;
	onDeleteNode: () => void;
}

export function TextInput({
	id,
	selected,
	data,
	deletable,
	onTextChange,
	onDeleteNode,
}: TextInputProps) {
	const executionStatus = data.executionState?.status;

	return (
		<ResizableNode
			id={id}
			selected={selected}
			className={cn("flex flex-col h-full", {
				"border-orange-500": executionStatus === "processing",
				"border-red-500": executionStatus === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Text Input</NodeHeaderTitle>
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
			<div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
				<Textarea
					value={data.config.value || ""}
					onChange={(e) => onTextChange(e.target.value)}
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
