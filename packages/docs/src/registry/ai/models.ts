import { openai } from "@ai-sdk/openai";
import {
	customProvider,
	defaultSettingsMiddleware,
	wrapLanguageModel,
} from "ai";

const languageModels = {
	"gpt-5.1": wrapLanguageModel({
		model: openai("gpt-5.1"),
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
		model: openai("gpt-5"),
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
		model: openai("gpt-5-mini"),
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
		model: openai("gpt-5-nano"),
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
