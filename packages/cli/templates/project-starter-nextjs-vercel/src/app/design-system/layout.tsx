import { notFound } from "next/navigation";
import {
	DesignSystemLayout,
	DesignSystemLayoutContent,
	DesignSystemLayoutHeader,
	DesignSystemLayoutHeaderTitle,
	DesignSystemLayoutPage,
} from "@/design-system/components/design-system-layout";
import { env } from "@/env";

interface DesignSystemLayoutProps {
	children: React.ReactNode;
}

export default async function DesignSystemLayoutWrapper({ children }: DesignSystemLayoutProps) {
	// Check if design system is enabled
	if (env.NEXT_PUBLIC_DESIGN_SYSTEM_ENABLED !== "true") {
		notFound();
	}

	return (
		<DesignSystemLayout>
			<DesignSystemLayoutPage>
				<DesignSystemLayoutHeader>
					<DesignSystemLayoutHeaderTitle>Design System</DesignSystemLayoutHeaderTitle>
				</DesignSystemLayoutHeader>
				<DesignSystemLayoutContent>
					<div className="container max-w-4xl p-6 md:p-10 min-h-full">{children}</div>
				</DesignSystemLayoutContent>
			</DesignSystemLayoutPage>
		</DesignSystemLayout>
	);
}
