import Link from "next/link";
import { ChatSidePanel } from "@/components/chat/chat-side-panel";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
	AppLayoutResizable,
	AppLayoutResizablePanelPrimary,
	AppLayoutResizablePanelSecondary,
	AppLayoutResizablePanelTrigger,
} from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardPage() {
	return (
		<AppLayoutPage>
			<AppLayoutResizable>
				<AppLayoutResizablePanelPrimary id="content-panel" order={1} defaultSize={70} minSize={30}>
					<AppLayoutHeader>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link href="/">Home</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Dashboard</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<AppLayoutHeaderActions>
							<AppLayoutResizablePanelTrigger panelId="chat-panel" />
						</AppLayoutHeaderActions>
					</AppLayoutHeader>

					<div className="space-y-6 p-6">
						<DashboardStats />
						<LowStockAlerts />
					</div>
				</AppLayoutResizablePanelPrimary>

				<AppLayoutResizablePanelSecondary
					id="chat-panel"
					order={2}
					defaultSize={30}
					minSize={25}
					defaultOpen={true}
				>
					<ChatSidePanel />
				</AppLayoutResizablePanelSecondary>
			</AppLayoutResizable>
		</AppLayoutPage>
	);
}
