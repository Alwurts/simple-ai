"use client";

import { AppBreadcrumbs } from "@/ui-registry/registry/ui/app-breadcrumbs";

export function AppBreadcrumbsHome() {
	return (
		<div className="p-4">
			<AppBreadcrumbs items={[{ title: "Dashboard" }]} />
		</div>
	);
}
