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
	"gpt-5.1": wrapLanguageModel({
		model: openaiClient("gpt-5.1"),
		middleware: defaultSettingsMiddleware({
			settings: {
				providerOptions: {
					openai: {
						reasoningSummary: "auto", // 'auto' for condensed or 'detailed' for comprehensive
						reasoningEffort: "low", // 'none' | 'low' | 'medium' | 'high'
					},
				},
			},
		}),
	}),
	"gpt-5": wrapLanguageModel({
		model: openaiClient("gpt-5"),
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
	"gpt-5-mini": wrapLanguageModel({
		model: openaiClient("gpt-5-mini"),
		middleware: defaultSettingsMiddleware({
			settings: {
				providerOptions: {
					openai: {
						reasoningSummary: "detailed", // 'auto' for condensed or 'detailed' for comprehensive
						reasoningEffort: "low", // 'minimal' | 'low' | 'medium' | 'high'
					},
				},
			},
		}),
	}),
	"gpt-5-nano": wrapLanguageModel({
		model: openaiClient("gpt-5-nano"),
		middleware: defaultSettingsMiddleware({
			settings: {
				providerOptions: {
					openai: {
						reasoningSummary: "detailed", // 'auto' for condensed or 'detailed' for comprehensive
						reasoningEffort: "low", // 'minimal' | 'low' | 'medium' | 'high'
					},
				},
			},
		}),
	}),
};

export const model = customProvider({ languageModels });

export type modelID = keyof typeof languageModels;

export const MODELS = Object.keys(languageModels);
