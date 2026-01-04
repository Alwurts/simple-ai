import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { designSystemConfig } from "@/design-system/config/design-system";

export default function DesignSystemIndex() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Design System</h1>
				<p className="text-lg text-muted-foreground">
					A collection of reusable components built using Radix UI and Tailwind CSS, following the
					components.build specification for composition and accessibility.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{designSystemConfig.map((component) => (
					<Link key={component.slug} href={`/design-system/components/${component.slug}`}>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									{component.title}
									<ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
								</CardTitle>
								<CardDescription>{component.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
