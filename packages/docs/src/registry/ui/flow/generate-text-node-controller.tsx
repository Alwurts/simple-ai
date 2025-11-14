"use client";

import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useWorkflow } from "@/registry/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { GenerateTextNode } from "@/registry/ui/flow/generate-text-node";
import type { Model } from "@/registry/ui/model-selector";

export type GenerateTextNodeController = Omit<GenerateTextNode, "data"> & {
	type: "generate-text";
	data: Omit<GenerateTextNode["data"], "status"> & {
		executionState?: NodeExecutionState;
	};
};

export function GenerateTextNodeController({
	id,
	data,
	...props
}: NodeProps<GenerateTextNodeController>) {
	const updateNode = useWorkflow(state => state.updateNode);
	const addDynamicHandle = useWorkflow(state => state.addDynamicHandle);
	const removeDynamicHandle = useWorkflow(state => state.removeDynamicHandle);
	const deleteNode = useWorkflow(state => state.deleteNode);

	const handleModelChange = useCallback(
		(model: Model) => {
			updateNode(id, "generate-text", {
				config: {
					...data.config,
					model,
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
				tool => tool.name === name,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}
			addDynamicHandle(id, "generate-text", "tools", {
				name,
				description,
			});
			return true;
		},
		[id, data.dynamicHandles.tools, addDynamicHandle],
	);

	const handleRemoveTool = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "generate-text", "tools", handleId);
		},
		[id, removeDynamicHandle],
	);

	const handleUpdateTool = useCallback(
		(toolId: string, newName: string, newDescription?: string) => {
			if (!newName) {
				toast.error("Tool name cannot be empty");
				return false;
			}

			const existingTool = data.dynamicHandles.tools.find(
				tool => tool.name === newName && tool.id !== toolId,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}

			updateNode(id, "generate-text", {
				dynamicHandles: {
					...data.dynamicHandles,
					tools: data.dynamicHandles.tools.map(tool =>
						tool.id === toolId
							? {
									...tool,
									name: newName,
									description: newDescription,
								}
							: tool,
					),
				},
			});
			return true;
		},
		[id, data.dynamicHandles, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<GenerateTextNode
			id={id}
			data={{
				status: data.executionState?.status,
				config: data.config,
				dynamicHandles: data.dynamicHandles,
			}}
			{...props}
			disableModelSelector
			onModelChange={handleModelChange}
			onCreateTool={handleCreateTool}
			onRemoveTool={handleRemoveTool}
			onUpdateTool={handleUpdateTool}
			onDeleteNode={handleDeleteNode}
		/>
	);
}
