"use client";

import { ChevronRight } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AgentToolCard } from "./agent-tool-card";
import { useAgentViewer } from "./agent-viewer";

function AgentProfileCard() {
	const { item } = useAgentViewer();
	const meta = item.meta as
		| {
				toolIds: string[];
				suggestions?: string[];
				prompt?: string;
		  }
		| undefined;

	if (!item.categories?.includes("agent") || !meta) {
		return null;
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="space-y-2">
					<CardTitle className="text-2xl font-bold">
						{item.title ?? item.name}
					</CardTitle>
					<CardDescription className="text-base">
						{item.description}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{meta.prompt && (
					<div>
						<Collapsible defaultOpen={false}>
							<CollapsibleTrigger className="flex items-center gap-2 w-full">
								<h4 className="text-sm font-medium">Prompt</h4>
								<ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-90 ml-auto" />
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2">
								<div className="bg-muted rounded-md p-3">
									<pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
										{meta.prompt}
									</pre>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				)}
				<div>
					<h4 className="text-sm font-medium mb-3">Tools</h4>
					<div className="space-y-3">
						{meta.toolIds.map((toolId) => (
							<AgentToolCard key={toolId} toolId={toolId} />
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { AgentProfileCard };
