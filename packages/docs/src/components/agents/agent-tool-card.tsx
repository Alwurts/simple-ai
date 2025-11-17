"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
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
			<div className="py-3">
				<h4 className="text-sm font-medium">{readableName}</h4>
				<p className="text-muted-foreground text-xs mt-1">
					Tool details unavailable
				</p>
			</div>
		);
	}

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className="group">
				{/* Tool Header */}
				<CollapsibleTrigger className="flex w-full items-start gap-3 py-3 text-left hover:opacity-80 transition-opacity">
					<ChevronRight className="h-4 w-4 mt-0.5 shrink-0 transition-transform data-[state=open]:rotate-90" />
					<div className="flex-1 min-w-0">
						<h4 className="text-sm font-medium">{readableName}</h4>
						<p className="text-muted-foreground text-xs mt-1 leading-relaxed">
							{toolDetails.description}
						</p>
					</div>
				</CollapsibleTrigger>

				{/* Collapsible Schemas */}
				<CollapsibleContent>
					<div className="pl-7 pt-3 space-y-4">
						{toolDetails.inputSchema && (
							<JsonSchemaViewer
								schema={toolDetails.inputSchema}
								title="Input Schema"
							/>
						)}
						{toolDetails.outputSchema && (
							<JsonSchemaViewer
								schema={toolDetails.outputSchema}
								title="Output Schema"
							/>
						)}
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}

export { AgentToolCard };
