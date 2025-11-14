import { createOpenAI } from "@ai-sdk/openai";

import {
	customProvider,
	defaultSettingsMiddleware,
	wrapLanguageModel,
} from "ai";

const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL;

const openaiClient = createOpenAI({
	baseURL: `${AI_GATEWAY_URL}/openai`,
});

const languageModels = {
	"gpt-5-mini": wrapLanguageModel({
		model: openaiClient.chat("gpt-5-mini"),
		middleware: defaultSettingsMiddleware({
			settings: {
				providerOptions: {
					openai: {
						reasoningSummary: "auto", // 'auto' for condensed or 'detailed' for comprehensive
						reasoningEffort: "minimal", // 'minimal' | 'low' | 'medium' | 'high'
					},
				},
			},
		}),
	}),
};

export const workflowModel = customProvider({ languageModels });

export const WORKFLOW_MODELS = Object.keys(languageModels) as workflowModelID[];

export type workflowModelID = keyof typeof languageModels;
