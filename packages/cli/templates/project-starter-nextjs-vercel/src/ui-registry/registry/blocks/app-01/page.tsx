import { AppSidebar } from "@/ui-registry/registry/blocks/app-01/components/app-sidebar";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";
import { AppBreadcrumbs } from "../../ui/app-breadcrumbs";

export default function Page() {
	return (
		<AppLayout sidebar={<AppSidebar />}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppBreadcrumbs />
				</AppLayoutHeader>
				<AppLayoutContent>
					<div>Hey</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
