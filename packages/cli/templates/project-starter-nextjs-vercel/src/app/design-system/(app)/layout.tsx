import { notFound } from "next/navigation";
import { env } from "@/env";
import { DesignSystemLayoutPage } from "@/ui-registry/components/pages/design-system-layout";
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

	return (
		<DesignSystemLayoutPage components={components} blocks={blocks}>
			{children}
		</DesignSystemLayoutPage>
	);
}
