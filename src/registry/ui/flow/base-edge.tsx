import type { CustomFlowEdge } from "@/registry/blocks/flow-01/types/flow";
import {
	BaseEdge as BaseFlowEdge,
	type EdgeProps,
	getBezierPath,
} from "@xyflow/react";
import type { CSSProperties } from "react";

export function CustomEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	selected,
}: EdgeProps<CustomFlowEdge>) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edgeStyle: CSSProperties = {
		stroke: !data?.executionState?.error
			? "#ef4444"
			: selected
				? "#3b82f6"
				: "#b1b1b7",
		strokeWidth: selected ? 3 : 2,
		transition: "stroke 0.2s, stroke-width 0.2s",
	};

	return <BaseFlowEdge path={edgePath} style={edgeStyle} />;
}
