"use client";

import { useState } from "react";
import { type Model, ModelSelector } from "@/registry/ui/model-selector";

export default function ModelSelectorDemo() {
	const [model, setModel] = useState<Model>("deepseek-chat");

	return (
		<div className="w-full max-w-sm">
			<ModelSelector value={model} onChange={setModel} />
		</div>
	);
}
