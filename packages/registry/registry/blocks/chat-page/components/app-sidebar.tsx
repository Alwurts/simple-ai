"use client";

import { BotIcon, HomeIcon, SettingsIcon, SparklesIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const ITEMS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "chat", label: "Chat", icon: BotIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppSidebar({
  activeId = "chat",
}: {
  activeId?: (typeof ITEMS)[number]["id"];
}) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SparklesIcon />
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate font-semibold">Acme</span>
              <span className="block truncate text-muted-foreground text-xs">
                Workspace
              </span>
            </div>
            <SidebarTrigger className="hidden size-8 group-data-[collapsible=icon]:hidden md:flex" />
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarTrigger className="size-8" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {ITEMS.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={item.id === activeId}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
