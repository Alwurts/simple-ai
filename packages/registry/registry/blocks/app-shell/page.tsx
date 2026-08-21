"use client";

import { LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Shell,
  ShellContent,
  ShellHeader,
  ShellHeaderActions,
  ShellHeaderSidebarTrigger,
  ShellHeaderTitle,
  ShellInset,
  ShellPage,
} from "@/components/ui/shell";
import { AppSidebar } from "./components/app-sidebar";

/** UI for the app shell. Wire a Next or Start route to this file after install. */
export default function AppShellPage() {
  return (
    <Shell sidebar={<AppSidebar activeId="home" />}>
      <ShellInset>
        <ShellPage>
          <ShellHeader>
            <ShellHeaderSidebarTrigger className="-ml-1" />
            <ShellHeaderTitle>Home</ShellHeaderTitle>
            <ShellHeaderActions>
              <Button size="sm" type="button">
                New
              </Button>
            </ShellHeaderActions>
          </ShellHeader>
          <ShellContent>
            <Empty className="h-full border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LayoutDashboardIcon />
                </EmptyMedia>
                <EmptyTitle>Page content</EmptyTitle>
                <EmptyDescription>
                  Tables, forms, and chat compose inside ShellContent.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </ShellContent>
        </ShellPage>
      </ShellInset>
    </Shell>
  );
}
