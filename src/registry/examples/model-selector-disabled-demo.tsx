"use client";

import { type Model, ModelSelector } from "@/registry/ui/model-selector";
import { useState } from "react";

export default function ModelSelectorDisabledDemo() {
	const [model, setModel] = useState<Model>("deepseek-chat");

	return (
		<div className="w-full max-w-sm">
			<ModelSelector
				value={model}
				onChange={setModel}
				disabledModels={[
					"gpt-4o",
					"gpt-4o-mini",
					"deepseek-r1-distill-llama-70b",
				]}
			/>
		</div>
	);
}
