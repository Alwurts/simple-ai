import { wikipediaQueryTool } from "@/registry/blocks/workflow-01/lib/tools/wikipedia-query";

export const workflowTools = {
	"wikipedia-query": wikipediaQueryTool(),
};

export const WORKFLOW_TOOLS = Object.keys(workflowTools) as WorkflowToolId[];

export type WorkflowToolId = keyof typeof workflowTools;
