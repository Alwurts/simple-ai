import { BaseEdge, type EdgeProps, getBezierPath } from "@xyflow/react";
import type { CSSProperties } from "react";
import type {
	CustomFlowEdge,
	FlowEdge,
} from "@/registry/blocks/flow-01/types/flow";

export function CustomEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style,
	markerEnd,
	data,
}: EdgeProps<CustomFlowEdge>) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const flowEdgeData = data as FlowEdge["data"];
	const hasError = flowEdgeData?.executionState?.error !== undefined;

	const edgeStyle: CSSProperties = {
		...(style as CSSProperties),
		stroke: hasError ? "#ef4444" : "#b1b1b7",
		strokeWidth: hasError ? 3 : 2,
	};

	return <BaseEdge path={edgePath} style={edgeStyle} markerEnd={markerEnd} />;
}
