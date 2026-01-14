"use client";

import { AppBreadcrumbs } from "@/ui-registry/registry/ui/app-breadcrumbs";

export function AppBreadcrumbsExample() {
	return (
		<div className="p-4">
			<AppBreadcrumbs
				items={[
					{ title: "Dashboard", href: "/" },
					{ title: "Inventory", href: "/inventory" },
					{ title: "Products" },
				]}
			/>
		</div>
	);
}
