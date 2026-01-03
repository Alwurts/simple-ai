import { Plus } from "lucide-react";
import Link from "next/link";
import { SidePanelChat } from "@/components/chat/side-panel-chat";
import {
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProtectedPage() {
	return (
		<AppLayoutPage>
			<PageHeader />
			<AppLayoutContent variant="fixed">
				<div className="space-y-6">
					<h1 className="text-2xl font-bold">Dashboard</h1>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="p-6 bg-card rounded-lg border">
							<h3 className="font-semibold mb-2">Welcome</h3>
							<p className="text-sm text-muted-foreground">
								This is your main dashboard. You can add components and content here.
							</p>
						</div>

						<div className="p-6 bg-card rounded-lg border">
							<h3 className="font-semibold mb-2">Chat Panel Demo</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Click the button below to open a resizable chat panel on the right.
							</p>
							<SidePanelChat />
						</div>

						<div className="p-6 bg-card rounded-lg border">
							<h3 className="font-semibold mb-2">Getting Started</h3>
							<p className="text-sm text-muted-foreground">
								Explore the components and features available in this starter template.
							</p>
						</div>
					</div>
				</div>
			</AppLayoutContent>
		</AppLayoutPage>
	);
}

function PageHeader() {
	return (
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
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1">
								<BreadcrumbEllipsis className="size-4" />
								<span className="sr-only">Toggle menu</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem>Documentation</DropdownMenuItem>
								<DropdownMenuItem>Themes</DropdownMenuItem>
								<DropdownMenuItem>GitHub</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/docs/components">Components</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<AppLayoutHeaderActions>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					New Item
				</Button>
			</AppLayoutHeaderActions>
		</AppLayoutHeader>
	);
}
