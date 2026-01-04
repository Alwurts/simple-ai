"use client";

import { format, parseISO, subDays } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
	in: {
		label: "Stock In",
		color: "var(--chart-2)",
	},
	out: {
		label: "Stock Out",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

export function StockTrendsChart() {
	const { data: metrics, isLoading } = useInventoryMetrics();

	// Generate last 30 days data map
	const last30Days = Array.from({ length: 30 }, (_, i) => {
		const d = subDays(new Date(), 29 - i);
		return format(d, "yyyy-MM-dd");
	});

	const dataMap = last30Days.reduce(
		(acc, date) => {
			acc[date] = { date, in: 0, out: 0 };
			return acc;
		},
		{} as Record<string, { date: string; in: number; out: number }>,
	);

	// Fill with actual data
	const movements = metrics?.recentMovements || [];
	movements.forEach((m) => {
		// Ensure date string matches key format
		const dateKey = m.date;
		if (dataMap[dateKey]) {
			if (m.type === "IN") {
				dataMap[dateKey].in += m.quantity;
			}
			if (m.type === "OUT") {
				dataMap[dateKey].out += m.quantity;
			}
		}
	});

	const chartData = Object.values(dataMap);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Stock Movement Trends</CardTitle>
					<CardDescription>Incoming vs Outgoing stock over the last 30 days</CardDescription>
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
				<CardTitle>Stock Movement Trends</CardTitle>
				<CardDescription>Incoming vs Outgoing stock over the last 30 days</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[250px] w-full">
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => format(parseISO(value), "MMM d")}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<defs>
							<linearGradient id="fillIn" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--color-in)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--color-in)" stopOpacity={0.1} />
							</linearGradient>
							<linearGradient id="fillOut" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--color-out)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--color-out)" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<Area
							dataKey="out"
							type="natural"
							fill="url(#fillOut)"
							fillOpacity={0.4}
							stroke="var(--color-out)"
							stackId="a"
						/>
						<Area
							dataKey="in"
							type="natural"
							fill="url(#fillIn)"
							fillOpacity={0.4}
							stroke="var(--color-in)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
