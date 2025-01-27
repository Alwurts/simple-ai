import type { RefObject } from "react";
import { useEffect } from "react";

interface WorkflowStep {
	nodes: string[];
	paths: string[];
}

interface WorkflowDefinition {
	steps: WorkflowStep[];
}

interface UseWorkflowAnimationProps {
	delay?: number;
	workflows: WorkflowDefinition[];
	svgRef: RefObject<SVGSVGElement>;
}

const NODE_HIGHLIGHT_STROKE_WIDTH = 2;
const NODE_HIGHLIGHT_STROKE_COLOR = "#a818d4";
const PATH_HIGHLIGHT_STROKE_COLOR = "#a818d4";

export const EVENT_NODE_STROKE_COLOR = "#DB0801";
export const EVENT_NODE_FILL_COLOR = "#FFC8C0";
export const TASK_NODE_STROKE_COLOR = "#50C645";
export const TASK_NODE_FILL_COLOR = "#BCF1B9";
export const GATEWAY_NODE_STROKE_COLOR = "#DB7501";
export const GATEWAY_NODE_FILL_COLOR = "#FFE0AD";

// Reset all elements to default styles

// Highlight a specific step
const highlightStep = (svg: SVGSVGElement, step: WorkflowStep) => {
	// Highlight nodes
	for (const nodeId of step.nodes) {
		const element = svg.getElementById(nodeId) as SVGElement | null;
		if (element) {
			element.style.strokeWidth = `${NODE_HIGHLIGHT_STROKE_WIDTH}`;
			element.style.stroke = NODE_HIGHLIGHT_STROKE_COLOR;
		}
	}

	// Highlight paths
	for (const pathId of step.paths) {
		const element = svg.getElementById(pathId) as SVGElement | null;
		if (element) {
			element.style.fill = PATH_HIGHLIGHT_STROKE_COLOR;
		}
	}
};

// Sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useWorkflowAnimation({
	delay = 500,
	workflows,
	svgRef,
}: UseWorkflowAnimationProps) {
	useEffect(() => {
		const svg = svgRef.current;
		if (!svg || workflows.length === 0) {
			return;
		}

		// Reset all elements to default styles
		const resetStyles = () => {
			for (const workflow of workflows) {
				for (const step of workflow.steps) {
					for (const nodeId of step.nodes) {
						const element = svg.getElementById(nodeId) as SVGElement | null;
						if (!element) {
							continue;
						}

						if (nodeId.startsWith("event-")) {
							element.style.stroke = EVENT_NODE_STROKE_COLOR;
							element.style.strokeWidth = "2";
						} else if (nodeId.startsWith("task-")) {
							element.style.stroke = TASK_NODE_STROKE_COLOR;
							element.style.strokeWidth = "2";
						} else if (nodeId.startsWith("gateway-")) {
							element.style.stroke = GATEWAY_NODE_STROKE_COLOR;
							element.style.strokeWidth = "2";
						}
					}

					for (const pathId of step.paths) {
						const element = svg.getElementById(pathId) as SVGElement | null;
						if (element) {
							element.style.fill = "currentColor";
						}
					}
				}
			}
		};

		let isAnimating = true;

		// Animation loop
		const animate = async () => {
			while (isAnimating) {
				for (const workflow of workflows) {
					// Reset at the start of each workflow
					resetStyles();
					for (const step of workflow.steps) {
						highlightStep(svg, step);
						await sleep(delay);
					}
				}
			}
		};

		// Start animation
		animate();

		// Cleanup
		return () => {
			isAnimating = false;
			resetStyles();
		};
	}, [delay, svgRef, workflows]);

	return {};
}
