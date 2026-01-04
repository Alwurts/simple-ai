"use client";

import type { ToolUIPart } from "ai";
import { FileTextIcon, ListIcon } from "lucide-react";
import { memo } from "react";
import { Streamdown } from "streamdown";
import { Tool, ToolContent, ToolHeader, ToolInput } from "@/components/ai-elements/tool";
import type { AITools } from "@/lib/ai/tools/registry";
import { idToReadableText } from "@/lib/id-to-readable-text";

type LoadSkillToolProps = {
	part: ToolUIPart<Pick<AITools, "load-skill">>;
};

export const LoadSkillTool = memo(({ part }: LoadSkillToolProps) => {
	const hasOutput = part.output != null && part.output !== undefined && "definition" in part.output;

	const skillName = part.input?.name ?? "unknown skill";

	const readableSkillName = idToReadableText(skillName, { capitalize: false });

	return (
		<Tool defaultOpen={false}>
			<ToolHeader title={`Load ${readableSkillName} skill`} type={part.type} state={part.state} />
			<ToolContent>
				<ToolInput input={part.input} />
				{hasOutput && (
					<div className="space-y-2 p-4">
						<div className="flex items-center gap-2">
							<FileTextIcon className="size-4 text-muted-foreground" />
							<h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
								Skill Instructions
							</h4>
						</div>
						<div className="rounded-md border bg-card p-4">
							{"definition" in part.output && part.output.definition && (
								<Streamdown>{part.output.definition.content}</Streamdown>
							)}
						</div>
					</div>
				)}
				{hasOutput &&
					"definition" in part.output &&
					part.output.definition &&
					part.output.definition.availableTools.length > 0 && (
						<div className="space-y-2 p-4">
							<div className="flex items-center gap-2">
								<ListIcon className="size-4 text-muted-foreground" />
								<h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
									Available Tools
								</h4>
							</div>
							<div className="rounded-md border bg-card p-4">
								{part.output.definition.availableTools.map((tool) => (
									<div key={tool}>{tool}</div>
								))}
							</div>
						</div>
					)}
			</ToolContent>
		</Tool>
	);
});
