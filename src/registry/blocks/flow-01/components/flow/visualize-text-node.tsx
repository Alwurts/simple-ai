import { type NodeProps, Position } from "@xyflow/react";

import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Separator } from "@/components/ui/separator";
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
	const isProcessing = runtime.isRunning && runtime.currentNodeId === id;

	return (
		<BaseNode
			selected={selected}
			isProcessing={isProcessing}
			className="px-0 pb-0 flex flex-col"
		>
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<Eye />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
				<NodeHeaderActions>
					{deletable && <NodeHeaderDeleteAction id={id} />}
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 h-[250px] w-[300px] overflow-y-auto flex flex-col">
				<div className="flex-1 border border-border rounded-md p-2">
					<MarkdownContent
						id={id}
						content={data.text || "No text to display"}
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
