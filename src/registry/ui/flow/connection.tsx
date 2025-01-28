import type { BaseFlowEdgeData } from "@/registry/blocks/flow-01/types/flow";
import {
	BaseEdge,
	type Edge,
	type EdgeProps,
	getBezierPath,
} from "@xyflow/react";
import type { CSSProperties } from "react";

type ConnectionEdgeData = BaseFlowEdgeData;

export type ConnectionEdge = Edge<ConnectionEdgeData, "connection"> & {
	type: "connection";
	sourceHandle: string;
	targetHandle: string;
};

export function Connection({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	selected,
}: EdgeProps<ConnectionEdge>) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edgeStyle: CSSProperties = {
		stroke: data?.executionState?.error
			? "#ef4444"
			: selected
				? "#3b82f6"
				: "#b1b1b7",
		strokeWidth: selected ? 3 : 2,
		transition: "stroke 0.2s, stroke-width 0.2s",
	};

	return <BaseEdge path={edgePath} style={edgeStyle} />;
}
