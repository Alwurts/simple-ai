import * as React from "react";
import type { z } from "zod";
import { AgentViewer } from "@/components/agents/agent-viewer";
import { highlightCode } from "@/lib/highlight-code";
import {
	createFileTreeForRegistryItemFiles,
	getRegistryItem,
} from "@/lib/registry";
import { getToolDetails, type ToolDetails } from "@/lib/tool-metadata";
import type { registryItemFileSchema } from "@/shadcn-temp/schema";

export async function AgentDisplay({ name }: { name: string }) {
	const item = await getCachedRegistryItem(name);

	console.log("item", item);

	if (!item?.files) {
		return null;
	}

	if (!item.categories?.includes("agent")) {
		return null;
	}

	const meta = item.meta as
		| {
				toolIds: string[];
		  }
		| undefined;

	// Get tool files and metadata if agent has tools
	const toolFiles: z.infer<typeof registryItemFileSchema>[] = [];
	const toolMetadata: Record<string, ToolDetails> = {};

	if (meta?.toolIds) {
		// Load tool metadata for all tools in parallel
		const toolMetadataPromises = meta.toolIds.map(async (toolId) => {
			const toolItem = await getRegistryItem(toolId);
			if (toolItem?.files) {
				// Add tool files under lib/ai/tools/ to match the registry structure
				for (const file of toolItem.files) {
					toolFiles.push({
						...file,
						target: `lib/ai/tools/${toolId}.ts`,
					});
				}
			}

			// Extract tool metadata server-side
			const metadata = await getToolDetails(toolId);
			return { toolId, metadata };
		});

		const toolResults = await Promise.all(toolMetadataPromises);
		for (const { toolId, metadata } of toolResults) {
			if (metadata) {
				toolMetadata[toolId] = metadata;
			}
		}
	}

	const allFiles = [...item.files, ...toolFiles];
	const [tree, highlightedFiles] = await Promise.all([
		getCachedFileTree(allFiles),
		getCachedHighlightedFiles(allFiles),
	]);

	return (
		<AgentViewer
			item={item}
			tree={tree}
			highlightedFiles={highlightedFiles}
			agentId={name}
			toolMetadata={toolMetadata}
		/>
	);
}

const getCachedRegistryItem = React.cache(async (name: string) => {
	return await getRegistryItem(name);
});

const getCachedFileTree = React.cache(
	async (files: Array<{ path: string; target?: string }>) => {
		if (!files) {
			return null;
		}

		return await createFileTreeForRegistryItemFiles(files);
	},
);

const getCachedHighlightedFiles = React.cache(
	async (files: z.infer<typeof registryItemFileSchema>[]) => {
		return await Promise.all(
			files.map(async (file) => ({
				...file,
				highlightedContent: await highlightCode(file.content ?? ""),
			})),
		);
	},
);
