"use client";

import { useRouterState } from "@tanstack/react-router";
import { cn } from "@workspace/ui/lib/utils";
import type { DocsNavGroup, DocsNavPage } from "@/lib/docs-nav";

function SidebarLink({ page, active }: { page: DocsNavPage; active: boolean }) {
  return (
    <a
      className={cn(
        "relative flex h-8 items-center rounded-md px-2 text-sm transition-colors",
        active
          ? "bg-brand/5 font-medium text-brand hover:bg-brand/10 hover:text-brand"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
      href={page.url}
    >
      {active ? (
        <span className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
      ) : null}
      <span className={cn("truncate", active && "pl-2")}>{page.title}</span>
    </a>
  );
}

export function DocsSidebar({ groups }: { groups: DocsNavGroup[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="sticky top-[calc(var(--header-total-height)+2.5rem)] z-30 hidden h-[calc(100svh-(var(--header-total-height)+3.5rem))] overflow-y-auto bg-transparent pb-12 lg:flex">
      <nav className="flex w-full flex-col px-4">
        {groups.map((group) => (
          <div className="py-2" key={group.title}>
            <p className="mb-2 px-2 font-bold text-foreground/70 text-xs uppercase tracking-wider">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.pages.map((page) => (
                <SidebarLink
                  active={pathname === page.url}
                  key={page.url}
                  page={page}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
