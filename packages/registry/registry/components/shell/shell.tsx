"use client";

import {
  type ComponentProps,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function useMobileVisualViewportFrame(ref: { current: HTMLElement | null }) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const vv = window.visualViewport;
    const mq = window.matchMedia("(max-width: 767px)");
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    const clearFrame = () => {
      node.style.position = "";
      node.style.left = "";
      node.style.right = "";
      node.style.width = "";
      node.style.top = "";
      node.style.height = "";
      node.style.maxHeight = "";
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
    };

    const apply = () => {
      if (!mq.matches) {
        clearFrame();
        return;
      }
      const height = Math.round(vv?.height ?? window.innerHeight);
      const top = Math.round(vv?.offsetTop ?? 0);
      node.style.position = "fixed";
      node.style.left = "0px";
      node.style.right = "0px";
      node.style.width = "100%";
      node.style.top = `${top}px`;
      node.style.height = `${height}px`;
      node.style.maxHeight = `${height}px`;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      body.style.overscrollBehavior = "none";
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    apply();
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", apply);
    mq.addEventListener("change", apply);
    window.addEventListener("scroll", apply, { passive: true });
    return () => {
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", apply);
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", apply);
      clearFrame();
    };
  }, [ref]);
}

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
  const frameRef = useRef<HTMLDivElement>(null);
  useMobileVisualViewportFrame(frameRef);

  return (
    <SidebarProvider
      className="h-dvh max-h-dvh min-h-0 overflow-hidden"
      defaultOpen={defaultOpen}
    >
      {sidebar}
      <div
        className={cn(
          "relative flex h-dvh max-h-dvh w-full min-w-0 flex-1 flex-col overflow-hidden overscroll-none",
          "md:peer-data-[variant=inset]:pt-2 md:peer-data-[variant=inset]:pr-2",
          "md:peer-data-[variant=inset]:pb-2",
          "has-[>[data-slot=shell-footer]]:md:peer-data-[variant=inset]:pb-0"
        )}
        data-slot="shell"
        ref={frameRef}
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
