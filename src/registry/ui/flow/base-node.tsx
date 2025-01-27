import { cn } from "@/lib/utils";
import React from "react";

export type BaseNodeProps = React.HTMLAttributes<HTMLDivElement> & {
	selected?: boolean;
	executionStatus?: "idle" | "processing" | "success" | "error";
};

export const BaseNode = React.forwardRef<HTMLDivElement, BaseNodeProps>(
	({ className, selected, executionStatus, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"relative rounded-md border bg-card text-card-foreground hover:ring-1 hover:ring-orange-500",
				selected && "border-muted-foreground shadow-lg",
				{
					"border-orange-500": executionStatus === "processing",
					"border-red-500": executionStatus === "error",
				},

				className,
			)}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
			tabIndex={0}
			{...props}
		/>
	),
);
BaseNode.displayName = "BaseNode";
