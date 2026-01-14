import { BlockDisplay } from "@/ui-registry/components/block-display";
import { DesignSystemLayoutContent, DesignSystemLayoutPage } from "../design-system-layout";

export function AppBreadcrumbsExamples() {
	return (
		<DesignSystemLayoutPage>
			<DesignSystemLayoutContent>
				<div className="container mx-auto p-6 space-y-12">
					<div className="space-y-4">
						<h1 className="text-3xl font-bold">App Breadcrumbs Component</h1>
						<p className="text-muted-foreground text-lg">
							A standard breadcrumb navigation component for the application. Explore different
							usage patterns below.
						</p>
					</div>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">With Home Link</h2>
							<p className="text-muted-foreground">
								Basic breadcrumbs showing Home link (default behavior)
							</p>
						</div>
						<BlockDisplay name="app-breadcrumbs-home" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Without Home Link</h2>
							<p className="text-muted-foreground">
								Breadcrumbs without the default Home link using showHome=false
							</p>
						</div>
						<BlockDisplay name="app-breadcrumbs-no-home" />
					</section>

					<section className="space-y-6">
						<div className="space-y-2">
							<h2 className="text-2xl font-semibold">Nested Navigation</h2>
							<p className="text-muted-foreground">
								Multi-level breadcrumbs for deep navigation structures
							</p>
						</div>
						<BlockDisplay name="app-breadcrumbs-nested" />
					</section>
				</div>
			</DesignSystemLayoutContent>
		</DesignSystemLayoutPage>
	);
}
