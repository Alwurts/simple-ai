import type { HandleType, Node } from "@xyflow/react";

type NodeExecutionStatus = "success" | "error" | "processing" | "idle";

type NodeExecutionState<
	TTargetType extends string | undefined,
	TSourceType extends string | undefined,
> = {
	timestamp: string;
	targets: TTargetType extends string ? Record<TTargetType, string> : undefined;
	sources: TSourceType extends string ? Record<TSourceType, string> : undefined;
	status: NodeExecutionStatus;
	error?: string;
};

// Dynamic Handles

type DynamicHandle<THandleType extends HandleType> = {
	id: string;
	name: string;
	description?: string;
	type: THandleType;
};

// Visualize Text

const VISUALIZE_TEXT_TARGETS = ["input"] as const;
type VisualizeTextTargets = (typeof VISUALIZE_TEXT_TARGETS)[number];

type VisualizeTextData = {
	executionState?: NodeExecutionState<VisualizeTextTargets, undefined>;
};

export type VisualizeTextNode = Node<VisualizeTextData, "visualize-text">;

// Text Input

const TEXT_INPUT_SOURCES = ["result"] as const;
type TextInputSources = (typeof TEXT_INPUT_SOURCES)[number];

type TextInputConfig = {
	value: string;
};

type TextInputData = {
	config: TextInputConfig;
	executionState?: NodeExecutionState<undefined, TextInputSources>;
};

export type TextInputNode = Node<TextInputData, "text-input">;

// Prompt Crafter

/* const PROMPT_CRAFTER_TARGETS = ["input"] as const;
type PromptCrafterTargets = (typeof PROMPT_CRAFTER_TARGETS)[number]; */

const PROMPT_CRAFTER_SOURCES = ["result"] as const;
type PromptCrafterSources = (typeof PROMPT_CRAFTER_SOURCES)[number];

type PromptCrafterConfig = {
	template: string;
	templateTags: Array<DynamicHandle<"target">>;
};

type PromptCrafterData = {
	config: PromptCrafterConfig;
	executionState?: NodeExecutionState<string, PromptCrafterSources>;
};

export type PromptCrafterNode = Node<PromptCrafterData, "prompt-crafter">;

// Generate Text

const GENERATE_TEXT_TARGETS = ["system", "prompt"] as const;
type GenerateTextTargets = (typeof GENERATE_TEXT_TARGETS)[number];

const GENERATE_TEXT_SOURCES = ["result"] as const;
type GenerateTextSources = (typeof GENERATE_TEXT_SOURCES)[number];

type GenerateTextConfig = {
	model: string;
	tools: Array<DynamicHandle<"source">>;
};

type GenerateTextData = {
	config: GenerateTextConfig;
	executionState?: NodeExecutionState<GenerateTextTargets, GenerateTextSources>;
};

export type GenerateTextNode = Node<GenerateTextData, "generate-text">;

// Flow
export type FlowNode =
	| VisualizeTextNode
	| TextInputNode
	| PromptCrafterNode
	| GenerateTextNode;
