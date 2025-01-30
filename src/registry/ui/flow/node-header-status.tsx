import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export const NodeHeaderStatus = ({
	status,
}: {
	status?: "idle" | "processing" | "success" | "error";
}) => {
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
};

NodeHeaderStatus.displayName = "NodeHeaderStatus";
