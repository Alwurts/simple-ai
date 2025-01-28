import {
	type Node,
	type NodeProps,
	Position,
	useUpdateNodeInternals,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useStore } from "@/registry/hooks/flow/use-workflow";
import { BaseNode } from "@/registry/ui/flow/base-node";
import {
	EditableHandle,
	HandleEditor,
} from "@/registry/ui/flow/editable-handle";
import { LabeledHandle } from "@/registry/ui/flow/labeled-handle";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderStatus,
	NodeHeaderTitle,
} from "@/registry/ui/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/registry/ui/flow/node-header";
import { Bot, Plus, Trash } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import {
	ModelSelector,
	type Model,
} from "@/registry/ui/model-selector";

type GenerateTextData = {
	config: {
		model: Model;
	};
	dynamicHandles: {
		tools: {
			id: string;
			name: string;
			description?: string;
		}[];
	};
	executionState: NodeExecutionState;
};

export type GenerateTextNode = Node<GenerateTextData, "generate-text"> & {
	type: "generate-text";
};

export function GenerateTextNode({
	id,
	selected,
	deletable,
	data,
}: NodeProps<GenerateTextNode>) {
	const updateNode = useStore((state) => state.updateNode);
	const addDynamicHandle = useStore((state) => state.addDynamicHandle);
	const removeDynamicHandle = useStore((state) => state.removeDynamicHandle);
	const deleteNode = useStore((state) => state.deleteNode);
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

	const handleCreateTool = useCallback(
		(name: string, description?: string) => {
			if (!name) {
				toast.error("Tool name cannot be empty");
				return false;
			}

			const existingTool = data.dynamicHandles.tools.find(
				(tool) => tool.name === name,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}

			addDynamicHandle(id, "generate-text", "tools", {
				name,
				description,
			});
			updateNodeInternals(id);
			return true;
		},
		[id, data.dynamicHandles.tools, addDynamicHandle, updateNodeInternals],
	);

	const removeHandle = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "generate-text", "tools", handleId);
			updateNodeInternals(id);
		},
		[id, removeDynamicHandle, updateNodeInternals],
	);

	const updateTool = useCallback(
		(toolId: string, newName: string, newDescription?: string): boolean => {
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
		[id, data.dynamicHandles, updateNode, updateNodeInternals],
	);

	const executionStatus = data.executionState?.status;

	return (
		<BaseNode
			selected={selected}
			executionStatus={executionStatus}
			className="w-[350px]"
		>
			<NodeHeader>
				<NodeHeaderIcon>
					<Bot />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Generate Text</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderStatus status={executionStatus} />
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
			<div className="p-4 flex flex-col gap-4">
				<ModelSelector
					value={data.config.model}
					onChange={handleModelChange}
					disabledModels={[
						"gpt-4o",
						"gpt-4o-mini",
						"deepseek-r1-distill-llama-70b",
					]}
				/>
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
						id="result"
						title="Result"
						type="source"
						position={Position.Right}
					/>
				</div>
			</div>
			<div className="border-t border-border mt-2">
				<div>
					<div className="flex items-center justify-between py-2 px-4 bg-muted">
						<span className="text-sm font-medium">Tool outputs</span>
						<HandleEditor
							variant="create"
							label=""
							onSave={handleCreateTool}
							onCancel={() => {}}
							align="end"
						>
							<Button variant="outline" size="sm" className="h-7 px-2">
								<Plus className="h-4 w-4 mr-1" />
								New tool output
							</Button>
						</HandleEditor>
					</div>
					<div className="flex flex-col">
						{data.dynamicHandles.tools.map((tool) => (
							<EditableHandle
								key={tool.id}
								nodeId={id}
								handleId={tool.id}
								name={tool.name}
								description={tool.description}
								type="source"
								position={Position.Right}
								wrapperClassName="w-full"
								onNameChange={updateTool}
								onDelete={removeHandle}
							/>
						))}
					</div>
				</div>
			</div>
		</BaseNode>
	);
}
