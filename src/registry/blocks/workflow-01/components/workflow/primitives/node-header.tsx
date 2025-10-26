import { Slot } from "@radix-ui/react-slot";
import { AlertCircle, EllipsisVertical } from "lucide-react";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function NodeHeader({
	className,
	children,
	...props
}: ComponentProps<"header">) {
	return (
		<header
			{...props}
			className={cn(
				"mb-4 flex items-center justify-between gap-2 px-3 py-2",
				"-mx-5 -mt-5",
				className,
			)}
		>
			<TooltipProvider>{children}</TooltipProvider>
		</header>
	);
}

export function NodeHeaderTitle({
	className,
	asChild,
	...props
}: React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "h3";

	return (
		<Comp
			{...props}
			className={cn(className, "user-select-none flex-1 font-semibold")}
		/>
	);
}

export function NodeHeaderIcon({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return <span {...props} className={cn(className, "*:size-5")} />;
}

export function NodeHeaderActions({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={cn(
				"ml-auto flex items-center gap-1 justify-self-end",
				className,
			)}
		/>
	);
}

export function NodeHeaderAction({
	className,
	label,
	title,
	...props
}: ComponentProps<typeof Button> & { label: string }) {
	return (
		<Button
			variant="ghost"
			aria-label={label}
			title={title ?? label}
			className={cn(className, "nodrag size-6 p-1")}
			{...props}
		/>
	);
}

export function NodeHeaderMenuAction({
	trigger,
	children,
	...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & {
	label: string;
	trigger?: React.ReactNode;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<NodeHeaderAction {...props}>
					{trigger ?? <EllipsisVertical />}
				</NodeHeaderAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent>{children}</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const NodeHeaderStatus = ({
	status,
	errors,
}: {
	status?: "idle" | "processing" | "success" | "error";
	errors?: { message: string }[];
}) => {
	const hasErrors = errors && errors.length > 0;

	const statusColors = {
		idle: "bg-muted text-muted-foreground",
		processing: "bg-orange-500 text-white",
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
		validation: "bg-red-600 text-white",
	};

	if (hasErrors) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge
						variant="secondary"
						className={cn(
							"mr-2 font-normal flex items-center gap-1",
							statusColors.validation,
						)}
					>
						<AlertCircle className="w-3 h-3" />
						Error
					</Badge>
				</TooltipTrigger>
				<TooltipContent className="max-w-xs">
					<div className="space-y-1">
						{errors.map((error, idx) => (
							<div
								key={`error-${
									// biome-ignore lint/suspicious/noArrayIndexKey: Needed for error message
									idx
								}`}
								className="text-xs"
							>
								{error.message}
							</div>
						))}
					</div>
				</TooltipContent>
			</Tooltip>
		);
	}

	return (
		<Badge
			variant="secondary"
			className={cn("mr-2 font-normal", status && statusColors[status])}
		>
			{status ? status : "idle"}
		</Badge>
	);
};

NodeHeaderStatus.displayName = "NodeHeaderStatus";
