"use client";

import { Activity, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatus } from "@/hooks/query/use-status";

export function StatusWidget() {
	const { data: status, isLoading, error } = useStatus();

	if (isLoading) {
		return (
			<Card className="w-full max-w-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2">
						<Activity className="w-4 h-4" />
						System Status
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-24" />
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="w-full max-w-sm border-red-200">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2 text-red-600">
						<Activity className="w-4 h-4" />
						System Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-red-600">Unable to load status</p>
				</CardContent>
			</Card>
		);
	}

	const formatUptime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm flex items-center gap-2">
					<CheckCircle className="w-4 h-4 text-green-500" />
					System Status
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Status:</span>
					<Badge variant="outline" className="text-green-600 border-green-200">
						{status?.status || "Unknown"}
					</Badge>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600">Version:</span>
					<span className="text-sm font-mono">{status?.version || "N/A"}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm text-gray-600 flex items-center gap-1">
						<Clock className="w-3 h-3" />
						Uptime:
					</span>
					<span className="text-sm font-mono">
						{status?.uptime ? formatUptime(status.uptime) : "N/A"}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
