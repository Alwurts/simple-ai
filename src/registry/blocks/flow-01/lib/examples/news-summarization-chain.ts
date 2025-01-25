import type { FlowEdge, FlowNode } from "@/registry/blocks/flow-01/types/flow";

export const NEWS_SUMMARY_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "articleInput",
			data: {
				config: {
					value:
						"AI Agents and Digital Identity Verification\n\nIn a surprising move, Sam Altman's World, formerly known as Worldcoin, is exploring linking AI agents to digital identities. This initiative could significantly alter how AI agents operate online by providing a \"proof of human\" verification, ensuring that these agents act on behalf of verified individuals. This development comes as platforms increasingly integrate with OpenAI's agents, suggesting a future where AI interactions online could be more secure and personalized",
				},
			},
			position: {
				x: -38.0560774345179,
				y: -109.87553535480401,
			},
			width: 300,
			height: 477,
		},
		{
			type: "text-input",
			id: "summarySystemPrompt",
			data: {
				config: {
					value:
						"You take in as input a news article and summarize it into a very short paragraph.",
				},
			},
			position: {
				x: -33.82133100040154,
				y: -428.64829255424223,
			},
		},
		{
			type: "generate-text",
			id: "summarizeLLM",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 306.0257483270164,
				y: -227.61111431352475,
			},
		},
		{
			type: "visualize-text",
			id: "visualizeSummary",
			data: {},
			position: {
				x: 439.74362152661683,
				y: -634.7962605458365,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "validationSystemPrompt",
			data: {
				config: {
					value:
						"You will receive an original article and a summarized version of the article. Your task is to compare the summarized version to the original to see if it contains all the main information, and if it's clear and well-written.\nIf the summary is not valid, you should return the failResponse tool. If the summary is valid, you should return the summary as the validResponse tool. You should ALWAYS! return the summary to either the valid or fail response",
				},
			},
			position: {
				x: 1322.8378159076065,
				y: -610.3736613323931,
			},
			width: 382,
			height: 340,
		},
		{
			type: "generate-text",
			id: "validateLLM",
			data: {
				config: {
					model: "llama-3.3-70b-versatile",
				},
				dynamicHandles: {
					tools: [
						{
							name: "failResponse",
							description: "Use this if the summary is not valid",
							id: "IKir5iiq4F3eurd1ApK--",
						},
						{
							name: "validResponse",
							description: "Use this if the article summary is valid",
							id: "77ew80gSbzRhvwhf3fnpa",
						},
					],
				},
			},
			position: {
				x: 1349.9996002512978,
				y: -198.77562774341615,
			},
		},
		{
			type: "prompt-crafter",
			id: "93I9QA0fcq6Mqb_EP6wYx",
			data: {
				config: {
					template:
						"<original-article>\n  {{original-article}}\n<original-article>\n<summarized-article>\n  {{summarized-article}}\n<summarized-article>",
				},
				dynamicHandles: {
					"template-tags": [
						{
							name: "summarized-article",
							id: "xaN2VhJWhv5Gi8VfZy31v",
						},
						{
							name: "original-article",
							id: "EFNnxyTEq05gZOjmUXDpL",
						},
					],
				},
			},
			position: {
				x: 844.6092567404837,
				y: -304.54232285618434,
			},
		},
		{
			type: "generate-text",
			id: "Nr22stf-aM3K9KZ7fHREZ",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 1989.2506773435518,
				y: 15.219251715458086,
			},
		},
		{
			type: "text-input",
			id: "97RH-yQMOC0ANhS2vFhcO",
			data: {
				config: {
					value:
						"You will receive a summary of an article and you are to generate a post for:\n\n- Instagram\n- Twitter",
				},
			},
			position: {
				x: 2001.6462694831678,
				y: -270.67685548996974,
			},
			width: 334,
			height: 219,
		},
		{
			type: "visualize-text",
			id: "PqH1msuO-XKcAzeKmY72Y",
			data: {},
			position: {
				x: 2451.215005731411,
				y: -348.5503560681139,
			},
			width: 375,
			height: 636,
		},
		{
			type: "visualize-text",
			id: "V8U4CEFnwsLZNM13DoRPn",
			data: {},
			position: {
				x: 639.7694087977897,
				y: 152.18320786105468,
			},
			width: 634,
			height: 369,
		},
		{
			type: "visualize-text",
			id: "lo9ImZY7ZBHw2xTEhj2X_",
			data: {},
			position: {
				x: 1913.0107151060429,
				y: -617.0772160629892,
			},
			width: 313,
			height: 262,
		},
		{
			type: "visualize-text",
			id: "eYRTRKwrUcn_fmuMKuUEl",
			data: {},
			position: {
				x: 1573.6214230141882,
				y: 196.37857698581186,
			},
			width: 350,
			height: 300,
		},
	],
	edges: [
		{
			type: "custom-edge",
			id: "article-to-summarize",
			source: "articleInput",
			target: "summarizeLLM",
			sourceHandle: "result",
			targetHandle: "prompt",
			data: {},
		},
		{
			type: "custom-edge",
			id: "summarySystemPrompt-to-summarize",
			source: "summarySystemPrompt",
			target: "summarizeLLM",
			sourceHandle: "result",
			targetHandle: "system",
			data: {},
		},
		{
			type: "custom-edge",
			id: "summarizeLLM-to-visualizeSummary",
			source: "summarizeLLM",
			target: "visualizeSummary",
			sourceHandle: "result",
			targetHandle: "input",
			data: {},
		},
		{
			source: "articleInput",
			sourceHandle: "result",
			target: "93I9QA0fcq6Mqb_EP6wYx",
			targetHandle: "EFNnxyTEq05gZOjmUXDpL",
			type: "custom-edge",
			id: "xy-edge__articleInputresult-93I9QA0fcq6Mqb_EP6wYxEFNnxyTEq05gZOjmUXDpL",
			data: {},
		},
		{
			source: "summarizeLLM",
			sourceHandle: "result",
			target: "93I9QA0fcq6Mqb_EP6wYx",
			targetHandle: "xaN2VhJWhv5Gi8VfZy31v",
			type: "custom-edge",
			id: "xy-edge__summarizeLLMresult-93I9QA0fcq6Mqb_EP6wYxxaN2VhJWhv5Gi8VfZy31v",
			data: {},
		},
		{
			source: "validationSystemPrompt",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "system",
			type: "custom-edge",
			id: "xy-edge__validationSystemPromptresult-validateLLMsystem",
			data: {},
		},
		{
			source: "93I9QA0fcq6Mqb_EP6wYx",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "prompt",
			type: "custom-edge",
			id: "xy-edge__93I9QA0fcq6Mqb_EP6wYxresult-validateLLMprompt",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "77ew80gSbzRhvwhf3fnpa",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "prompt",
			type: "custom-edge",
			id: "xy-edge__validateLLM77ew80gSbzRhvwhf3fnpa-Nr22stf-aM3K9KZ7fHREZprompt",
			data: {},
		},
		{
			source: "97RH-yQMOC0ANhS2vFhcO",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "system",
			type: "custom-edge",
			id: "xy-edge__97RH-yQMOC0ANhS2vFhcOresult-Nr22stf-aM3K9KZ7fHREZsystem",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "PqH1msuO-XKcAzeKmY72Y",
			targetHandle: "input",
			type: "custom-edge",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-PqH1msuO-XKcAzeKmY72Yinput",
			data: {},
		},
		{
			source: "93I9QA0fcq6Mqb_EP6wYx",
			sourceHandle: "result",
			target: "V8U4CEFnwsLZNM13DoRPn",
			targetHandle: "input",
			type: "custom-edge",
			id: "xy-edge__93I9QA0fcq6Mqb_EP6wYxresult-V8U4CEFnwsLZNM13DoRPninput",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "IKir5iiq4F3eurd1ApK--",
			target: "lo9ImZY7ZBHw2xTEhj2X_",
			targetHandle: "input",
			type: "custom-edge",
			id: "xy-edge__validateLLMIKir5iiq4F3eurd1ApK---lo9ImZY7ZBHw2xTEhj2X_input",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "77ew80gSbzRhvwhf3fnpa",
			target: "eYRTRKwrUcn_fmuMKuUEl",
			targetHandle: "input",
			type: "custom-edge",
			id: "xy-edge__validateLLM77ew80gSbzRhvwhf3fnpa-eYRTRKwrUcn_fmuMKuUElinput",
			data: {},
		},
	],
};
