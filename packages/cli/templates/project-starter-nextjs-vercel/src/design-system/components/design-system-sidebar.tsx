"use client";

import { Palette } from "lucide-react";
import Link from "next/link";
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
import { designSystemConfig } from "@/design-system/config/design-system";

type NavigationItem = {
	title: string;
	url: string;
	activeMatcher: RegExp;
};

const designSystemNavigationItems: NavigationItem[] = [
	{
		title: "Introduction",
		url: "/design-system",
		activeMatcher: /^\/design-system$/,
	},
	...designSystemConfig.map((component) => ({
		title: component.title,
		url: `/design-system/components/${component.slug}`,
		activeMatcher: new RegExp(`/design-system/components/${component.slug}`),
	})),
];

export function DesignSystemSidebar() {
	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						{/* Logo Area */}
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Palette className="h-5 w-5" />
						</div>

						{/* App Title (Visible when expanded) */}
						<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
							<span className="font-semibold truncate block">Design System</span>
							<span className="text-xs text-muted-foreground truncate block">
								Component Library
							</span>
						</div>

						{/* Toggle Button */}
						<div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
							<SidebarTrigger className="h-8 w-8" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Collapsed Mode: Toggle Button */}
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<SidebarMenuItem>
						<SidebarTrigger className="h-8 w-8" />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<DesignSystemSidebarNavigation />
			</SidebarContent>
			<SidebarFooter>
				{/* Could add user nav or other footer content here if needed */}
			</SidebarFooter>
		</Sidebar>
	);
}

export function DesignSystemSidebarNavigation() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Components</SidebarGroupLabel>
			<SidebarMenu>
				{designSystemNavigationItems.map((item) => (
					<SidebarMenuItem key={`${item.title}-${item.url}`}>
						<SidebarMenuButton tooltip={item.title} asChild>
							<Link href={item.url}>
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
