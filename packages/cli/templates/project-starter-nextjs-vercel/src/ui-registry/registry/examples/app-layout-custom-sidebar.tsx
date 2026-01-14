"use client";

import { FileText, Home, Settings } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutCustomSidebar() {
	const customSidebar = (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<div className="h-6 w-6 rounded bg-primary" />
					<span className="font-semibold">Custom App</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Home className="h-4 w-4" />
								<span>Home</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<FileText className="h-4 w-4" />
								<span>Documents</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<Settings className="h-4 w-4" />
								<span>Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);

	return (
		<AppLayout sidebar={customSidebar}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>Custom Sidebar</AppLayoutHeaderTitle>
				</AppLayoutHeader>
				<AppLayoutContent>
					<div className="p-6">
						<h3 className="text-lg font-medium">Content Area</h3>
						<p>This layout uses a custom sidebar instead of the default AppSidebar.</p>
					</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
