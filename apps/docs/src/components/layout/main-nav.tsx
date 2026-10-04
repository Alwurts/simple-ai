"use client";

import { useRouterState } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { isSiteNavActive, siteConfig } from "@/lib/config";

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {siteConfig.navItems.map((item) => {
        const active = isSiteNavActive(pathname, item.href);

        return (
          <Button
            key={item.href}
            render={<a href={item.href} />}
            size="sm"
            variant="ghost"
          >
            <span className={cn(active && "text-primary")}>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
