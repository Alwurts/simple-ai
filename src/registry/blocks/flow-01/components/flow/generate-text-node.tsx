import {
	type NodeProps,
	Position,
	useUpdateNodeInternals,
} from "@xyflow/react";

import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Bot, Plus, Trash } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { EditableToolHandle } from "@/registry/blocks/flow-01/components/flow/editable-tool-handle";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { GenerateTextNode as TGenerateTextNode } from "@/registry/blocks/flow-01/types/flow";
import { MODELS, type Model } from "@/registry/blocks/flow-01/types/ai";

export function GenerateTextNode({
	id,
	selected,
	deletable,
	data,
}: NodeProps<TGenerateTextNode>) {
	const updateNode = useStore((state) => state.updateNode);
	const addDynamicHandle = useStore((state) => state.addDynamicHandle);
	const removeDynamicHandle = useStore((state) => state.removeDynamicHandle);
	const runtime = useStore((state) => state.runtime);
	const isProcessing = runtime.isRunning && runtime.currentNodeIds.includes(id);
	const updateNodeInternals = useUpdateNodeInternals();

	const handleModelChange = useCallback(
		(value: string) => {
			updateNode(id, "generate-text", {
				config: {
					...data.config,
					model: value as Model,
				},
			});
		},
		[id, data.config, updateNode],
	);

	const addHandle = useCallback(() => {
		addDynamicHandle(id, "generate-text", "tools", {
			name: "",
			description: "",
		});
		updateNodeInternals(id);
	}, [id, addDynamicHandle, updateNodeInternals]);

	const removeHandle = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "generate-text", "tools", handleId);
			updateNodeInternals(id);
		},
		[id, removeDynamicHandle, updateNodeInternals],
	);

	const updateTool = useCallback(
		(toolId: string, newName: string, newDescription: string): boolean => {
			if (!newName) {
				toast.error("Tool name cannot be empty");
				return false;
			}

			const existingTool = data.dynamicHandles.tools.find(
				(tool) => tool.name === newName && tool.id !== toolId,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}

			updateNode(id, "generate-text", {
				config: {
					...data.config,
				},
				dynamicHandles: {
					...data.dynamicHandles,
					tools: data.dynamicHandles.tools.map((tool) =>
						tool.id === toolId
							? { ...tool, name: newName, description: newDescription }
							: tool,
					),
				},
			});
			updateNodeInternals(id);
			return true;
		},
		[id, data.dynamicHandles, data.config, updateNode, updateNodeInternals],
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
			isProcessing={isProcessing}
			className="px-0 pb-0 flex flex-col w-[350px]"
		>
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<Bot />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Generate Text</NodeHeaderTitle>
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
			<div className="p-4 flex flex-col gap-4">
				<Select value={data.config.model} onValueChange={handleModelChange}>
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
			<div className="grid grid-cols-[2fr,1fr] gap-2 pt-2 text-sm">
				<div className="flex flex-col gap-2 min-w-0">
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
						title="Result"
						type="source"
						position={Position.Right}
					/>
				</div>
			</div>
			<div className="border-t border-border mt-2">
				<div>
					<div className="flex items-center justify-between py-2 px-4 bg-muted">
						<span className="text-sm font-medium">Tools</span>
						<Button
							variant="outline"
							size="sm"
							className="h-7 px-2"
							onClick={addHandle}
						>
							<Plus className="h-4 w-4 mr-1" />
							New Tool
						</Button>
					</div>
					<div className="flex flex-col">
						{data.dynamicHandles.tools.map((tool) => (
							<EditableToolHandle
								key={tool.id}
								nodeId={id}
								handleId={tool.id}
								name={tool.name}
								description={tool.description}
								type="source"
								position={Position.Right}
								wrapperClassName="w-full"
								onToolChange={updateTool}
								onDelete={removeHandle}
							/>
						))}
					</div>
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
