import Link from "next/link";
import type { ComponentProps } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { config } from "@/registry/blocks/chat-01/lib/config";

export function AppMainNav({
	currentPath,
	...props
}: ComponentProps<typeof SidebarGroup> & { currentPath: string }) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{config.mainRoutes.map((item, index) => (
						<SidebarMenuItem key={`${item.path}-${index}`}>
							<SidebarMenuButton
								tooltip={item.label}
								isActive={item.matchExpression.test(
									currentPath,
								)}
								asChild
							>
								<Link href={item.path}>
									{item.icon && <item.icon />}
									<span>{item.label}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
