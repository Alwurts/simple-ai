"use client";

import type { HandleProps } from "@xyflow/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { BaseHandle } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-handle";

const flexDirections = {
	top: "flex-col",
	right: "flex-row-reverse justify-end",
	bottom: "flex-col-reverse justify-end",
	left: "flex-row",
};

export function LabeledHandle({
	position,
	className,
	handleClassName,
	labelClassName,
	title,
	...props
}: ComponentProps<"div"> &
	HandleProps & {
		position: ComponentProps<typeof BaseHandle>["position"];
		handleClassName?: string;
		labelClassName?: string;
		title: string;
	}) {
	return (
		<div
			className={cn(
				"relative flex items-center",
				flexDirections[position],
				className,
			)}
		>
			<BaseHandle
				position={position}
				className={handleClassName}
				{...props}
			/>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: Needed */}
			<label className={cn("px-3 text-foreground", labelClassName)}>
				{title}
			</label>
		</div>
	);
}
