import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ComponentPreview } from "@/design-system/components/component-preview";
import { designSystemConfig } from "@/design-system/config/design-system";

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateStaticParams() {
	return designSystemConfig.map((component) => ({
		slug: component.slug,
	}));
}

export default async function ComponentPage({ params }: PageProps) {
	const { slug } = await params;
	const component = designSystemConfig.find((c) => c.slug === slug);

	if (!component) {
		notFound();
	}

	return (
		<div className="space-y-10 pb-10">
			<div className="space-y-4">
				<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{component.title}</h1>
				<p className="text-lg text-muted-foreground">{component.description}</p>
				<div className="flex items-center gap-2">
					<Badge variant="outline">Server Component</Badge>
					<Badge variant="outline">Accessible</Badge>
				</div>
			</div>

			<div className="space-y-12">
				{component.examples.map((example, index) => (
					<ComponentPreview
						key={`${component.slug}-example-${index}`}
						name={example.name}
						description={example.description}
						code={example.code}
					>
						{example.render}
					</ComponentPreview>
				))}
			</div>
		</div>
	);
}
