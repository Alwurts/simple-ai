import { Position, type NodeProps } from "@xyflow/react";

import {
	type TModel,
	useStore,
	type TGenerateTextNode,
	MODELS,
} from "@/registry/blocks/flow-01/hooks/store";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { BaseNode } from "@/components/flow/base-node";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Bot, Trash } from "lucide-react";
import { useCallback } from "react";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function GenerateTextNode({
	id,
	selected,
	deletable,
	data,
}: NodeProps<TGenerateTextNode>) {
	const updateNode = useStore((state) => state.updateNode);

	const handleModelChange = useCallback(
		(value: string) => {
			updateNode(id, {
				model: value as TModel,
			});
		},
		[id, updateNode],
	);

	return (
		<BaseNode selected={selected} className="px-0 pb-0 flex flex-col">
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<Bot />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Generate Text</NodeHeaderTitle>
				<NodeHeaderActions>
					{deletable && <NodeHeaderDeleteAction id={id} />}
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-4">
				<Select value={data.model} onValueChange={handleModelChange}>
					<SelectTrigger className="w-full nodrag">
						<SelectValue placeholder="Select model" />
					</SelectTrigger>
					<SelectContent>
						{MODELS.map((model) => (
							<SelectItem key={model} value={model}>
								{model}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="grid grid-cols-2 gap-2 pt-2 pb-4 text-sm">
				<div className="flex flex-col gap-2">
					<LabeledHandle
						id="system"
						title="System"
						type="target"
						position={Position.Left}
					/>
					<LabeledHandle
						id="prompt"
						title="Prompt"
						type="target"
						position={Position.Left}
						className="col-span-2"
					/>
				</div>
				<div className="justify-self-end">
					<LabeledHandle
						id="output"
						title="Output"
						type="source"
						position={Position.Right}
					/>
				</div>
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
