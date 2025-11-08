import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

export const WIKIPEDIA_RESEARCH_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			id: "start-node",
			type: "start",
			position: {
				x: 0,
				y: 0,
			},
			data: {
				sourceType: {
					type: "text",
				},
			},
			measured: {
				width: 163,
				height: 58,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "wikipedia-researcher-node",
			type: "agent",
			position: {
				x: 217.03408510688456,
				y: -8.288046037379033,
			},
			data: {
				name: "Wikipedia Researcher",
				model: "gpt-5-mini",
				systemPrompt:
					'You are a research assistant powered by Wikipedia. Use the wikipedia-query tool to gather comprehensive research data.\n\nYour process:\n1. Use the "search" action to find the most relevant Wikipedia articles for the query\n2. Use the "summary" action to retrieve detailed information from 2-4 key articles\n3. Extract key facts, dates, people, events, and concepts\n4. Return structured research data that will be used by another agent for summarization\n\nFocus on gathering raw data rather than writing responses. Be thorough in your research.',
				selectedTools: ["wikipedia-query"],
				sourceType: {
					type: "structured",
					schema: {
						type: "object",
						properties: {
							query: {
								type: "string",
								description: "The original research query",
							},
							articles: {
								type: "array",
								description:
									"List of researched articles with their content",
								items: {
									type: "object",
									properties: {
										title: {
											type: "string",
											description: "Article title",
										},
										url: {
											type: "string",
											description:
												"Wikipedia article URL",
										},
										summary: {
											type: "string",
											description:
												"Key information extracted from the article",
										},
										key_facts: {
											type: "array",
											items: {
												type: "string",
											},
											description:
												"Important facts, dates, or concepts",
										},
									},
									required: ["title", "summary"],
								},
							},
							main_topics: {
								type: "array",
								items: {
									type: "string",
								},
								description:
									"Main topics covered in the research",
							},
							relevance_score: {
								type: "number",
								description:
									"Overall relevance score (0-10) of the research to the query",
								minimum: 0,
								maximum: 10,
							},
						},
						required: ["query", "articles", "main_topics"],
					},
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
			measured: {
				width: 184,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "wikipedia-summarizer-node",
			type: "agent",
			position: {
				x: 487.7124662933777,
				y: -5.636883617543333,
			},
			data: {
				name: "Wikipedia Summarizer",
				model: "gpt-5-mini",
				systemPrompt:
					"You are a content summarizer that takes structured research data from Wikipedia and creates comprehensive, well-written responses for users.\n\nYour process:\n1. Analyze the structured research data provided\n2. Synthesize information from multiple articles into a coherent narrative\n3. Create engaging, well-structured content that answers the original query\n4. Include relevant citations and source links\n5. Be thorough but concise, avoiding unnecessary details\n\nFormat your response with:\n- Clear introduction answering the main query\n- Well-organized sections with descriptive headers\n- Key facts, dates, and concepts highlighted appropriately\n- Source citations with links\n- Professional, informative tone\n\nBe concise in your output or response.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 3,
			},
			measured: {
				width: 189,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "end-node",
			type: "end",
			position: {
				x: 736.6595162137467,
				y: 2.0676419359424294,
			},
			data: {},
			measured: {
				width: 181,
				height: 58,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "workflow-description-note",
			type: "note",
			position: {
				x: 129.98312031522866,
				y: -273.7056292586109,
			},
			data: {
				content:
					"**Wikipedia Researcher Agent**\n\nGathers structured research data from Wikipedia articles using the wikipedia-query tool. Extracts key facts, dates, and concepts for comprehensive research coverage.",
			},
			measured: {
				width: 311,
				height: 180,
			},
			selected: false,
			width: 311,
			height: 180,
			resizing: false,
			dragging: false,
		},
		{
			id: "OUzYAixsWyDCNwgxEXSnK",
			type: "note",
			position: {
				x: 514.3267057930115,
				y: -276.3323675246679,
			},
			data: {
				content:
					"**Wikipedia Summarizer Agent**\n\nSynthesizes research data into engaging, well-structured responses with citations. Creates comprehensive narratives from multiple article sources.",
			},
			measured: {
				width: 285,
				height: 200,
			},
			selected: false,
			dragging: false,
			width: 285,
			height: 200,
			resizing: false,
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
			data: {},
		},
		{
			id: "researcher-to-summarizer",
			source: "wikipedia-researcher-node",
			target: "wikipedia-summarizer-node",
			sourceHandle: "result",
			targetHandle: "prompt",
			type: "status",
			data: {},
		},
		{
			id: "summarizer-to-end",
			source: "wikipedia-summarizer-node",
			target: "end-node",
			sourceHandle: "result",
			targetHandle: "input",
			type: "status",
			data: {},
		},
	],
};

export const WIKIPEDIA_RESEARCH_TEMPLATE = {
	id: "wikipedia-research",
	name: "Wikipedia Agent",
	description:
		"Comprehensive research workflow using Wikipedia search and summary tools",
	category: "Research",
	nodes: WIKIPEDIA_RESEARCH_WORKFLOW.nodes,
	edges: WIKIPEDIA_RESEARCH_WORKFLOW.edges,
	suggestions: [
		"Research the history of artificial intelligence",
		"What are the key principles of quantum physics?",
		"Research the biography of Albert Einstein",
	],
};
