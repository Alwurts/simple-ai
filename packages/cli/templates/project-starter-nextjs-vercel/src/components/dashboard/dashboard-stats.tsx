"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/query/use-inventory";

export function DashboardStats() {
	const { data: products } = useProducts();

	const totalSKUs = products?.length || 0;
	const totalValue =
		products?.reduce((sum, p) => sum + p.totalStock * parseFloat(p.price || "0"), 0) || 0;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalSKUs}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
				</CardContent>
			</Card>
		</div>
	);
}
