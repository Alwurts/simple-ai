import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AppLayout,
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutHeaderTitle,
	AppLayoutPage,
} from "@/ui-registry/registry/ui/app-layout";

export default function Page() {
	return (
		<AppLayout sidebar={<div>Sidebar</div>}>
			<AppLayoutPage>
				<AppLayoutHeader>
					<AppLayoutHeaderTitle>App 01</AppLayoutHeaderTitle>
					<AppLayoutHeaderActions>
						<Button variant="outline" size="icon">
							<Plus />
						</Button>
					</AppLayoutHeaderActions>
				</AppLayoutHeader>
				<AppLayoutContent>
					<div>Hey</div>
				</AppLayoutContent>
			</AppLayoutPage>
		</AppLayout>
	);
}
