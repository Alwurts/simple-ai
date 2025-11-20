import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { source } from "@/lib/source";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container-wrapper flex flex-1 flex-col px-4 md:px-8">
			<SidebarProvider className="flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				<DocsSidebar tree={source.pageTree} />
				<div className="relative w-full min-w-0">{children}</div>
			</SidebarProvider>
		</div>
	);
}
