import { Circle } from "lucide-react";
import { Item } from "@/components/items/item";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useItems } from "@/hooks/query/use-items";

export default function ProtectedPage() {
	const { data: items, isLoading, error } = useItems();

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">My Items</h1>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Need for skeleton loading
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-4 w-3/4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-2/3" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Error loading items</h1>
					<p className="text-gray-600">Please try again later.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">My Items</h1>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{items?.map((item) => (
					<Item key={item.id} item={item} />
				))}
			</div>

			{items?.length === 0 && (
				<div className="text-center py-12">
					<Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-600 mb-2">No items yet</h2>
					<p className="text-gray-500">Items will appear here when available.</p>
				</div>
			)}
		</div>
	);
}
