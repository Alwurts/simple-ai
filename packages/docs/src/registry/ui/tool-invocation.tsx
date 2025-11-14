"use client";

import { AlertCircle, CheckCircleIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Card } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export function ToolInvocation({
	className,
	...props
}: ComponentProps<typeof Card>) {
	return (
		<Card
			className={cn("max-w-full overflow-hidden p-0 gap-0", className)}
			{...props}
		/>
	);
}

export function ToolInvocationHeader({
	className,
	...props
}: ComponentProps<"div">) {
	return <div className={cn("px-4 py-3 border-b", className)} {...props} />;
}

export function ToolInvocationName({
	name,
	capitalize = true,
	type,
	isError = false,
	className,
}: {
	name: string;
	capitalize?: boolean;
	type:
		| "input-streaming"
		| "input-available"
		| "output-available"
		| "output-error";
	isError?: boolean;
	className?: string;
}) {
	// Combine explicit error state with passed error flag
	const hasError = type === "output-error" || isError;

	return (
		<div className={cn("flex items-center gap-2 text-sm", className)}>
			{(type === "input-streaming" || type === "input-available") && (
				<ToolInvocationLoadingIcon
					className="size-4 text-muted-foreground"
					duration="2s"
				/>
			)}
			{type === "output-available" && !hasError && (
				<CheckCircleIcon className="size-4 text-muted-foreground" />
			)}
			{hasError && <AlertCircle className="size-4 text-red-500" />}
			<span className={cn("font-medium", hasError && "text-red-600")}>
				{idToReadableText(name, { capitalize })}
			</span>
		</div>
	);
}

export function ToolInvocationContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div>
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-muted-foreground">
					Tool Details
				</span>
			</div>

			<div className={cn("px-4 py-3 space-y-4", className)}>
				{children}
			</div>
		</div>
	);
}

export function ToolInvocationContentCollapsible({
	children,
	className,
	defaultOpen = false,
	open: controlledOpen,
}: {
	children: React.ReactNode;
	className?: string;
	defaultOpen?: boolean;
	open?: boolean;
}) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

	return (
		<Collapsible
			open={open}
			onOpenChange={
				controlledOpen !== undefined ? undefined : setInternalOpen
			}
		>
			<CollapsibleTrigger className="w-full px-4 py-2 text-left border-b bg-muted/30 hover:bg-muted/50 transition-colors">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-muted-foreground">
						Tool Details
					</span>
					<span className="text-xs text-muted-foreground">
						{open ? "collapse" : "expand"}
					</span>
				</div>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className={cn("px-4 py-3 space-y-4", className)}>
					{children}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

export function ToolInvocationRawData({
	data,
	title = "Data",
}: {
	data: unknown;
	title?: string;
}) {
	return (
		<div className="space-y-2">
			<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
				{title}
			</h4>
			<div className="max-h-48 overflow-auto">
				<pre className="whitespace-pre-wrap break-all font-mono text-xs bg-muted/50 p-3 rounded-md border">
					{JSON.stringify(data, null, 2)}
				</pre>
			</div>
		</div>
	);
}

export function ToolInvocationLoadingIcon({
	duration = "3s",
	sphereRadius = 20,
	...props
}: ComponentProps<"svg"> & { duration?: string; sphereRadius?: number }) {
	const topPos = { x: 50, y: sphereRadius };
	const bottomLeftPos = { x: sphereRadius, y: 100 - sphereRadius };
	const bottomRightPos = { x: 100 - sphereRadius, y: 100 - sphereRadius };

	const path1to2 = `M 0 0 L ${bottomLeftPos.x - topPos.x} ${bottomLeftPos.y - topPos.y}`;
	const path2to3 = `M 0 0 L ${bottomRightPos.x - bottomLeftPos.x} ${bottomRightPos.y - bottomLeftPos.y}`;
	const path3to1 = `M 0 0 L ${topPos.x - bottomRightPos.x} ${topPos.y - bottomRightPos.y}`;

	return (
		<svg
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			color="currentColor" // Explicitly set color for inheritance
			preserveAspectRatio="xMidYMid meet"
			fill="currentColor" // Set default fill for children
			{...props} // Pass className, style, id etc.
		>
			<title>Loading Pyramid</title>

			<circle cx={topPos.x} cy={topPos.y} r={sphereRadius}>
				<animateMotion
					path={path1to2}
					dur={duration}
					repeatCount="indefinite"
					calcMode="linear"
				/>
			</circle>

			<circle cx={bottomLeftPos.x} cy={bottomLeftPos.y} r={sphereRadius}>
				<animateMotion
					path={path2to3}
					dur={duration}
					repeatCount="indefinite"
					calcMode="linear"
				/>
			</circle>

			<circle
				cx={bottomRightPos.x}
				cy={bottomRightPos.y}
				r={sphereRadius}
			>
				<animateMotion
					path={path3to1}
					dur={duration}
					repeatCount="indefinite"
					calcMode="linear"
				/>
			</circle>
		</svg>
	);
}
