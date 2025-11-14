import type { VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircleIcon, CircleDashed, Play } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export function NodeExecutionStatus({
	className,
	...props
}: ComponentProps<"div">) {
	return <div className={cn("max-w-full", className)} {...props} />;
}

export function NodeExecutionStatusHeader({
	className,
	...props
}: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"px-2 py-1.5 flex items-center gap-2 rounded-md bg-muted/40",
				className,
			)}
			{...props}
		/>
	);
}

export function NodeExecutionStatusIcon({
	status,
	className,
	...props
}: ComponentProps<"svg"> & {
	status: "idle" | "running" | "processing" | "success" | "error";
}) {
	switch (status) {
		case "idle":
			return (
				<CircleDashed
					className={cn("size-3.5 text-muted-foreground", className)}
					{...props}
				/>
			);
		case "running":
		case "processing":
			return (
				<Play
					className={cn(
						"size-3.5 text-blue-500 animate-pulse",
						className,
					)}
					{...props}
				/>
			);
		case "success":
			return (
				<CheckCircleIcon
					className={cn("size-3.5 text-green-500", className)}
					{...props}
				/>
			);
		case "error":
			return (
				<AlertCircle
					className={cn("size-3.5 text-red-500", className)}
					{...props}
				/>
			);
	}
}

export function NodeExecutionStatusContent({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex-1 flex items-center gap-2", className)}>
			{children}
		</div>
	);
}

export function NodeExecutionStatusName({
	nodeId,
	capitalize = true,
	className,
}: {
	nodeId: string;
	capitalize?: boolean;
	className?: string;
}) {
	return (
		<span className={cn("font-medium text-sm", className)}>
			{idToReadableText(nodeId, { capitalize })}
		</span>
	);
}

export function NodeExecutionStatusBadge({
	status,
	className,
	...props
}: ComponentProps<"div"> & {
	status: "idle" | "running" | "processing" | "success" | "error";
}) {
	const getStatusBadgeVariant = (): VariantProps<
		typeof badgeVariants
	>["variant"] => {
		switch (status) {
			case "idle":
				return "outline";
			case "running":
			case "processing":
				return "default";
			case "success":
				return "secondary";
			case "error":
				return "destructive";
		}
	};

	const getStatusText = () => {
		switch (status) {
			case "idle":
				return "Idle";
			case "running":
				return "Running";
			case "processing":
				return "Processing";
			case "success":
				return "Success";
			case "error":
				return "Error";
		}
	};

	return (
		<Badge
			variant={getStatusBadgeVariant()}
			className={cn("text-xs h-4 px-1.5 py-0", className)}
			{...props}
		>
			{getStatusText()}
		</Badge>
	);
}

export function NodeExecutionStatusType({
	nodeType,
	capitalize = true,
	className,
	...props
}: ComponentProps<"span"> & {
	nodeType: string;
	capitalize?: boolean;
}) {
	return (
		<span
			className={cn("text-xs text-muted-foreground", className)}
			{...props}
		>
			{idToReadableText(nodeType, { capitalize })} node
		</span>
	);
}

export function NodeExecutionStatusError({
	className,
	...props
}: ComponentProps<"p">) {
	return (
		<div
			className={cn(
				"px-2 py-1 mt-1 rounded-md bg-red-50 dark:bg-red-950/20",
				className,
			)}
		>
			<p className="text-xs text-red-600 dark:text-red-400" {...props} />
		</div>
	);
}
