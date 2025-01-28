"use client";

import { useWorkflow } from "@/registry/hooks/flow/use-workflow";
import {
	VisualizeText,
	type VisualizeTextNode,
} from "@/registry/ui/flow/visualize-text-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";

export function VisualizeTextNodeController({
	id,
	data,
	...props
}: NodeProps<VisualizeTextNode>) {
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<VisualizeText
			id={id}
			data={data}
			{...props}
			onDeleteNode={handleDeleteNode}
		/>
	);
}
