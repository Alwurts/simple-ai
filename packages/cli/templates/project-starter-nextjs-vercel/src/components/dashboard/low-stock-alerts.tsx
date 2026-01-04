"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/query/use-inventory";

export function LowStockAlerts() {
	const { data: products } = useProducts();

	const lowStockProducts =
		products?.filter((p) => p.minStockLevel !== null && p.totalStock < p.minStockLevel) || [];

	if (lowStockProducts.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="h-5 w-5 text-yellow-500" />
					Low Stock Alerts
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{lowStockProducts.map((product) => (
						<li key={product.id} className="flex justify-between">
							<span>
								{product.name} ({product.sku})
							</span>
							<span className="text-red-500">
								{product.totalStock} / {product.minStockLevel}
							</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
