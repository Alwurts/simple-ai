import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppHeader({ children }: React.ComponentProps<"div">) {
	return (
		<header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1 md:hidden" />
				<AppHeaderSeparator className="md:hidden" />
				{children}
			</div>
		</header>
	);
}

export function AppHeaderIcon({
	children,
	className,
}: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"flex justify-center items-center [&_svg]:size-5",
				className,
			)}
		>
			{children}
		</span>
	);
}

export function AppHeaderTitle({
	children,
	className,
}: React.ComponentProps<"span">) {
	return (
		<span className={cn("text-base font-medium", className)}>
			{children}
		</span>
	);
}

export function AppHeaderSeparator({ className }: React.ComponentProps<"div">) {
	return (
		<Separator
			orientation="vertical"
			className={cn("mx-2 data-[orientation=vertical]:h-4", className)}
		/>
	);
}
