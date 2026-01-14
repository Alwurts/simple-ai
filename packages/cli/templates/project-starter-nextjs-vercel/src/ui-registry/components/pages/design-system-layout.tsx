import { DesignSystemLayout } from "@/ui-registry/components/design-system-layout";
import { DesignSystemSidebar } from "@/ui-registry/components/design-system-sidebar";

export function DesignSystemLayoutPage({
	components,
	blocks,
	children,
}: {
	components: Parameters<typeof DesignSystemSidebar>[0]["components"];
	blocks: Parameters<typeof DesignSystemSidebar>[0]["blocks"];
	children: React.ReactNode;
}) {
	return (
		<DesignSystemLayout
			sidebar={<DesignSystemSidebar components={components} blocks={blocks} />}
			defaultOpen={true}
		>
			{children}
		</DesignSystemLayout>
	);
}
