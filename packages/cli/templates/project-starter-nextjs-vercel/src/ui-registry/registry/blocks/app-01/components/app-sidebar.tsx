import { LayoutDashboard, Link, type LucideIcon, Search } from "lucide-react";
import { LogoAlwurtsMonochrome } from "@/components/icons/logo-monochrome";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";

type NavigationItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	activeMatcher: RegExp;
};

const mainNavigationItems: NavigationItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: LayoutDashboard,
		activeMatcher: /\//,
	},
];

export function AppSidebar() {
	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						{/* Logo Area */}
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<LogoAlwurtsMonochrome className="h-5 w-5" />
						</div>

						{/* App Title (Visible when expanded) */}
						<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
							<span className="font-semibold truncate block">simple-ai</span>
							<span className="text-xs text-muted-foreground truncate block">App Template</span>
						</div>

						{/* Top Actions (Search + Toggle) */}
						<div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
							<SidebarMenuButton tooltip="Search" variant="default" size="sm" className="h-8 w-8">
								<Search className="size-4" />
								<span className="sr-only">Search</span>
							</SidebarMenuButton>

							<SidebarTrigger className="h-8 w-8 md:flex hidden" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Collapsed Mode: Search + Toggle Buttons */}
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<SidebarMenuItem>
						<SidebarTrigger className="h-8 w-8" />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Search">
							<Search />
							<span>Search</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						{mainNavigationItems.map((item) => (
							<SidebarMenuItem key={`${item.title}-${item.url}`}>
								<SidebarMenuButton tooltip={item.title} asChild>
									<Link href={item.url}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div>User</div>
			</SidebarFooter>
		</Sidebar>
	);
}
