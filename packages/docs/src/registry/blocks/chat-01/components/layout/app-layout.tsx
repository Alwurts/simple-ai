import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/registry/blocks/chat-01/components/layout/app-sidebar";

export function AppLayout({
	children,
	sidebarChildren,
}: {
	children: React.ReactNode;
	sidebarChildren: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar>{sidebarChildren}</AppSidebar>
			<div className="h-svh relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:p-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:pl-2 md:peer-data-[variant=inset]:pl-0">
				<SidebarInset className="overflow-y-auto rounded-xl shadow">
					{children}
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
