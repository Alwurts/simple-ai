import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function BaseNode({
	className,
	selected,
	...props
}: ComponentProps<"div"> & { selected?: boolean }) {
	return (
		<div
			className={cn(
				"relative rounded-md border bg-card p-5 text-card-foreground",
				className,
				selected ? "border-muted-foreground shadow-lg" : "",
				"hover:ring-1",
			)}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: Needed
			tabIndex={0}
			{...props}
		/>
	);
}
