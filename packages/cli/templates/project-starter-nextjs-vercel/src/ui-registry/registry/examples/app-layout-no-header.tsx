"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppLayout, AppLayoutContent, AppLayoutPage } from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutNoHeader() {
	return (
		<AppLayout sidebar={<AppSidebar />}>
			<AppLayoutPage>
				<AppLayoutContent>
					<div className="p-6">
						<h3 className="text-lg font-medium">Content Area</h3>
						<p>This layout has no header, providing a minimal interface.</p>
					</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
