"use client";

import { Settings } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutWithActions() {
	return (
		<AppLayout sidebar={<AppSidebar />}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>Dashboard</AppLayoutHeaderTitle>
					<AppLayoutHeaderActions>
						<Button variant="outline" size="sm">
							<Settings className="h-4 w-4" />
							Settings
						</Button>
					</AppLayoutHeaderActions>
				</AppLayoutHeader>
				<AppLayoutContent>
					<div className="p-6">
						<h3 className="text-lg font-medium">Content Area</h3>
						<p>This layout includes header actions for additional functionality.</p>
					</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
