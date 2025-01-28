import {
	type Edge,
	type EdgeProps,
	BaseEdge as FlowBaseEdge,
	getBezierPath,
} from "@xyflow/react";
import type { CSSProperties } from "react";

export type StatusEdge = Edge<
	{
		error?: boolean;
	},
	"status"
> & {
	type: "status";
	sourceHandle: string;
	targetHandle: string;
};

export function StatusEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	selected,
}: EdgeProps<StatusEdge>) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edgeStyle: CSSProperties = {
		stroke: data?.error ? "#ef4444" : selected ? "#3b82f6" : "#b1b1b7",
		strokeWidth: selected ? 3 : 2,
		transition: "stroke 0.2s, stroke-width 0.2s",
	};

	return <FlowBaseEdge path={edgePath} style={edgeStyle} />;
}
