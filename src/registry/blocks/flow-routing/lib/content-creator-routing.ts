import type { FlowEdge, FlowNode } from "@/registry/lib/flow/workflow";

export const CONTENT_CREATOR_ROUTING_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "validationSystemPrompt",
			data: {
				config: {
					value: "You will receive a request by the user and your task is to route it to the appropiate expert.\n\nYou will ALWAYS route the ORIGINAL request to one assistant only\n\nRoute the original request without modifying any of its text\n\n- Use the blog-expert if the task is about writing blogs, or related\n\n- Use the short-form-expert if the task is about creating short form content for social media\n\n- Use the seo-web-expert if the task if about SEO optimization",
				},
			},
			position: {
				x: -630.950179662337,
				y: -272.9151555178262,
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
							name: "blog-expert",
							description:
								"Route the input here if the request is about creating blog content",
							id: "IKir5iiq4F3eurd1ApK--",
						},
						{
							name: "short-form-expert",
							description:
								"Route the input here if the request is about creating short form content",
							id: "77ew80gSbzRhvwhf3fnpa",
						},
						{
							name: "seo-web-expert",
							description:
								"Route the input here if the request is to optimize content for SEO",
							id: "Kb5hnlAPXL-4YM7FyfvLX",
						},
					],
				},
			},
			position: {
				x: -216.1529010505419,
				y: -90.08410976336413,
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
				x: 1131.0549255629082,
				y: -8.558529481810613,
			},
		},
		{
			type: "text-input",
			id: "97RH-yQMOC0ANhS2vFhcO",
			data: {
				config: {
					value: "You are an expert in creating short form content. Your task is to generate creative and well structured short content posts for instagram, twitter and others",
				},
			},
			position: {
				x: 755.1019295025321,
				y: -21.392905970926638,
			},
			width: 334,
			height: 270,
		},
		{
			type: "visualize-text",
			id: "lo9ImZY7ZBHw2xTEhj2X_",
			data: {},
			position: {
				x: 184.84979365379445,
				y: -363.4130653501635,
			},
			width: 361,
			height: 291,
		},
		{
			type: "visualize-text",
			id: "eYRTRKwrUcn_fmuMKuUEl",
			data: {},
			position: {
				x: 186.64036397432417,
				y: -10.053864581653889,
			},
			width: 350,
			height: 300,
		},
		{
			type: "generate-text",
			id: "ZnL2SgGAMwaZSLNH-bOX3",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 1137.9900879980153,
				y: -360.54142250040667,
			},
		},
		{
			type: "text-input",
			id: "3nEzzfbTIDDXw3WSEq4FR",
			data: {
				config: {
					value: "You are an expert in writing blogs. Your task is to generate creative and well structured blogs, using appropiate sections and subsections",
				},
			},
			position: {
				x: 754.9699904778432,
				y: -390.86846911802775,
			},
			width: 326,
			height: 300,
		},
		{
			type: "generate-text",
			id: "lu-X2l3QTJj8RBk4fDwGL",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 1118.3693399999038,
				y: 355.8064333777831,
			},
		},
		{
			type: "text-input",
			id: "_4RcYkPOEDKn-hmGOAvy9",
			data: {
				config: {
					value: "You are an expert in Search Engine Optimization SEO. Your task is to analyze content and provide suggestions on what keywords could be better in order to improve SEO",
				},
			},
			position: {
				x: 752.9894919604718,
				y: 333.28662944260793,
			},
			width: 332,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "gPDWeyLIVbkoWEffGe9Xh",
			data: {},
			position: {
				x: 184.2323574137816,
				y: 335.75701834105473,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "kaTYJV52ljshMg0uClQl1",
			data: {},
			position: {
				x: 1534.857338851561,
				y: -403.6387883803827,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "s5NSuCUuEByh_BTCSSMDU",
			data: {},
			position: {
				x: 1531.4882573594275,
				y: -41.46004169307438,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "9cLCaECGGL5t21iQ3TDc9",
			data: {},
			position: {
				x: 1532.942424576666,
				y: 309.86942743727576,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "VGFbBVUjlwdQ2cGhrCv72",
			data: {
				config: {
					value: "I want to create a twitter post for launching my new website simple-ai.dev",
				},
			},
			position: {
				x: -621.3894717331403,
				y: 147.6203949447215,
			},
			width: 350,
			height: 300,
		},
	],
	edges: [
		{
			source: "validationSystemPrompt",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__validationSystemPromptresult-validateLLMsystem",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "77ew80gSbzRhvwhf3fnpa",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__validateLLM77ew80gSbzRhvwhf3fnpa-Nr22stf-aM3K9KZ7fHREZprompt",
			data: {},
		},
		{
			source: "97RH-yQMOC0ANhS2vFhcO",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__97RH-yQMOC0ANhS2vFhcOresult-Nr22stf-aM3K9KZ7fHREZsystem",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "IKir5iiq4F3eurd1ApK--",
			target: "lo9ImZY7ZBHw2xTEhj2X_",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__validateLLMIKir5iiq4F3eurd1ApK---lo9ImZY7ZBHw2xTEhj2X_input",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "77ew80gSbzRhvwhf3fnpa",
			target: "eYRTRKwrUcn_fmuMKuUEl",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__validateLLM77ew80gSbzRhvwhf3fnpa-eYRTRKwrUcn_fmuMKuUElinput",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "IKir5iiq4F3eurd1ApK--",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__validateLLMIKir5iiq4F3eurd1ApK---ZnL2SgGAMwaZSLNH-bOX3prompt",
			data: {},
		},
		{
			source: "3nEzzfbTIDDXw3WSEq4FR",
			sourceHandle: "result",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__3nEzzfbTIDDXw3WSEq4FRresult-ZnL2SgGAMwaZSLNH-bOX3system",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "Kb5hnlAPXL-4YM7FyfvLX",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__validateLLMKb5hnlAPXL-4YM7FyfvLX-lu-X2l3QTJj8RBk4fDwGLprompt",
			data: {},
		},
		{
			source: "_4RcYkPOEDKn-hmGOAvy9",
			sourceHandle: "result",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "system",
			type: "status",
			id: "xy-edge___4RcYkPOEDKn-hmGOAvy9result-lu-X2l3QTJj8RBk4fDwGLsystem",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "Kb5hnlAPXL-4YM7FyfvLX",
			target: "gPDWeyLIVbkoWEffGe9Xh",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__validateLLMKb5hnlAPXL-4YM7FyfvLX-gPDWeyLIVbkoWEffGe9Xhinput",
			data: {},
		},
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "kaTYJV52ljshMg0uClQl1",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-kaTYJV52ljshMg0uClQl1input",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "s5NSuCUuEByh_BTCSSMDU",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-s5NSuCUuEByh_BTCSSMDUinput",
			data: {},
		},
		{
			source: "lu-X2l3QTJj8RBk4fDwGL",
			sourceHandle: "result",
			target: "9cLCaECGGL5t21iQ3TDc9",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__lu-X2l3QTJj8RBk4fDwGLresult-9cLCaECGGL5t21iQ3TDc9input",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-validateLLMprompt",
			data: {},
		},
	],
};
