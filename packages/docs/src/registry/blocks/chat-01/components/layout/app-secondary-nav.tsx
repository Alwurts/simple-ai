import { Settings, Sun } from "lucide-react";
import type { ComponentProps } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSecondaryNav({
	currentPath,
	...props
}: ComponentProps<typeof SidebarGroup> & {
	currentPath: string;
}) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="sm" tooltip="Settings">
							<Settings />
							<span>Settings</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton size="sm" tooltip="Theme">
							<Sun />
							<span>Theme</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
