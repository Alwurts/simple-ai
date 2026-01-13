"use client";

import { Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

type RegistryItemSummary = {
	name: string;
	title?: string;
	description?: string;
};

type DesignSystemSidebarProps = {
	components: RegistryItemSummary[];
	blocks: RegistryItemSummary[];
};

export function DesignSystemSidebar({ components, blocks }: DesignSystemSidebarProps) {
	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						{/* Logo Area */}
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Palette className="h-5 w-5" />
						</div>

						{/* App Title (Visible when expanded) */}
						<div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
							<span className="font-semibold truncate block">Design System</span>
							<span className="text-xs text-muted-foreground truncate block">
								Component Library
							</span>
						</div>

						{/* Toggle Button */}
						<div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
							<SidebarTrigger className="h-8 w-8" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Collapsed Mode: Toggle Button */}
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<SidebarMenuItem>
						<SidebarTrigger className="h-8 w-8" />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<DesignSystemSidebarNavigation components={components} blocks={blocks} />
			</SidebarContent>
			<SidebarFooter>
				{/* Could add user nav or other footer content here if needed */}
			</SidebarFooter>
		</Sidebar>
	);
}

type DesignSystemSidebarNavigationProps = {
	components: RegistryItemSummary[];
	blocks: RegistryItemSummary[];
};

export function DesignSystemSidebarNavigation({
	components,
	blocks,
}: DesignSystemSidebarNavigationProps) {
	const pathname = usePathname();

	const isActive = (url: string) => {
		return pathname === url || pathname.startsWith(`${url}/`);
	};

	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>
					<Link
						href="/design-system"
						className={cn(
							"hover:underline",
							pathname === "/design-system" && "font-semibold",
						)}
					>
						Introduction
					</Link>
				</SidebarGroupLabel>
			</SidebarGroup>

			<SidebarGroup>
				<SidebarGroupLabel>
					<Link
						href="/design-system/components"
						className={cn(
							"hover:underline",
							pathname.startsWith("/design-system/components") && "font-semibold",
						)}
					>
						Components
					</Link>
				</SidebarGroupLabel>
				<SidebarMenu>
					{components.length === 0 ? (
						<SidebarMenuItem>
							<SidebarMenuButton disabled>No components</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						components.map((component) => {
							const url = `/design-system/components/${component.name}`;
							return (
								<SidebarMenuItem key={component.name}>
									<SidebarMenuButton
										tooltip={component.title || component.name}
										asChild
										isActive={isActive(url)}
									>
										<Link href={url}>
											<span>{component.title || component.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})
					)}
				</SidebarMenu>
			</SidebarGroup>

			<SidebarGroup>
				<SidebarGroupLabel>
					<Link
						href="/design-system/blocks"
						className={cn(
							"hover:underline",
							pathname.startsWith("/design-system/blocks") && "font-semibold",
						)}
					>
						Blocks
					</Link>
				</SidebarGroupLabel>
				<SidebarMenu>
					{blocks.length === 0 ? (
						<SidebarMenuItem>
							<SidebarMenuButton disabled>No blocks</SidebarMenuButton>
						</SidebarMenuItem>
					) : (
						blocks.map((block) => {
							const url = `/design-system/blocks/${block.name}`;
							return (
								<SidebarMenuItem key={block.name}>
									<SidebarMenuButton
										tooltip={block.title || block.name}
										asChild
										isActive={isActive(url)}
									>
										<Link href={url}>
											<span>{block.title || block.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})
					)}
				</SidebarMenu>
			</SidebarGroup>
		</>
	);
}
