import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NodeExecutionStatus } from "@/registry/blocks/flow-01/types/execution";

export function StatusBadge({ status }: { status?: NodeExecutionStatus }) {
	const statusColors = {
		idle: "bg-muted text-muted-foreground",
		processing: "bg-orange-500 text-white",
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
	};
	return (
		<Badge
			variant="secondary"
			className={cn("mr-2 font-normal", status && statusColors[status])}
		>
			{status ? status : "idle"}
		</Badge>
	);
}
