"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { source } from "@/lib/source";
import { cn } from "@/lib/utils";

const EXCLUDED_SECTIONS: string[] = [];
const EXCLUDED_PAGES: string[] = [];

export function DocsSidebar({
	tree,
	...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
	const pathname = usePathname();

	return (
		<Sidebar
			className="sticky top-[calc(var(--header-total-height)+2.5rem)] z-30 hidden h-[calc(100svh-(var(--header-total-height)+3.5rem))] bg-transparent lg:flex"
			collapsible="none"
			{...props}
		>
			<SidebarContent className="no-scrollbar overflow-x-hidden px-4 pb-12">
				{/* Spacer for visual breathing room from header */}

				{tree.children.map((item) => {
					if (EXCLUDED_SECTIONS.includes(item.$id ?? "")) {
						return null;
					}

					return (
						<SidebarGroup key={item.$id} className="py-2">
							<SidebarGroupLabel className="text-foreground/70 px-2 text-xs font-bold uppercase tracking-wider mb-2">
								{item.name}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								{item.type === "folder" && (
									<SidebarMenu className="gap-1">
										{item.children.map((item) => {
											if (
												item.type === "page" &&
												!EXCLUDED_PAGES.includes(
													item.url,
												)
											) {
												const isActive =
													item.url === pathname;

												return (
													<SidebarMenuItem
														key={item.url}
													>
														<SidebarMenuButton
															asChild
															isActive={isActive}
															className={cn(
																"relative h-8 text-sm transition-all duration-200",
																// Default State
																"text-muted-foreground hover:text-foreground hover:bg-accent/50",
																// Active State: Brand Blue text + Left Border Marker
																isActive &&
																	"bg-brand/5 text-brand font-medium hover:bg-brand/10 hover:text-brand",
															)}
														>
															<Link
																href={item.url}
															>
																{/* Active Marker Line */}
																{isActive && (
																	<div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-brand" />
																)}
																<span
																	className={cn(
																		"truncate",
																		isActive &&
																			"pl-2",
																	)}
																>
																	{item.name}
																</span>
															</Link>
														</SidebarMenuButton>
													</SidebarMenuItem>
												);
											}
											return null;
										})}
									</SidebarMenu>
								)}
							</SidebarGroupContent>
						</SidebarGroup>
					);
				})}
			</SidebarContent>
		</Sidebar>
	);
}
