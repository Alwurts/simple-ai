import { notFound } from "next/navigation";
import { env } from "@/env";
import { DesignSystemLayout } from "@/ui-registry/components/design-system-layout";
import { DesignSystemSidebar } from "@/ui-registry/components/design-system-sidebar";
import { getAllRegistryItems } from "@/ui-registry/lib/registry";

interface DesignSystemLayoutProps {
	children: React.ReactNode;
}

export default async function DesignSystemLayoutWrapper({ children }: DesignSystemLayoutProps) {
	// Check if design system is enabled
	if (env.NEXT_PUBLIC_DESIGN_SYSTEM_ENABLED !== "true") {
		notFound();
	}

	const [components, blocks] = await Promise.all([
		getAllRegistryItems(["registry:ui"]),
		getAllRegistryItems(["registry:block"]),
	]);

	console.log("components", components);
	console.log("blocks", blocks);

	return (
		<DesignSystemLayout
			sidebar={<DesignSystemSidebar components={components} blocks={blocks} />}
			defaultOpen={true}
		>
			{children}
		</DesignSystemLayout>
	);
}
