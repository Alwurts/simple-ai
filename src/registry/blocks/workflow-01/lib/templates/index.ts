import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { CODE_ANALYSIS_WORKFLOW } from "./code-analysis-workflow";
import { WIKIPEDIA_RESEARCH_WORKFLOW } from "./wikipedia-research-workflow";
export type WorkflowTemplate = {
	id: string;
	name: string;
	description: string;
	category: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
	{
		id: "code-analysis",
		name: "Code Analysis Router",
		description: "Intelligent routing to language-specific code experts",
		category: "Specialized",
		nodes: CODE_ANALYSIS_WORKFLOW.nodes,
		edges: CODE_ANALYSIS_WORKFLOW.edges,
	},
	{
		id: "wikipedia-research",
		name: "Wikipedia Research Assistant",
		description:
			"Comprehensive research workflow using Wikipedia search and summary tools",
		category: "Research",
		nodes: WIKIPEDIA_RESEARCH_WORKFLOW.nodes,
		edges: WIKIPEDIA_RESEARCH_WORKFLOW.edges,
	},
];

export function getTemplateById(id: string): WorkflowTemplate | undefined {
	return WORKFLOW_TEMPLATES.find((template) => template.id === id);
}

export const DEFAULT_TEMPLATE = WORKFLOW_TEMPLATES[0];
