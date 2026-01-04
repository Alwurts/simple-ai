"use client";

import { LayoutDashboard, type LucideIcon, MessagesSquare, Package, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { LogoAlwurtsMonochrome } from "@/components/icons/logo-monochrome";
import { AppUserNav } from "@/components/layout/app-user-nav";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";

type NavigationItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	activeMatcher: RegExp;
};

const mainNavigationItems: NavigationItem[] = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
		activeMatcher: /\/dashboard/,
	},
	{
		title: "Chat",
		url: "/chat",
		icon: MessagesSquare,
		activeMatcher: /\/chat/,
	},
	{
		title: "Inventory",
		url: "/inventory",
		icon: Package,
		activeMatcher: /\/inventory/,
	},
];

export function AppSidebar() {
	const [_searchOpen, setSearchOpen] = React.useState(false);

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						{/* Logo Area */}
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<LogoAlwurtsMonochrome className="h-5 w-5" />
						</div>

						{/* App Title (Visible when expanded) */}
						<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
							<span className="font-semibold truncate block">simple-ai</span>
							<span className="text-xs text-muted-foreground truncate block">App Template</span>
						</div>

						{/* Top Actions (Search + Toggle) */}
						<div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
							<SidebarMenuButton
								tooltip="Search"
								variant="default"
								size="sm"
								className="h-8 w-8"
								onClick={() => setSearchOpen(true)}
							>
								<Search className="size-4" />
								<span className="sr-only">Search</span>
							</SidebarMenuButton>

							<SidebarTrigger className="h-8 w-8 md:flex hidden" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Collapsed Mode: Search + Toggle Buttons */}
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<SidebarMenuItem>
						<SidebarTrigger className="h-8 w-8" />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Search" onClick={() => setSearchOpen(true)}>
							<Search />
							<span>Search</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<AppSidebarMainNavigation />
			</SidebarContent>
			<SidebarFooter>
				<AppUserNav />
			</SidebarFooter>
		</Sidebar>
	);
}

export function AppSidebarMainNavigation() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{mainNavigationItems.map((item) => (
					<SidebarMenuItem key={`${item.title}-${item.url}`}>
						<SidebarMenuButton tooltip={item.title} asChild>
							<Link href={item.url}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
