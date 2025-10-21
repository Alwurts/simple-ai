import Image from "next/image";
import * as React from "react";

import { getRegistryItem } from "@/lib/registry";

export async function BlockPreview({ name }: { name: string }) {
	const item = await getCachedRegistryItem(name);

	if (!item) {
		return null;
	}

	return (
		<div
			className="group/block-preview flex min-w-0 scroll-mt-24 flex-col items-stretch gap-4"
			style={
				{
					"--height": item.meta?.iframeHeight ?? "930px",
				} as React.CSSProperties
			}
		>
			{/* Mobile view - shows images */}
			<div className="flex flex-col gap-2 lg:hidden">
				<div className="overflow-hidden rounded-xl border">
					<Image
						src={`/r/${item.name}-light.png`}
						alt={item.name}
						data-block={item.name}
						width={1440}
						height={900}
						className="object-cover dark:hidden"
					/>
					<Image
						src={`/r/${item.name}-dark.png`}
						alt={item.name}
						data-block={item.name}
						width={1440}
						height={900}
						className="hidden object-cover dark:block"
					/>
				</div>
			</div>

			{/* Desktop view - shows iframe */}
			<div className="hidden lg:flex lg:h-(--height)">
				<div className="relative grid w-full gap-4">
					<div className="absolute inset-0 right-4 bg-muted rounded-xl"></div>
					<div className="after:bg-surface/50 relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl">
						<div className="bg-background relative aspect-[4/2.5] overflow-hidden rounded-lg border md:aspect-auto md:rounded-xl">
							<iframe
								title="Block Preview"
								src={`/view/${item.name}`}
								height={item.meta?.iframeHeight ?? 930}
								loading="lazy"
								className="bg-background no-scrollbar relative z-20 w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const getCachedRegistryItem = React.cache(async (name: string) => {
	return await getRegistryItem(name);
});
