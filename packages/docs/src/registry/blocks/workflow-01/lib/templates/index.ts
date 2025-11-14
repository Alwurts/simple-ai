import { CODE_ANALYSIS_TEMPLATE } from "@/registry/blocks/workflow-01/lib/templates/code-analysis-workflow";
import { CUSTOMER_SUPPORT_TEMPLATE } from "@/registry/blocks/workflow-01/lib/templates/customer-support-workflow";
import { WAIT_DEMO_TEMPLATE } from "@/registry/blocks/workflow-01/lib/templates/wait-demo-workflow";
import { WIKIPEDIA_RESEARCH_TEMPLATE } from "@/registry/blocks/workflow-01/lib/templates/wikipedia-research-workflow";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/types/workflow";

export type WorkflowTemplate = {
	id: string;
	name: string;
	description: string;
	category: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
	suggestions: string[];
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
	CODE_ANALYSIS_TEMPLATE,
	WIKIPEDIA_RESEARCH_TEMPLATE,
	CUSTOMER_SUPPORT_TEMPLATE,
	WAIT_DEMO_TEMPLATE,
];

export function getTemplateById(id: string): WorkflowTemplate | undefined {
	return WORKFLOW_TEMPLATES.find(template => template.id === id);
}

export const DEFAULT_TEMPLATE = WORKFLOW_TEMPLATES[0];
