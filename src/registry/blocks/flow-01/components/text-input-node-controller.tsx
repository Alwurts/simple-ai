"use client";

import { useWorkflow } from "@/registry/hooks/flow/use-workflow";
import {
	TextInput,
	type TextInputNode,
} from "@/registry/ui/flow/text-input-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";

export function TextInputNodeController({
	id,
	data,
	...props
}: NodeProps<TextInputNode>) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handleTextChange = useCallback(
		(value: string) => {
			updateNode(id, "text-input", { config: { value } });
		},
		[id, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<TextInput
			id={id}
			data={data}
			{...props}
			onTextChange={handleTextChange}
			onDeleteNode={handleDeleteNode}
		/>
	);
}
