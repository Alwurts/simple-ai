"use client";

import * as LucideIcons from "lucide-react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { ExaIcon } from "@/components/icons/exa-icon";
import { FirecrawlIcon } from "@/components/icons/firecrawl-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
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
	const [isPromptOpen, setIsPromptOpen] = useState(false);
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	// Custom icon mapping
	const customIcons: Record<
		string,
		React.ComponentType<{ className?: string }>
	> = {
		ExaIcon: ExaIcon,
		FirecrawlIcon: FirecrawlIcon,
	};

	// Dynamic icon renderer
	const renderIcon = (iconName: string) => {
		// Check for custom icons first
		const CustomIconComponent = customIcons[iconName];
		if (CustomIconComponent) {
			return <CustomIconComponent className="h-8 w-8" />;
		}

		// Fall back to Lucide icons
		const IconComponent = (LucideIcons as Record<string, unknown>)[
			iconName
		] as React.ComponentType<{ className?: string }>;
		return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
	};

	if (!item.categories?.includes("agent") || !meta) {
		return null;
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-background">
			{/* Header Section */}
			<div className="border-b bg-muted/40 p-6">
				<div className="flex items-start gap-4">
					{meta.icon && (
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
							{renderIcon(meta.icon)}
						</div>
					)}
					<div className="flex-1 space-y-1">
						<h2 className="text-2xl font-semibold tracking-tight">
							{idToReadableText(item.name)}
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							{item.description}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6 p-6">
				{/* Prompt Section */}
				{meta.prompt && (
					<Card className="p-0">
						<Collapsible
							open={isPromptOpen}
							onOpenChange={setIsPromptOpen}
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
								<div className="flex items-center gap-2">
									<CardTitle className="text-base">
										System Prompt
									</CardTitle>
									<Badge
										variant="secondary"
										className="font-mono text-xs"
									>
										{meta.prompt.length} chars
									</Badge>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={(e) => {
											e.stopPropagation();
											copyToClipboard(meta.prompt ?? "");
										}}
									>
										{isCopied ? (
											<Check className="h-4 w-4 text-green-500" />
										) : (
											<Copy className="h-4 w-4" />
										)}
										<span className="sr-only">
											Copy prompt
										</span>
									</Button>
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
										>
											{isPromptOpen ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
											<span className="sr-only">
												Toggle prompt
											</span>
										</Button>
									</CollapsibleTrigger>
								</div>
							</CardHeader>
							<CollapsibleContent>
								<CardContent className="p-4 pt-0">
									<div className="rounded-md bg-muted p-4">
										<code className="block whitespace-pre-wrap font-mono text-sm leading-relaxed">
											{meta.prompt}
										</code>
									</div>
								</CardContent>
							</CollapsibleContent>
							{!isPromptOpen && (
								<div className="px-4 pb-4">
									<p className="line-clamp-2 text-sm text-muted-foreground">
										{meta.prompt}
									</p>
								</div>
							)}
						</Collapsible>
					</Card>
				)}

				{/* Tools Section */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold tracking-tight">
							Tools
						</h3>
						<Badge variant="outline">
							{meta.toolIds.length} available
						</Badge>
					</div>
					<div className="grid gap-4">
						{meta.toolIds.map((toolId) => (
							<AgentToolCard key={toolId} toolId={toolId} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export { AgentInfo };
