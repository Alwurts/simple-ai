import { wikipediaQueryTool } from "@/registry/blocks/workflow-01/lib/tools/wikipedia-query";

const tools = {
	"wikipedia-query": wikipediaQueryTool(),
};

export const WORKFLOW_TOOL_DESCRIPTIONS: Record<WorkflowToolId, string> = {
	"wikipedia-query": "Search Wikipedia articles or get article summaries",
};

export const WORKFLOW_TOOLS = Object.keys(tools) as WorkflowToolId[];

export type WorkflowToolId = keyof typeof tools;

export const getWorkflowTools = () => {
	return tools;
};
