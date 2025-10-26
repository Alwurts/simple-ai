import { NodeResizer } from "@xyflow/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-node";

export function ResizableNode({
	className,
	selected,
	style,
	children,
	...props
}: ComponentProps<typeof BaseNode>) {
	return (
		<BaseNode
			style={{
				...style,
				minHeight: 200,
				minWidth: 250,
				maxHeight: 800,
				maxWidth: 800,
			}}
			className={cn("h-full p-0 hover:ring-orange-500", className)}
			{...props}
		>
			<NodeResizer isVisible={selected} />
			{children}
		</BaseNode>
	);
}
