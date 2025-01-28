"use client";

import { type Model, ModelSelector } from "@/registry/ui/model-selector";
import { useState } from "react";

export default function ModelSelectorDemo() {
	const [model, setModel] = useState<Model>("deepseek-chat");

	return (
		<div className="w-full max-w-sm">
			<ModelSelector value={model} onChange={setModel} />
		</div>
	);
}
