import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

// Simple Wikipedia Research Workflow: Start -> Wikipedia Researcher -> End
export const WIKIPEDIA_RESEARCH_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			id: "start-node",
			type: "start",
			position: { x: 100, y: 200 },
			data: {
				sourceType: { type: "text" },
			},
		},
		{
			id: "wikipedia-researcher-node",
			type: "agent",
			position: { x: 550, y: 200 },
			data: {
				name: "Wikipedia Researcher",
				model: "gpt-5-nano",
				systemPrompt: `You are a research assistant powered by Wikipedia. Use the wikipedia-query tool to research any topic or question.

Your process:
1. First, use the "search" action to find relevant Wikipedia articles
2. Then, use the "summary" action to get detailed information from the most relevant articles
3. Synthesize the information into a comprehensive, well-structured response

Be thorough but concise. Always cite your sources and provide direct links to the Wikipedia articles you used.`,
				selectedTools: ["wikipedia-query"],
				sourceType: { type: "text" },
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
		},
		{
			id: "end-node",
			type: "end",
			position: { x: 1000, y: 200 },
			data: {},
		},
		{
			id: "workflow-description-note",
			type: "note",
			position: { x: 150, y: -50 },
			data: {
				content:
					"Simple Wikipedia Research Workflow\n\nA straightforward research assistant that uses the wikipedia-query tool:\n\n- Takes any research question or topic\n- Uses Wikipedia search to find relevant articles\n- Retrieves detailed summaries from key articles\n- Provides comprehensive answers with source citations\n\nPerfect for quick research and fact-checking tasks.",
			},
		},
	],
	edges: [
		{
			id: "start-to-researcher",
			source: "start-node",
			target: "wikipedia-researcher-node",
			sourceHandle: "message",
			targetHandle: "prompt",
			type: "status",
		},
		{
			id: "researcher-to-end",
			source: "wikipedia-researcher-node",
			target: "end-node",
			sourceHandle: "result",
			targetHandle: "input",
			type: "status",
		},
	],
};
