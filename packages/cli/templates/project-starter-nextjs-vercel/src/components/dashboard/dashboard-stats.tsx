"use client";

import { ArrowDownLeft, Package } from "lucide-react";
import Link from "next/link";
import { CreateProductDialog } from "@/components/inventory/create-product-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/query/use-inventory";

export function DashboardStats() {
	const { data: products } = useProducts();

	const totalSKUs = products?.length || 0;
	const totalValue =
		products?.reduce((sum, p) => sum + p.totalStock * parseFloat(p.price || "0"), 0) || 0;

	return (
		<div className="grid gap-4 @md:grid-cols-2 @lg:grid-cols-4">
			<Card className="border-primary/20 bg-primary/5">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium text-primary">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-2">
					<CreateProductDialog />
					<Button variant="outline" className="w-full justify-start" asChild>
						<Link href="/inventory">
							<ArrowDownLeft className="mr-2 h-4 w-4" />
							Receive Stock
						</Link>
					</Button>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalSKUs}</div>
					<p className="text-xs text-muted-foreground">Active products</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
					<p className="text-xs text-muted-foreground">Current asset value</p>
				</CardContent>
			</Card>
		</div>
	);
}
