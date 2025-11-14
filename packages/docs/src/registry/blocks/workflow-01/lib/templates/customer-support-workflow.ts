import { WORKFLOW_MODELS } from "@/registry/blocks/workflow-01/lib/workflow/models";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/types/workflow";

export const CUSTOMER_SUPPORT_WORKFLOW: {
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
		},
		{
			id: "support-classifier-node",
			type: "agent",
			position: {
				x: 214.92718722537256,
				y: -6.754208598280512,
			},
			data: {
				name: "Support Classifier",
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: true,
				maxSteps: 5,
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					'You are a customer support classifier. Analyze the customer inquiry and categorize it appropriately.\n\nReturn a structured classification with:\n- category: The type of issue ("technical", "billing", "general", "urgent")\n- priority: Priority level ("high", "medium", "low")\n- sentiment: Customer sentiment ("positive", "neutral", "negative")\n- requires_escalation: boolean indicating if immediate escalation is needed\n\nBe accurate and empathetic in your analysis.',
				selectedTools: [],
				sourceType: {
					type: "structured",
					schema: {
						type: "object",
						properties: {
							category: {
								type: "string",
								description: "Type of support issue",
								enum: ["technical", "billing", "general", "urgent"],
							},
							priority: {
								type: "string",
								description: "Priority level",
								enum: ["high", "medium", "low"],
							},
							sentiment: {
								type: "string",
								description: "Customer sentiment",
								enum: ["positive", "neutral", "negative"],
							},
							requires_escalation: {
								type: "boolean",
								description: "Whether immediate escalation is needed",
							},
						},
						required: [
							"category",
							"priority",
							"sentiment",
							"requires_escalation",
						],
					},
				},
			},
			measured: {
				width: 182,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "priority-router-node",
			type: "if-else",
			position: {
				x: 448.6297230272165,
				y: -133.98485130502783,
			},
			data: {
				status: "idle",
				dynamicSourceHandles: [
					{
						id: "output-urgent",
						label: "Urgent",
						condition:
							"input.category == 'urgent' || input.requires_escalation == true",
					},
					{
						id: "output-technical",
						label: "Technical",
						condition: "input.category == 'technical'",
					},
					{
						id: "output-billing",
						label: "Billing",
						condition: "input.category == 'billing'",
					},
					{
						id: "output-general",
						label: "General",
						condition: "input.category == 'general'",
					},
				],
			},
			measured: {
				width: 189,
				height: 227,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "urgent-support-node",
			type: "agent",
			position: {
				x: 691.3067678450559,
				y: -151.7958970383244,
			},
			data: {
				name: "Urgent Support Specialist",
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a senior support specialist handling urgent customer issues. Your role is to:\n\n1. Acknowledge the urgency and customer's concern immediately\n2. Provide quick, effective solutions or escalation paths\n3. Maintain calm and professional communication\n4. Offer immediate next steps and follow-up plan\n5. Ensure customer feels heard and valued\n\nPriority is speed and effectiveness while maintaining quality support.\n\nBe concise in your output or response.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
			measured: {
				width: 202,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "technical-support-node",
			type: "agent",
			position: {
				x: 694.4691823666877,
				y: -64.58868164319044,
			},
			data: {
				name: "Technical Support Specialist",
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a technical support specialist. Help customers with technical issues by:\n\n1. Understanding the technical problem clearly\n2. Providing step-by-step troubleshooting guidance\n3. Explaining technical concepts in simple terms\n4. Offering multiple solution approaches\n5. Including relevant documentation or resources\n\nBe patient, clear, and thorough in your technical guidance.\n\nBe concise in your output or response.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
			measured: {
				width: 202,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "billing-support-node",
			type: "agent",
			position: {
				x: 698.6857350621967,
				y: 25.780948273575284,
			},
			data: {
				name: "Billing Support Specialist",
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a billing and account support specialist. Handle billing inquiries by:\n\n1. Addressing billing concerns with empathy and clarity\n2. Explaining charges, invoices, and payment processes\n3. Providing refund or adjustment guidance when appropriate\n4. Ensuring data security and privacy\n5. Offering account management assistance\n\nBe transparent, accurate, and customer-focused in all billing matters.\n\nBe concise in your output or response.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
			measured: {
				width: 202,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "general-support-node",
			type: "agent",
			position: {
				x: 704.8131893934153,
				y: 118.0232543912802,
			},
			data: {
				name: "General Support Agent",
				model: WORKFLOW_MODELS[0],
				systemPrompt:
					"You are a general support agent handling a variety of customer inquiries. Provide help by:\n\n1. Listening to customer needs and questions\n2. Providing clear, helpful information\n3. Guiding customers to relevant resources\n4. Offering friendly, professional assistance\n5. Creating positive customer experiences\n\nBe versatile, helpful, and maintain excellent customer service standards.\n\nBe concise in your output or response.",
				selectedTools: [],
				sourceType: {
					type: "text",
				},
				status: "idle",
				hideResponseInChat: false,
				excludeFromConversation: false,
				maxSteps: 5,
			},
			measured: {
				width: 193,
				height: 74,
			},
			selected: false,
			dragging: false,
		},
		{
			id: "end-node",
			type: "end",
			position: {
				x: 981.0268121059296,
				y: -0.2478087398583213,
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
			id: "else-end-node",
			type: "end",
			position: {
				x: 711.0671595108819,
				y: 276.13101979922845,
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
				x: 40.50629062366556,
				y: 136.3769204357046,
			},
			data: {
				content:
					"Customer Support Workflow\n\nIntelligent routing system:\n1. Classifier analyzes and categorizes inquiries\n2. Router directs to specialists (Urgent/Technical/Billing/General)\n3. Else output routes unmatched inquiries to separate end block\n\nFeatures: Sentiment analysis, escalation detection, clear routing paths\n\nTest with different inquiry types!",
			},
			measured: {
				width: 558,
				height: 244,
			},
			selected: false,
			dragging: false,
			width: 558,
			height: 244,
			resizing: false,
		},
	],
	edges: [
		{
			id: "start-to-classifier",
			source: "start-node",
			target: "support-classifier-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "classifier-to-router",
			source: "support-classifier-node",
			target: "priority-router-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "router-to-urgent",
			source: "priority-router-node",
			target: "urgent-support-node",
			sourceHandle: "output-urgent",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "router-to-technical",
			source: "priority-router-node",
			target: "technical-support-node",
			sourceHandle: "output-technical",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "router-to-billing",
			source: "priority-router-node",
			target: "billing-support-node",
			sourceHandle: "output-billing",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "router-to-general",
			source: "priority-router-node",
			target: "general-support-node",
			sourceHandle: "output-general",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "urgent-to-end",
			source: "urgent-support-node",
			target: "end-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
			selected: false,
		},
		{
			id: "technical-to-end",
			source: "technical-support-node",
			target: "end-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "billing-to-end",
			source: "billing-support-node",
			target: "end-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "general-to-end",
			source: "general-support-node",
			target: "end-node",
			sourceHandle: "output",
			targetHandle: "input",
			type: "status",
			data: {},
		},
		{
			id: "router-to-else-end",
			source: "priority-router-node",
			target: "else-end-node",
			sourceHandle: "output-else",
			targetHandle: "input",
			type: "status",
			data: {},
		},
	],
};

export const CUSTOMER_SUPPORT_TEMPLATE = {
	id: "customer-support",
	name: "Support Agent",
	description: "Intelligent customer support with priority-based routing",
	category: "Business",
	nodes: CUSTOMER_SUPPORT_WORKFLOW.nodes,
	edges: CUSTOMER_SUPPORT_WORKFLOW.edges,
	suggestions: [
		"I can't log into my account, can you help?",
		"My billing statement shows incorrect charges",
		"The website is loading very slowly, what's wrong?",
	],
};
