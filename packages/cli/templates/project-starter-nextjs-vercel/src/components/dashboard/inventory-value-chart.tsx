"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useInventoryMetrics } from "@/hooks/query/use-inventory";

const chartConfig = {
	value: {
		label: "Value",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function InventoryValueChart() {
	const { data: metrics, isLoading } = useInventoryMetrics();

	// Calculate total value per product and sort by top 5
	const data =
		metrics?.activeProducts
			.map((p) => ({
				name: p.name,
				value: p.totalStock * parseFloat(p.price || "0"),
			}))
			.sort((a, b) => b.value - a.value)
			.slice(0, 5) || [];

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Top Inventory Value</CardTitle>
					<CardDescription>Highest value assets by stock × price</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="h-[250px] w-full animate-pulse rounded-lg bg-muted/20" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top Inventory Value</CardTitle>
				<CardDescription>Highest value assets by stock × price</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[250px] w-full">
					<BarChart
						accessibilityLayer
						data={data}
						layout="vertical"
						margin={{
							right: 16,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="name"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? "..." : "")}
							width={100}
						/>
						<XAxis type="number" hide />
						<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
						<Bar dataKey="value" layout="vertical" fill="var(--color-value)" radius={4}>
							<LabelList
								dataKey="value"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={12}
								formatter={(value: number) => `$${value.toLocaleString()}`}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
