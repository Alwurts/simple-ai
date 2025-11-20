"use client";

import { MessageCircle, PanelLeft, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppMainNav } from "@/registry/blocks/chat-04/components/layout/app-main-nav";
import { AppSecondaryNav } from "@/registry/blocks/chat-04/components/layout/app-secondary-nav";
import { AppUserNav } from "@/registry/blocks/chat-04/components/layout/app-user-nav";

export function AppSidebar({ children }: ComponentProps<typeof Sidebar>) {
	const { toggleSidebar } = useSidebar();
	const pathname = usePathname();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center justify-between">
						<div className="flex size-7 group-data-[collapsible=icon]:hidden items-center justify-center rounded-lg bg-primary">
							<MessageCircle className="h-5 w-5 text-primary-foreground" />
						</div>

						<SidebarMenuButton
							className="w-fit [&>svg]:size-5 md:flex justify-center hidden"
							tooltip="Toggle Sidebar"
							variant="default"
							onClick={toggleSidebar}
						>
							<PanelLeft />
							<span className="sr-only">Toggle Sidebar</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center justify-between">
						<SidebarMenuButton
							tooltip="Search"
							variant="outline"
							className={cn(
								"group-data-[collapsible=icon]:bg-sidebar",
								"group-data-[collapsible=icon]:hover:bg-sidebar-accent",
								"group-data-[collapsible=icon]:shadow-none",
								"group-data-[collapsible=icon]:hover:shadow-none",
							)}
						>
							<Search />
							<span>Search</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<SidebarSeparator />
				<AppMainNav currentPath={pathname} />
				<SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
				{children}
				<AppSecondaryNav currentPath={pathname} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<AppUserNav />
			</SidebarFooter>
		</Sidebar>
	);
}
