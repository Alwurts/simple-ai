import { cn } from "@/lib/utils";
import React from "react";

export const BaseNode = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }
>(({ className, selected, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"relative rounded-md border bg-card p-5 text-card-foreground",
			className,
			selected ? "border-muted-foreground shadow-lg" : "",
			"hover:ring-1",
		)}
		// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
		tabIndex={0}
		{...props}
	/>
));
BaseNode.displayName = "BaseNode";
