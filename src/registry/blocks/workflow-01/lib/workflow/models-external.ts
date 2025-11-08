import { openai } from "@ai-sdk/openai";

import {
	customProvider,
	defaultSettingsMiddleware,
	wrapLanguageModel,
} from "ai";

const languageModels = {
	"gpt-5-mini": wrapLanguageModel({
		model: openai.chat("gpt-5-mini"),
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
