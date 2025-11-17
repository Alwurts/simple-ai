"use client";

import * as LucideIcons from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";
import { AgentToolCard } from "./agent-tool-card";
import { useAgentViewer } from "./agent-viewer";

function AgentInfo() {
	const { item } = useAgentViewer();
	const meta = item.meta as
		| {
				icon?: string;
				toolIds: string[];
				suggestions?: string[];
				prompt?: string;
		  }
		| undefined;
	const [isPromptExpanded, setIsPromptExpanded] = useState(false);
	const maxPromptLength = 400;

	// Dynamic icon renderer
	const renderIcon = (iconName: string) => {
		const IconComponent = (LucideIcons as Record<string, unknown>)[
			iconName
		] as React.ComponentType<{ className?: string }>;
		return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
	};

	// Check if prompt needs truncation based on character length
	const isPromptLong = meta?.prompt
		? meta.prompt.length > maxPromptLength
		: false;

	if (!item.categories?.includes("agent") || !meta) {
		return null;
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto px-6 py-6">
			{/* Header Section */}
			<div className="flex flex-col gap-2 pb-6">
				<div className="flex items-center gap-3">
					{meta.icon && (
						<div className="text-primary">
							{renderIcon(meta.icon)}
						</div>
					)}
					<h2 className="text-xl font-semibold tracking-tight">
						{idToReadableText(item.name)}
					</h2>
				</div>
				<p className="text-foreground text-base leading-relaxed">
					{item.description}
				</p>
			</div>

			{/* Prompt Section */}
			{meta.prompt && (
				<div className="pb-6">
					<h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
						System Prompt
					</h3>
					<div className="rounded-lg bg-code p-4">
						<code className="block whitespace-pre-wrap font-mono text-sm text-code-foreground leading-relaxed">
							{isPromptExpanded || !isPromptLong
								? meta.prompt
								: `${meta.prompt.slice(0, maxPromptLength)}...`}
						</code>
						{isPromptLong && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									setIsPromptExpanded(!isPromptExpanded)
								}
								className="mt-3 h-7 gap-1 text-xs hover:bg-code-highlight"
							>
								{isPromptExpanded ? (
									<>
										<ChevronUp className="h-3 w-3" />
										Show less
									</>
								) : (
									<>
										<ChevronDown className="h-3 w-3" />
										Show more
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Tools Section */}
			<div className="flex flex-col gap-3">
				<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
					Tools
				</h3>
				<div className="flex flex-col gap-3">
					{meta.toolIds.map((toolId) => (
						<AgentToolCard key={toolId} toolId={toolId} />
					))}
				</div>
			</div>
		</div>
	);
}

export { AgentInfo };
