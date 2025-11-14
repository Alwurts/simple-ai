import type { FlowEdge, FlowNode } from "@/registry/lib/flow/workflow";

export const DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "text-input",
			id: "validationSystemPrompt",
			data: {
				config: {
					value:
						'<assistant_info>\n    You are a Product Manager. Your task is to delegate tasks clearly and effectively to your development team. Your team consists of:\n    - A Front-end Developer, specializing in client-side interfaces.\n    - A Back-end Developer, focusing on server-side logic.\n    - A Database Developer, responsible for data management and structure.\n\nWhen assigning tasks:\n- You can delegate to one, two, or all three developers at once.\n- Assign only one task per developer at a time to ensure clarity and focus.\n\nYour goal is to make each task description as clear as possible so that each developer understands exactly what is expected without ambiguity.\n</assistant_info>\n\n<example>\n    Example 1:  \n    Task for Front-end Developer: "Implement a new user modal for the configuration settings page."  \n\nExample 2:  \nTask for Back-end Developer: "Create an API endpoint to validate user inputs for configuration settings."  \n\nExample 3:  \nTask for Database Developer: "Modify the schema to support versioning of user configurations."  \n</example>',
				},
			},
			position: {
				x: -739.18099272837,
				y: -297.43020029387947,
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
							name: "front-end-developer-expert",
							description:
								"Assign a task to this developer if we need to do something regarding frontend client side",
							id: "IKir5iiq4F3eurd1ApK--",
						},
						{
							name: "backend-developer-expert",
							description:
								"Assign a task to this developer if we need to do something regarding backend servers",
							id: "77ew80gSbzRhvwhf3fnpa",
						},
						{
							name: "database-developer-expert",
							description:
								"Assign a task to this developer if we need to do something regarding database",
							id: "Kb5hnlAPXL-4YM7FyfvLX",
						},
					],
				},
			},
			position: {
				x: -321.95405360286856,
				y: -100.53439790144577,
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
				x: 1019.6172647146018,
				y: -10.718421045041678,
			},
		},
		{
			type: "text-input",
			id: "97RH-yQMOC0ANhS2vFhcO",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are a Back-end Developer. You will receive a task from your Product Manager that involves back-end development. Your task will include:\n    - Designing and implementing server-side logic.\n    - Creating APIs or handling server requests.\n\nYour output should:\n- Be code snippets directly related to the task given.\n- Use server-side languages like Python, Node.js, Java, etc., as appropriate.\n</assistant_info>",
				},
			},
			position: {
				x: 629.6011639587384,
				y: -38.94007829309149,
			},
			width: 334,
			height: 294,
		},
		{
			type: "visualize-text",
			id: "lo9ImZY7ZBHw2xTEhj2X_",
			data: {},
			position: {
				x: 67.20328141837021,
				y: -378.2424058672555,
			},
			width: 361,
			height: 291,
		},
		{
			type: "visualize-text",
			id: "eYRTRKwrUcn_fmuMKuUEl",
			data: {},
			position: {
				x: 77.24332662436254,
				y: -24.641302081451535,
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
				x: 1010.4451288292125,
				y: -360.9232826189778,
			},
		},
		{
			type: "text-input",
			id: "3nEzzfbTIDDXw3WSEq4FR",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are a Front-end Developer. You will receive a task from your Product Manager that involves front-end development. Your task will include:\n    - Creating or modifying user interfaces.\n    - Ensuring seamless interaction with back-end services.\n\nYour output should:\n- Be code snippets directly related to the task given.\n- Utilize HTML, CSS, and JavaScript/TypeScript as necessary.\n</assistant_info>",
				},
			},
			position: {
				x: 626.2936734828327,
				y: -394.3698654988443,
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
				x: 1029.9490374976308,
				y: 343.99266435411,
			},
		},
		{
			type: "text-input",
			id: "_4RcYkPOEDKn-hmGOAvy9",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are a Database Developer. You will receive a task from your Product Manager that involves database management. Your task will include:\n    - Designing or modifying database schemas.\n    - Writing queries to manipulate or retrieve data.\n\nYour output should:\n- Be SQL or relevant database query snippets directly related to the task given.\n</assistant_info>\n",
				},
			},
			position: {
				x: 631.080894959199,
				y: 319.68901269229457,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "gPDWeyLIVbkoWEffGe9Xh",
			data: {},
			position: {
				x: 72.78811644978401,
				y: 325.00713539618465,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "kaTYJV52ljshMg0uClQl1",
			data: {},
			position: {
				x: 1426.8707255740183,
				y: -398.2784402167636,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "s5NSuCUuEByh_BTCSSMDU",
			data: {},
			position: {
				x: 1427.0577069712047,
				y: -44.203859127979065,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "9cLCaECGGL5t21iQ3TDc9",
			data: {},
			position: {
				x: 1423.480878484117,
				y: 323.2329083228672,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "VGFbBVUjlwdQ2cGhrCv72",
			data: {
				config: {
					value:
						"We're adding a feature to let users save their favorite products. The Front-end needs to update the product list UI, the Back-end must handle the logic for saving favorites, and the Database needs to store these preferences.",
				},
			},
			position: {
				x: -707.575657509763,
				y: 129.82485613871282,
			},
			width: 350,
			height: 300,
		},
		{
			type: "generate-text",
			id: "_75nHwdQuwAI4AThjvSGV",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 2395.1890321829005,
				y: 402.4248092634472,
			},
		},
		{
			type: "prompt-crafter",
			id: "KPXhL1_uJAvT8pFOSkIcX",
			data: {
				config: {
					template:
						"Here is the output from the developers\n<frontend>\n  {{frontend-result}}\n</frontend>\n<backend>\n  {{backend-result}}\n</backend>\n<database>\n  {{database-result}}\n</database>",
				},
				dynamicHandles: {
					"template-tags": [
						{
							name: "frontend-result",
							id: "Fs0_XlZ_oyUIPr_rOyuJL",
						},
						{
							name: "backend-result",
							id: "Ho3D6D5JaZ8EIFotqC967",
						},
						{
							name: "database-result",
							id: "LIDezYIoJrc7EerA0qp1q",
						},
					],
				},
			},
			position: {
				x: 1988.6331668012458,
				y: -151.77134890186008,
			},
		},
		{
			type: "text-input",
			id: "kFmGxICZCpNbhbEvp6wMa",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are a Senior Developer. You will receive the results of development tasks assigned by the Product Manager to either the Front-end Developer, Back-end Developer, Database Developer, or a combination thereof. You might receive:\n    - One task result from just one developer.\n    - Two task results from any two developers.\n    - Three task results from all developers.\n\nYour task is to:\n- Review the code snippets or database changes from each developer.\n- Integrate these into a cohesive codebase or system.\n\nYour output should:\n- Demonstrate how these different pieces fit together, enhancing or completing the functionality as per the initial task descriptions.\n</assistant_info>",
				},
			},
			position: {
				x: 1990.7632547140104,
				y: 306.0589442701365,
			},
			width: 350,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "GWo1bZd32Vul-hukJ64Ru",
			data: {},
			position: {
				x: 2393.50102629616,
				y: -364.78862166443685,
			},
			width: 542,
			height: 740,
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
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "KPXhL1_uJAvT8pFOSkIcX",
			targetHandle: "Fs0_XlZ_oyUIPr_rOyuJL",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-KPXhL1_uJAvT8pFOSkIcXFs0_XlZ_oyUIPr_rOyuJL",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "KPXhL1_uJAvT8pFOSkIcX",
			targetHandle: "Ho3D6D5JaZ8EIFotqC967",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-KPXhL1_uJAvT8pFOSkIcXHo3D6D5JaZ8EIFotqC967",
			data: {},
		},
		{
			source: "lu-X2l3QTJj8RBk4fDwGL",
			sourceHandle: "result",
			target: "KPXhL1_uJAvT8pFOSkIcX",
			targetHandle: "LIDezYIoJrc7EerA0qp1q",
			type: "status",
			id: "xy-edge__lu-X2l3QTJj8RBk4fDwGLresult-KPXhL1_uJAvT8pFOSkIcXLIDezYIoJrc7EerA0qp1q",
			data: {},
		},
		{
			source: "KPXhL1_uJAvT8pFOSkIcX",
			sourceHandle: "result",
			target: "_75nHwdQuwAI4AThjvSGV",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__KPXhL1_uJAvT8pFOSkIcXresult-_75nHwdQuwAI4AThjvSGVprompt",
			data: {},
		},
		{
			source: "kFmGxICZCpNbhbEvp6wMa",
			sourceHandle: "result",
			target: "_75nHwdQuwAI4AThjvSGV",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__kFmGxICZCpNbhbEvp6wMaresult-_75nHwdQuwAI4AThjvSGVsystem",
			data: {},
		},
		{
			source: "_75nHwdQuwAI4AThjvSGV",
			sourceHandle: "result",
			target: "GWo1bZd32Vul-hukJ64Ru",
			targetHandle: "input",
			type: "status",
			id: "xy-edge___75nHwdQuwAI4AThjvSGVresult-GWo1bZd32Vul-hukJ64Ruinput",
			data: {},
		},
	],
};
