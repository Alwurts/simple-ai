"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutBasic() {
	return (
		<AppLayout sidebar={<AppSidebar />}>
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
