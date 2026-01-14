"use client";

import { Sidebar, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

function PlaceholderSidebar() {
	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarTrigger />
				<div className="text-sm font-medium group-data-[collapsible=icon]:hidden">
					Placeholder Sidebar
				</div>
			</SidebarHeader>
		</Sidebar>
	);
}

export function AppLayoutExample() {
	return (
		<AppLayout sidebar={<PlaceholderSidebar />}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>Dashboard</AppLayoutHeaderTitle>
				</AppLayoutHeader>
				<AppLayoutContent>
					<div className="p-6">
						<h3 className="text-lg font-medium">Content Area</h3>
						<p>This is the main content area of the application.</p>
					</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
