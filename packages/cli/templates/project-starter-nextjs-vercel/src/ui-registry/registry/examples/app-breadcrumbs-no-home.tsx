"use client";

import { AppBreadcrumbs } from "@/ui-registry/registry/ui/app-breadcrumbs";

export function AppBreadcrumbsNoHome() {
	return (
		<div className="p-4">
			<AppBreadcrumbs
				items={[{ title: "Settings", href: "/settings" }, { title: "Profile" }]}
				showHome={false}
			/>
		</div>
	);
}
