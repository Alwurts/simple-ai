import { ChatSidePanel } from "@/components/chat/chat-side-panel";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { InventoryValueChart } from "@/components/dashboard/inventory-value-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { StockStatusChart } from "@/components/dashboard/stock-status-chart";
import { StockTrendsChart } from "@/components/dashboard/stock-trends-chart";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
	AppLayoutResizable,
	AppLayoutResizablePanelPrimary,
	AppLayoutResizablePanelSecondary,
	AppLayoutResizablePanelTrigger,
} from "@/components/layout/app-layout";

export default function DashboardPage() {
	return (
		<AppLayoutPage>
			<AppLayoutResizable>
				<AppLayoutResizablePanelPrimary id="content-panel" order={1} defaultSize={70} minSize={30}>
					<AppLayoutHeader>
						<AppBreadcrumbs items={[{ title: "Dashboard" }]} />
						<AppLayoutHeaderActions>
							<AppLayoutResizablePanelTrigger panelId="chat-panel" />
						</AppLayoutHeaderActions>
					</AppLayoutHeader>

					<div className="flex-1 overflow-y-auto p-6 space-y-6 @container">
						<DashboardStats />

						<div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-7">
							<div className="@lg:col-span-4">
								<StockTrendsChart />
							</div>
							<div className="@lg:col-span-3">
								<StockStatusChart />
							</div>
						</div>

						<div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-7">
							<div className="@lg:col-span-4">
								<InventoryValueChart />
							</div>
							<div className="@lg:col-span-3">
								<LowStockAlerts />
							</div>
						</div>
					</div>
				</AppLayoutResizablePanelPrimary>

				<AppLayoutResizablePanelSecondary
					id="chat-panel"
					order={2}
					defaultSize={30}
					minSize={25}
					defaultOpen={false}
				>
					<ChatSidePanel />
				</AppLayoutResizablePanelSecondary>
			</AppLayoutResizable>
		</AppLayoutPage>
	);
}
