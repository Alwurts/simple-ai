import { BlockDisplay } from "@/ui-registry/components/block-display";
import { DesignSystemLayoutContent, DesignSystemLayoutPage } from "../design-system-layout";

export function AppLayoutExamples() {
	return (
		<DesignSystemLayoutPage>
			<DesignSystemLayoutContent>
				<div className="container mx-auto p-6 space-y-12">
					<div className="space-y-4">
						<h1 className="text-3xl font-bold">App Layout Component</h1>
						<p className="text-muted-foreground text-lg">
							A comprehensive layout system for the application with sidebar, header, and content
							areas. Explore different composition patterns below.
						</p>
					</div>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Basic Layout</h2>
							<p className="text-muted-foreground">
								Simple layout with header and content using AppSidebar
							</p>
						</div>
						<BlockDisplay name="app-layout-basic" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Layout Without Header</h2>
							<p className="text-muted-foreground">
								Minimal layout without header for cleaner interfaces
							</p>
						</div>
						<BlockDisplay name="app-layout-no-header" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Layout with Header Actions</h2>
							<p className="text-muted-foreground">
								Layout using AppLayoutHeaderActions for buttons and controls
							</p>
						</div>
						<BlockDisplay name="app-layout-with-actions" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Custom Sidebar</h2>
							<p className="text-muted-foreground">
								Layout with a custom sidebar instead of the default AppSidebar
							</p>
						</div>
						<BlockDisplay name="app-layout-custom-sidebar" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Resizable Panels</h2>
							<p className="text-muted-foreground">
								Layout with resizable primary and secondary panels
							</p>
						</div>
						<BlockDisplay name="app-layout-resizable" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Collapsed Sidebar</h2>
							<p className="text-muted-foreground">
								Layout that starts with sidebar collapsed by default
							</p>
						</div>
						<BlockDisplay name="app-layout-collapsed" />
					</section>
				</div>
			</DesignSystemLayoutContent>
		</DesignSystemLayoutPage>
	);
}
