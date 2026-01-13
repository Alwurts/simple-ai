import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRegistryItems } from "@/ui-registry/lib/registry";

export default async function ComponentsPage() {
	const components = await getAllRegistryItems(["registry:ui"]);

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Components</h1>
				<p className="text-lg text-muted-foreground">
					Browse UI components from the registry. Each component includes examples and code.
				</p>
			</div>

			{components.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No components found in the registry.</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{components.map((component) => (
						<Link key={component.name} href={`/design-system/components/${component.name}`}>
							<Card className="h-full transition-colors hover:bg-muted/50 group">
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										{component.title || component.name}
										<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
									</CardTitle>
									<CardDescription>
										{component.description || "No description available."}
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
