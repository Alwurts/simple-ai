import type { ComponentProps } from "react";
import {
	Sidebar,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppLayout(props: ComponentProps<typeof SidebarProvider>) {
	return (
		<SidebarProvider
			defaultOpen={true}
			style={{
				// @ts-expect-error CSS custom properties
				"--sidebar-width": "28rem",
				"--sidebar-width-mobile": "30rem",
			}}
			{...props}
		/>
	);
}

export function AppLayoutInset({
	className,
	...props
}: ComponentProps<typeof SidebarInset>) {
	return <SidebarInset className={className} {...props} />;
}

export function AppLayoutSidebar({
	className,
	side = "right",
	...props
}: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			className={cn("bg-background", className)}
			side={side}
			{...props}
		/>
	);
}
