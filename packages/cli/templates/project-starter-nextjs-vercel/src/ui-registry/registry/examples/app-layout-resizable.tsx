"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderTitle,
	AppLayoutPage,
	AppLayoutResizable,
	AppLayoutResizablePanelPrimary,
	AppLayoutResizablePanelSecondary,
} from "@/ui-registry/registry/ui/app-layout";

export function AppLayoutResizableExample() {
	return (
		<AppLayout sidebar={<AppSidebar />}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>Resizable Layout</AppLayoutHeaderTitle>
				</AppLayoutHeader>
				<AppLayoutContent>
					<AppLayoutResizable>
						<AppLayoutResizablePanelPrimary>
							<div className="p-6">
								<h3 className="text-lg font-medium">Main Content</h3>
								<p>This is the primary resizable panel.</p>
							</div>
						</AppLayoutResizablePanelPrimary>
						<AppLayoutResizablePanelSecondary id="secondary-panel">
							<div className="p-6">
								<h3 className="text-lg font-medium">Secondary Panel</h3>
								<p>This panel can be resized and toggled.</p>
							</div>
						</AppLayoutResizablePanelSecondary>
					</AppLayoutResizable>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
