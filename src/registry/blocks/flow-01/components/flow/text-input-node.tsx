import { Position, type NodeProps } from "@xyflow/react";
import type React from "react";
import { useCallback } from "react";
import {
	useStore,
	type TTextInputNode,
} from "@/registry/blocks/flow-01/hooks/store";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { BaseNode } from "@/components/flow/base-node";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { PenLine, Trash } from "lucide-react";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { Separator } from "@/components/ui/separator";

export function TextInputNode({
	id,
	selected,
	data,
}: NodeProps<TTextInputNode>) {
	const updateNode = useStore((state) => state.updateNode);

	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			updateNode(id, { text: e.target.value });
		},
		[id, updateNode],
	);

	return (
		<BaseNode selected={selected} className="px-0 pb-0 flex flex-col">
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Text Input</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderDeleteAction id={id} />
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 w-[300px]">
				<textarea
					value={data.text || ""}
					onChange={handleTextChange}
					className="w-full h-[150px] resize-none border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring"
					placeholder="Enter your text here..."
				/>
			</div>
			<div className="flex justify-end py-2 text-sm">
				<LabeledHandle
					id="output"
					title="Output"
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
