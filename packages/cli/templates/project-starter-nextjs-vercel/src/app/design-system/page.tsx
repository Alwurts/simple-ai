import { ArrowRight, Component, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRegistryItems } from "@/ui-registry/lib/registry";

export default async function DesignSystemIndex() {
	const [components, blocks] = await Promise.all([
		getAllRegistryItems(["registry:ui"]),
		getAllRegistryItems(["registry:block"]),
	]);

	const allItems = [
		...components.map((item) => ({ ...item, type: "component" as const })),
		...blocks.map((item) => ({ ...item, type: "block" as const })),
	];

	return (
		<div className="space-y-8 p-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Design System</h1>
				<p className="text-lg text-muted-foreground">
					A collection of reusable components and blocks built using Radix UI and Tailwind CSS.
				</p>
			</div>

			{allItems.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No items found in the registry.</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{allItems.map((item) => (
						<Link key={item.name} href={`/design-system/${item.type}s/${item.name}`}>
							<Card className="h-full transition-colors hover:bg-muted/50 group">
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle className="flex items-center gap-2">
											{item.type === "component" ? (
												<Component className="h-4 w-4 text-muted-foreground" />
											) : (
												<Layers className="h-4 w-4 text-muted-foreground" />
											)}
											{item.title || item.name}
										</CardTitle>
										<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
									</div>
									<CardDescription className="mb-3">
										{item.description || "No description available."}
									</CardDescription>
									<Badge variant="secondary" className="w-fit">
										{item.type}
									</Badge>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
