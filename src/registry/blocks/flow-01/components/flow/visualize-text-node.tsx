import { Position, type NodeProps } from "@xyflow/react";

import {
	useStore,
	type TVisualizeTextNode,
} from "@/registry/blocks/flow-01/hooks/store";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { BaseNode } from "@/components/flow/base-node";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Eye, Trash } from "lucide-react";
import { useCallback } from "react";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { Separator } from "@/components/ui/separator";
import { MarkdownContent } from "@/registry/ui/markdown-content";

export function VisualizeTextNode({
	id,
	selected,
	data,
	deletable,
}: NodeProps<TVisualizeTextNode>) {
	return (
		<BaseNode selected={selected} className="px-0 pb-0 flex flex-col">
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
