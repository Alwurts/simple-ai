"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type Model, ModelSelector } from "@/registry/ui/model-selector";

export default function ModelSelectorDemo() {
	const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o");

	const modelDescriptions = {
		"gpt-4o": "OpenAI's most advanced model with vision capabilities",
		"gpt-4o-mini": "OpenAI's fast and cost-effective model",
		"llama-3.3-70b-versatile": "Meta's powerful open-source model via Groq",
		"llama-3.1-8b-instant": "Meta's fast inference model via Groq",
		"deepseek-chat": "DeepSeek's conversational AI model",
		"deepseek-r1-distill-llama-70b":
			"DeepSeek's distilled reasoning model via Groq",
	};

	return (
		<div className="w-full max-w-md">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						AI Model Selector
						<Badge variant="secondary">Demo</Badge>
					</CardTitle>
					<CardDescription>
						Select from various AI models across different providers
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<ModelSelector
						value={selectedModel}
						onChange={setSelectedModel}
					/>
					<div className="text-sm text-muted-foreground">
						<strong>Selected:</strong> {selectedModel}
					</div>
					<div className="text-sm">
						<strong>Description:</strong>{" "}
						{modelDescriptions[selectedModel]}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
