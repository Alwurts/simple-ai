import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DBItem } from "@/types/items";

interface ItemProps {
	item: DBItem;
}

export function Item({ item }: ItemProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "default";
			case "inactive":
				return "secondary";
			case "archived":
				return "outline";
			default:
				return "secondary";
		}
	};

	return (
		<Card className="relative">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{item.name}</CardTitle>
					<Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-gray-600">{item.description}</p>
			</CardContent>
		</Card>
	);
}
