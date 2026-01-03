"use client";

import type { DynamicToolUIPart, ToolUIPart } from "ai";
import { memo } from "react";
import { idToReadableText } from "@/lib/id-to-readable-text";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "../ai-elements/tool";

export type ComposedToolProps = {
	part: ToolUIPart | DynamicToolUIPart;
};

export const ComposedTool = memo(({ part }: ComposedToolProps) => {
	const toolName =
		"toolName" in part && typeof part.toolName === "string" ? part.toolName : part.type.slice(5);

	return (
		<Tool key={part.state} defaultOpen={part.state === "approval-requested"}>
			<ToolHeader
				title={idToReadableText(toolName, { capitalize: true })}
				type={part.type}
				state={part.state}
			/>
			<ToolContent>
				<ToolInput input={part.input} />
				<ToolOutput output={part.output} errorText={part.errorText} />
			</ToolContent>
		</Tool>
	);
});
