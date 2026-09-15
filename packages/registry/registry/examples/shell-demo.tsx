"use client";

import {
  Shell,
  ShellContent,
  ShellHeader,
  ShellHeaderSidebarTrigger,
  ShellHeaderTitle,
  ShellInset,
  ShellPage,
} from "@/components/ui/shell";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function ShellPreview() {
  return (
    <div className="h-[480px] w-full overflow-hidden rounded-xl border">
      <Shell
        sidebar={
          <Sidebar collapsible="icon" variant="inset">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>Home</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        }
      >
        <ShellInset>
          <ShellPage>
            <ShellHeader>
              <ShellHeaderSidebarTrigger className="-ml-1" />
              <ShellHeaderTitle>Home</ShellHeaderTitle>
            </ShellHeader>
            <ShellContent>
              <div className="p-4 text-muted-foreground text-sm">
                Main content
              </div>
            </ShellContent>
          </ShellPage>
        </ShellInset>
      </Shell>
    </div>
  );
}
