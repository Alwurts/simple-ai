import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRegistryItems } from "@/ui-registry/lib/registry";

export default async function BlocksPage() {
	const blocks = await getAllRegistryItems(["registry:block"]);

	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Blocks</h1>
				<p className="text-lg text-muted-foreground">
					Explore pre-built blocks and complex component compositions ready to use.
				</p>
			</div>

			{blocks.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">No blocks found in the registry.</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{blocks.map((block) => (
						<Link key={block.name} href={`/design-system/blocks/${block.name}`}>
							<Card className="h-full transition-colors hover:bg-muted/50 group">
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										{block.title || block.name}
										<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
									</CardTitle>
									<CardDescription>
										{block.description || "No description available."}
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
