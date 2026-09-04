"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * App shell compound layout. Split views (main + side panel) compose with shadcn
 * `ResizablePanelGroup` / `ResizablePanel` at the route — not wrapped here.
 */
export function Shell({
  children,
  sidebar,
  defaultOpen = true,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <SidebarProvider className="h-dvh overflow-hidden" defaultOpen={defaultOpen}>
      {sidebar}
      <div
        className={cn(
          "relative flex h-dvh w-full min-w-0 flex-1 flex-col overflow-hidden",
          "md:peer-data-[variant=inset]:pt-2 md:peer-data-[variant=inset]:pr-2",
          "md:peer-data-[variant=inset]:pb-2",
          "has-[>[data-slot=shell-footer]]:md:peer-data-[variant=inset]:pb-0"
        )}
        data-slot="shell"
      >
        {children}
      </div>
    </SidebarProvider>
  );
}

/** Rounded inset main panel (sidebar peer). */
export function ShellInset({
  className,
  children,
  ...props
}: ComponentProps<typeof SidebarInset>) {
  return (
    <SidebarInset
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-background shadow",
        className
      )}
      data-slot="shell-inset"
      {...props}
    >
      {children}
    </SidebarInset>
  );
}

/** Optional chrome below the inset (e.g. chat dock). */
export function ShellFooter({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={className} data-slot="shell-footer" {...props}>
      {children}
    </div>
  );
}

export function ShellPage({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      data-slot="shell-page"
      {...props}
    >
      {children}
    </div>
  );
}

/** Sidebar expand control in page headers — mobile always; desktop when collapsed. */
export function ShellHeaderSidebarTrigger({
  className,
}: {
  className?: string;
}) {
  const { state } = useSidebar();

  return (
    <>
      <SidebarTrigger
        className={cn("shrink-0 md:hidden", className)}
        data-slot="shell-header-sidebar-trigger"
      />
      {state === "collapsed" ? (
        <SidebarTrigger
          className={cn("hidden shrink-0 md:inline-flex", className)}
          data-slot="shell-header-sidebar-trigger"
        />
      ) : null}
    </>
  );
}

export function ShellHeader({
  className,
  children,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "relative z-10 flex h-10 min-w-0 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10",
        className
      )}
      data-slot="shell-header"
      {...props}
    >
      {children}
    </header>
  );
}

export function ShellHeaderIcon({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-muted-foreground [&>svg]:size-4",
        className
      )}
      data-slot="shell-header-icon"
      {...props}
    >
      {children}
    </div>
  );
}

export function ShellHeaderTitle({
  className,
  children,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      className={cn("truncate font-medium text-foreground text-sm", className)}
      data-slot="shell-header-title"
      {...props}
    >
      {children}
    </h1>
  );
}

export function ShellHeaderActions({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      data-slot="shell-header-actions"
      {...props}
    >
      {children}
    </div>
  );
}

/** Main content slot below the header — page bodies compose here. */
export function ShellContent({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden",
        className
      )}
      data-slot="shell-content"
      {...props}
    >
      {children}
    </div>
  );
}
