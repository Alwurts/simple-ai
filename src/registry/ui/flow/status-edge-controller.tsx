"use client";

import type { EdgeProps } from "@xyflow/react";
import type { EdgeExecutionState } from "@/registry/lib/flow/workflow-execution-engine";
import { StatusEdge } from "@/registry/ui/flow/status-edge";

export type StatusEdgeController = Omit<StatusEdge, "data"> & {
	type: "status";
	data: {
		executionState?: EdgeExecutionState;
	};
};

export function StatusEdgeController({
	data,
	...props
}: EdgeProps<StatusEdgeController>) {
	return (
		<StatusEdge
			{...props}
			data={{
				error: !!data.executionState?.error,
			}}
		/>
	);
}
