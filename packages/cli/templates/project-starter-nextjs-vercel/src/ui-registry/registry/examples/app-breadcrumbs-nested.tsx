"use client";

import { AppBreadcrumbs } from "@/ui-registry/registry/ui/app-breadcrumbs";

export function AppBreadcrumbsNested() {
	return (
		<div className="p-4">
			<AppBreadcrumbs
				items={[
					{ title: "Inventory", href: "/inventory" },
					{ title: "Products", href: "/inventory/products" },
					{ title: "Product Details" },
				]}
			/>
		</div>
	);
}
