"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DesignSystemSidebar } from "./design-system-sidebar";

type RegistryItemSummary = {
	name: string;
	title?: string;
	description?: string;
};

type DesignSystemLayoutClientProps = {
	children: React.ReactNode;
	defaultOpen?: boolean;
	components: RegistryItemSummary[];
	blocks: RegistryItemSummary[];
};

export function DesignSystemLayoutClient({
	children,
	defaultOpen = true,
	components,
	blocks,
}: DesignSystemLayoutClientProps) {
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<DesignSystemSidebar components={components} blocks={blocks} />
			<div className="h-svh relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:p-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:pl-0 md:peer-data-[variant=inset]:pl-0">
				<SidebarInset className="overflow-hidden rounded-xl shadow bg-background">
					{children}
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
