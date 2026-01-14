import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AppBlockPage } from "@/ui-registry/components/pages/app-blocks-page";
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
		const ids = await getAllRegistryItemIds(["registry:block"]);
		return ids.map((name) => ({
			name,
		}));
	} catch {
		return [];
	}
}

export default async function BlockPage({
	params,
}: {
	params: Promise<{
		name: string;
	}>;
}) {
	const { name } = await params;
	const item = await getCachedRegistryItem(name);

	if (!item || item.type !== "registry:block") {
		return notFound();
	}

	return (
		<AppBlockPage name={name} title={item.title || item.name} description={item.description} />
	);
}
