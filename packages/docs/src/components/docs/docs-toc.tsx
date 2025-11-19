"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function useActiveItem(itemIds: string[]) {
	const [activeId, setActiveId] = React.useState<string | null>(null);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ rootMargin: "0% 0% -80% 0%" },
		);

		for (const id of itemIds ?? []) {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		}

		return () => {
			for (const id of itemIds ?? []) {
				const element = document.getElementById(id);
				if (element) {
					observer.unobserve(element);
				}
			}
		};
	}, [itemIds]);

	return activeId;
}

export function DocsTableOfContents({
	toc,
	className,
}: {
	toc: {
		title?: React.ReactNode;
		url: string;
		depth: number;
	}[];
	className?: string;
}) {
	const itemIds = React.useMemo(
		() => toc.map((item) => item.url.replace("#", "")),
		[toc],
	);
	const activeHeading = useActiveItem(itemIds);

	if (!toc?.length) {
		return null;
	}

	return (
		<div className={cn("flex flex-col gap-3 pb-8", className)}>
			<h4 className="text-foreground/70 px-1 text-xs font-bold uppercase tracking-wider">
				On This Page
			</h4>
			<div className="flex flex-col gap-0.5">
				{toc.map((item) => {
					const isActive = item.url === `#${activeHeading}`;
					return (
						<a
							key={item.url}
							href={item.url}
							data-active={isActive}
							data-depth={item.depth}
							className={cn(
								"relative block py-1.5 text-sm transition-colors",
								// Indentation for depth
								item.depth === 3 ? "pl-6" : "pl-3",
								item.depth === 4 ? "pl-9" : "",

								// Default State
								"text-muted-foreground hover:text-foreground",

								// Active State: Brand color text + Border Indicator
								isActive && "font-medium text-brand",
							)}
						>
							{/* Active Indicator Line */}
							{isActive && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-r-full bg-brand" />
							)}
							{item.title}
						</a>
					);
				})}
			</div>
		</div>
	);
}
