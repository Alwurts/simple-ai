"use client";

import { BookOpen, Box, ChevronRight, Grid3X3, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";

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
	const pathname = usePathname();

	const isActive = (url: string) => {
		return pathname === url || pathname.startsWith(`${url}/`);
	};

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
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<SidebarMenuItem>
						<SidebarTrigger className="h-8 w-8" />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/design-system" className="font-medium">
									<BookOpen />
									<span>Introduction</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						{components.length > 0 && (
							<Collapsible asChild defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip="Components">
											<Box />
											<span>Components</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{components.map((component) => (
												<SidebarMenuSubItem key={component.name}>
													<SidebarMenuSubButton
														asChild
														isActive={isActive(`/design-system/components/${component.name}`)}
													>
														<Link href={`/design-system/components/${component.name}`}>
															{component.title || component.name}
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						)}
						{blocks.length > 0 && (
							<Collapsible asChild defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip="Blocks">
											<Grid3X3 />
											<span>Blocks</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{blocks.map((block) => (
												<SidebarMenuSubItem key={block.name}>
													<SidebarMenuSubButton
														asChild
														isActive={isActive(`/design-system/blocks/${block.name}`)}
													>
														<Link href={`/design-system/blocks/${block.name}`}>
															{block.title || block.name}
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
