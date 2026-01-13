import * as React from "react";
import type { z } from "zod";
import { BlockViewer } from "@/ui-registry/components/block-viewer";
import { highlightCode } from "@/ui-registry/lib/highlight-code";
import { createFileTreeForRegistryItemFiles, getRegistryItem } from "@/ui-registry/lib/registry";
import type { registryItemFileSchema } from "@/ui-registry/registry/schema";

export async function BlockDisplay({ name }: { name: string }) {
	const item = await getCachedRegistryItem(name);

	if (!item?.files) {
		return null;
	}

	const [tree, highlightedFiles] = await Promise.all([
		getCachedFileTree(item.files),
		getCachedHighlightedFiles(item.files),
	]);

	return <BlockViewer item={item} tree={tree} highlightedFiles={highlightedFiles} />;
}

const getCachedRegistryItem = React.cache(async (name: string) => {
	return await getRegistryItem(name);
});

const getCachedFileTree = React.cache(async (files: Array<{ path: string; target?: string }>) => {
	if (!files) {
		return null;
	}

	return await createFileTreeForRegistryItemFiles(files);
});

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
