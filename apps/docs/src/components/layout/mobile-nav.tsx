"use client";

import { useRouterState } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/shadcn/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { LogoIcon } from "@/components/icons/logo-icon";
import { siteConfig } from "@/lib/config";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full hover:bg-transparent",
              className
            )}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <div className="relative flex h-3.5 w-4 flex-col justify-between">
          <span
            className={cn(
              "block h-0.5 w-full rounded-full bg-foreground transition-all duration-200",
              open ? "translate-y-[6px] rotate-45" : "translate-y-0"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-full rounded-full bg-foreground transition-all duration-200",
              open ? "opacity-0" : "opacity-100"
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-full rounded-full bg-foreground transition-all duration-200",
              open ? "-translate-y-[6px] -rotate-45" : "translate-y-0"
            )}
          />
        </div>
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent className="w-72" side="left">
        <SheetHeader>
          <SheetTitle>
            <a
              className="flex items-center gap-2"
              href="/"
              onClick={() => setOpen(false)}
            >
              <LogoIcon className="size-6" />
              <span className="font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </a>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1">
            {siteConfig.navItems.map((item) => {
              const active =
                item.href === "/docs"
                  ? pathname === "/docs" || pathname === "/docs/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <a
                  className={cn(
                    "rounded-md px-2 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand/5 font-medium text-brand"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="flex flex-col gap-1">
            <p className="px-2 font-bold text-foreground/70 text-xs uppercase tracking-wider">
              Docs
            </p>
            {[
              { href: "/docs", label: "Introduction" },
              { href: "/docs/installation", label: "Installation" },
              { href: "/docs/components/composer", label: "Composer" },
              { href: "/docs/components/reasoning", label: "Reasoning" },
              { href: "/docs/components/shell", label: "Shell" },
              { href: "/docs/components/tool", label: "Tool" },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <a
                  className={cn(
                    "rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-brand/5 font-medium text-brand"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
