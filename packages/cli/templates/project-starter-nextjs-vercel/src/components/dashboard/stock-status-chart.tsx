"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useInventoryMetrics } from "@/hooks/query/use-inventory";

const chartConfig = {
	inStock: {
		label: "In Stock",
		color: "var(--chart-2)",
	},
	lowStock: {
		label: "Low Stock",
		color: "var(--chart-4)",
	},
	outOfStock: {
		label: "Out of Stock",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

export function StockStatusChart() {
	const { data: metrics, isLoading } = useInventoryMetrics();

	const stats = (metrics?.activeProducts || []).reduce(
		(acc, product) => {
			if (product.totalStock === 0) {
				acc.outOfStock++;
			} else if (product.totalStock <= (product.minStockLevel ?? 5)) {
				acc.lowStock++;
			} else {
				acc.inStock++;
			}
			return acc;
		},
		{ inStock: 0, lowStock: 0, outOfStock: 0 },
	);

	const data = [
		{ name: "inStock", value: stats.inStock, fill: "var(--color-inStock)" },
		{ name: "lowStock", value: stats.lowStock, fill: "var(--color-lowStock)" },
		{ name: "outOfStock", value: stats.outOfStock, fill: "var(--color-outOfStock)" },
	].filter((d) => d.value > 0);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Inventory Health</CardTitle>
					<CardDescription>Current stock status across all products</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<div className="h-[250px] w-full animate-pulse rounded-lg bg-muted/20" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Inventory Health</CardTitle>
				<CardDescription>Current stock status across all products</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
							{data.map((entry) => (
								<Cell key={entry.name} fill={entry.fill} />
							))}
						</Pie>
						<ChartLegend content={<ChartLegendContent nameKey="name" />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
