import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ComponentPreview } from "@/ui-registry/components/component-display";
import { getAllRegistryItemIds, getRegistryItem } from "@/ui-registry/lib/registry";

export const revalidate = false;
export const dynamic = "force-dynamic";

const getCachedRegistryItem = cache(async (name: string) => {
	return await getRegistryItem(name);
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{
		name: string;
	}>;
}): Promise<Metadata> {
	const { name } = await params;
	const item = await getCachedRegistryItem(name);

	if (!item) {
		return {};
	}

	return {
		title: item.title || item.name,
		description: item.description,
	};
}

export async function generateStaticParams() {
	try {
		const ids = await getAllRegistryItemIds(["registry:ui"]);
		return ids.map((name) => ({
			name,
		}));
	} catch {
		return [];
	}
}

export default async function ComponentPage({
	params,
}: {
	params: Promise<{
		name: string;
	}>;
}) {
	const { name } = await params;
	const item = await getCachedRegistryItem(name);

	if (!item || item.type !== "registry:ui") {
		return notFound();
	}

	return (
		<div className="space-y-8 p-8">
			<div className="space-y-4">
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{item.title || item.name}</h1>
				{item.description && <p className="text-lg text-muted-foreground">{item.description}</p>}
			</div>

			<ComponentPreview name={name} />
		</div>
	);
}
