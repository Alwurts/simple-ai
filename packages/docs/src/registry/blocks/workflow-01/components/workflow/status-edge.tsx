import {
	type Edge,
	type EdgeProps,
	BaseEdge as FlowBaseEdge,
	getBezierPath,
} from "@xyflow/react";
import type { CSSProperties } from "react";
import type { ValidationError } from "@/registry/blocks/workflow-01/types/workflow";

export type StatusEdgeData = {
	execution?: {
		error?: {
			type: string;
			message: string;
			[key: string]: unknown;
		};
	};
	validationErrors?: ValidationError[];
};

export type StatusEdge = Edge<StatusEdgeData, "status">;

export interface StatusEdgeProps extends EdgeProps<StatusEdge> {}

export function StatusEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	selected,
}: StatusEdgeProps) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const validationErrors = data?.validationErrors || [];
	const hasValidationError = validationErrors.length > 0;

	const getEdgeColor = () => {
		if (hasValidationError) {
			return "#ef4444";
		}
		// Execution errors
		if (data?.execution?.error) {
			return "#f97316";
		}
		// Selected state
		if (selected) {
			return "#3b82f6";
		}
		return "#b1b1b7";
	};

	const edgeStyle: CSSProperties = {
		stroke: getEdgeColor(),
		strokeWidth: hasValidationError ? 3 : selected ? 3 : 2,
		strokeDasharray: hasValidationError ? "5,5" : "0",
		transition: "stroke 0.2s, stroke-width 0.2s, stroke-dasharray 0.2s",
	};

	return <FlowBaseEdge path={edgePath} style={edgeStyle} />;
}
