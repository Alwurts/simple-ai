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
	svgRef: RefObject<SVGSVGElement | null>;
}

// Reset all elements to default styles

// Highlight a specific step
const highlightStep = (svg: SVGSVGElement, step: WorkflowStep) => {
	// Highlight nodes
	for (const nodeId of step.nodes) {
		const element = svg.getElementById(nodeId) as SVGElement | null;
		if (element) {
			element.style.strokeWidth = "4";
			element.style.stroke = "hsl(var(--workflow-highlight))";
		}
	}

	// Highlight paths
	for (const pathId of step.paths) {
		const element = svg.getElementById(pathId) as SVGElement | null;
		if (element) {
			element.style.fill = "hsl(var(--workflow-highlight))";
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
						const element = svg.getElementById(
							nodeId,
						) as SVGElement | null;
						if (!element) {
							continue;
						}

						if (nodeId.startsWith("event-")) {
							element.style.stroke =
								"hsl(var(--workflow-event-stroke))";
							element.style.strokeWidth = "2";
						} else if (nodeId.startsWith("task-")) {
							element.style.stroke =
								"hsl(var(--workflow-task-stroke))";
							element.style.strokeWidth = "2";
						} else if (nodeId.startsWith("gateway-")) {
							element.style.stroke =
								"hsl(var(--workflow-gateway-stroke))";
							element.style.strokeWidth = "2";
						}
					}

					for (const pathId of step.paths) {
						const element = svg.getElementById(
							pathId,
						) as SVGElement | null;
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
