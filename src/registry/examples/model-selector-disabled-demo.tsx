"use client";

import { useState } from "react";
import { ModelSelector, type Model } from "@/registry/ui/model-selector";

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
