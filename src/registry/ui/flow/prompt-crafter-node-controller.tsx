"use client";

import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useWorkflow } from "@/registry/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { PromptCrafterNode } from "@/registry/ui/flow/prompt-crafter-node";

export type PromptCrafterNodeController = Omit<PromptCrafterNode, "data"> & {
	type: "prompt-crafter";
	data: Omit<PromptCrafterNode["data"], "status"> & {
		executionState?: NodeExecutionState;
	};
};

export function PromptCrafterNodeController({
	id,
	data,
	...props
}: NodeProps<PromptCrafterNodeController>) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const addDynamicHandle = useWorkflow((state) => state.addDynamicHandle);
	const removeDynamicHandle = useWorkflow(
		(state) => state.removeDynamicHandle,
	);
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handlePromptTextChange = useCallback(
		(value: string) => {
			updateNode(id, "prompt-crafter", { config: { template: value } });
		},
		[id, updateNode],
	);

	const handleCreateInput = useCallback(
		(name: string) => {
			if (!name) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === name,
			);
			if (existingInput) {
				toast.error("Input name already exists");
				return false;
			}

			addDynamicHandle(id, "prompt-crafter", "template-tags", {
				name,
			});
			return true;
		},
		[id, data.dynamicHandles, addDynamicHandle],
	);

	const handleRemoveInput = useCallback(
		(handleId: string) => {
			removeDynamicHandle(
				id,
				"prompt-crafter",
				"template-tags",
				handleId,
			);
		},
		[id, removeDynamicHandle],
	);

	const handleUpdateInputName = useCallback(
		(handleId: string, newLabel: string): boolean => {
			if (!newLabel) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === newLabel,
			);
			if (existingInput && existingInput.id !== handleId) {
				toast.error("Input name already exists");
				return false;
			}

			const oldInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.id === handleId,
			);
			if (!oldInput) {
				return false;
			}

			updateNode(id, "prompt-crafter", {
				config: {
					...data.config,
					template: (data.config.template || "").replace(
						new RegExp(`{{${oldInput.name}}}`, "g"),
						`{{${newLabel}}}`,
					),
				},
				dynamicHandles: {
					...data.dynamicHandles,
					"template-tags": (
						data.dynamicHandles["template-tags"] || []
					).map((input) =>
						input.id === handleId
							? { ...input, name: newLabel }
							: input,
					),
				},
			});
			return true;
		},
		[id, data.dynamicHandles, data.config, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<PromptCrafterNode
			id={id}
			data={{ ...data, status: data.executionState?.status }}
			{...props}
			onPromptTextChange={handlePromptTextChange}
			onCreateInput={handleCreateInput}
			onRemoveInput={handleRemoveInput}
			onUpdateInputName={handleUpdateInputName}
			onDeleteNode={handleDeleteNode}
		/>
	);
}
