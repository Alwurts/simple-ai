"use client";

import { ChevronDown, ChevronUp, Wrench } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { idToReadableText } from "@/registry/lib/id-to-readable-text";
import { JsonSchemaViewer } from "@/registry/ui/json-schema-viewer";
import { useAgentViewer } from "./agent-viewer";

function AgentToolCard({ toolId }: { toolId: string }) {
	const { toolMetadata } = useAgentViewer();
	const toolDetails = toolMetadata[toolId];
	const readableName = idToReadableText(toolId);
	const [isOpen, setIsOpen] = useState(false);

	if (!toolDetails) {
		return (
			<Card className="bg-muted/50">
				<CardHeader className="p-4">
					<CardTitle className="text-sm font-medium">
						{readableName}
					</CardTitle>
					<CardDescription className="text-xs">
						Tool details unavailable
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden p-0 gap-0">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CardHeader className="p-4">
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
								<Wrench className="h-4 w-4" />
							</div>
							<div className="space-y-1">
								<CardTitle className="text-base">
									{readableName}
								</CardTitle>
								<CardDescription className="line-clamp-2">
									{toolDetails.description}
								</CardDescription>
							</div>
						</div>
						<CollapsibleTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 shrink-0 p-0"
							>
								{isOpen ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
								<span className="sr-only">Toggle details</span>
							</Button>
						</CollapsibleTrigger>
					</div>
				</CardHeader>
				<CollapsibleContent>
					<CardContent className="border-t bg-muted/30 p-4">
						<div className="grid gap-6 md:grid-cols-2">
							{toolDetails.inputSchema && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Input
										</h4>
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											JSON Schema
										</Badge>
									</div>
									<div className="p-1">
										<JsonSchemaViewer
											schema={toolDetails.inputSchema}
											title="Input Schema"
											className="border-0 shadow-none bg-transparent"
											hideHeader={true}
										/>
									</div>
								</div>
							)}
							{toolDetails.outputSchema && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
											Output
										</h4>
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											JSON Schema
										</Badge>
									</div>
									<div className="p-1">
										<JsonSchemaViewer
											schema={toolDetails.outputSchema}
											title="Output Schema"
											className="border-0 shadow-none bg-transparent"
											hideHeader={true}
										/>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}

export { AgentToolCard };
