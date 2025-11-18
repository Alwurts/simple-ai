import { BlockDisplay } from "@/components/blocks/block-display";
import { getAllRegistryItemIds } from "@/lib/registry";
import { registryCategories } from "@/registry/registry-categories";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
	return registryCategories.map((category) => ({
		categories: [category.slug],
	}));
}

const EXCLUDED_BLOCKS = ["chat-01"];

export default async function BlocksPage({
	params,
}: {
	params: Promise<{ categories?: string[] }>;
}) {
	const { categories = [] } = await params;
	const blocks = await getAllRegistryItemIds(["registry:block"], categories);

	return (
		<div className="flex flex-col gap-12 md:gap-24">
			{blocks
				.filter((name) => !EXCLUDED_BLOCKS.includes(name))
				.map((name) => (
					<BlockDisplay name={name} key={name} />
				))}
		</div>
	);
}
