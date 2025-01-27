import { cn } from "@/lib/utils";
import { BaseNode, type BaseNodeProps } from "@/registry/ui/flow/base-node";
import { NodeResizer } from "@xyflow/react";
import React from "react";

export const ResizableNode = React.forwardRef<HTMLDivElement, BaseNodeProps>(
	(
		{ className, selected, executionStatus, style, children, ...props },
		ref,
	) => (
		<BaseNode
			ref={ref}
			style={{
				...style,
				minHeight: 200,
				minWidth: 250,
				maxHeight: 800,
				maxWidth: 800,
			}}
			className={cn(className, "h-full")}
			{...props}
		>
			<NodeResizer
				/* minHeight={200}
				minWidth={250}
				maxHeight={800}
				maxWidth={800} */
				isVisible={selected}
			/>
			{children}
		</BaseNode>
	),
);
ResizableNode.displayName = "ResizableNode";
