"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";
import { JsonSchemaViewer } from "@/registry/ui/json-schema-viewer";
import { useAgentViewer } from "./agent-viewer";

function ToolCard({ toolId }: { toolId: string }) {
	const { toolMetadata } = useAgentViewer();
	const toolDetails = toolMetadata[toolId];
	const readableName = idToReadableText(toolId);

	if (!toolDetails) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-lg">{readableName}</CardTitle>
					<CardDescription>Tool details unavailable</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">{readableName}</CardTitle>
				<CardDescription>{toolDetails.description}</CardDescription>
			</CardHeader>
			{toolDetails.inputSchema && (
				<CardContent>
					<div className="space-y-3">
						<h5 className="text-sm font-medium">Input Schema:</h5>
						<JsonSchemaViewer schema={toolDetails.inputSchema} />
					</div>
				</CardContent>
			)}
			{toolDetails.outputSchema && (
				<CardContent>
					<div className="space-y-3">
						<h5 className="text-sm font-medium">Output Schema:</h5>
						<JsonSchemaViewer schema={toolDetails.outputSchema} />
					</div>
				</CardContent>
			)}
		</Card>
	);
}

export { ToolCard };
