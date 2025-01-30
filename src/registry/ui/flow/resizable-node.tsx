import { cn } from "@/lib/utils";
import { BaseNode } from "@/registry/ui/flow/base-node";
import { NodeResizer } from "@xyflow/react";
import React from "react";

export const ResizableNode = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		selected: boolean;
	}
>(({ className, selected, style, children, ...props }, ref) => (
	<BaseNode
		ref={ref}
		style={{
			...style,
			minHeight: 200,
			minWidth: 250,
			maxHeight: 800,
			maxWidth: 800,
		}}
		className={cn(className, "h-full p-0 hover:ring-orange-500")}
		{...props}
	>
		<NodeResizer isVisible={selected} />
		{children}
	</BaseNode>
));
ResizableNode.displayName = "ResizableNode";
