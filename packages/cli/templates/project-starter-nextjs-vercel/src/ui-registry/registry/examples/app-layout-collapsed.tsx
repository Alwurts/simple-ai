"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutCollapsed() {
	return (
		<AppLayout sidebar={<AppSidebar />} defaultOpen={false}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>Collapsed Sidebar</AppLayoutHeaderTitle>
				</AppLayoutHeader>
				<AppLayoutContent>
					<div className="p-6">
						<h3 className="text-lg font-medium">Content Area</h3>
						<p>This layout starts with the sidebar collapsed by default.</p>
					</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
