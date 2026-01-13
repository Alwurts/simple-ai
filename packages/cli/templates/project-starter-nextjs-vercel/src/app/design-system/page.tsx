import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DesignSystemIndex() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Design System</h1>
				<p className="text-lg text-muted-foreground">
					A collection of reusable components and blocks built using Radix UI and Tailwind CSS.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Link href="/design-system/components">
					<Card className="h-full transition-colors hover:bg-muted/50 group">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								Components
								<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
							</CardTitle>
							<CardDescription>
								Browse UI components from the registry. Each component includes examples and code.
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>

				<Link href="/design-system/blocks">
					<Card className="h-full transition-colors hover:bg-muted/50 group">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								Blocks
								<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
							</CardTitle>
							<CardDescription>
								Explore pre-built blocks and complex component compositions ready to use.
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			</div>
		</div>
	);
}
