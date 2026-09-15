import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="group/body relative z-10 flex min-h-svh flex-col bg-background pt-(--header-offset)"
      data-slot="site-shell"
    >
      <div data-slot="site-chrome">
        <SiteHeader />
      </div>
      <main className="flex flex-1 flex-col">{children}</main>
      <div data-slot="site-chrome">
        <SiteFooter />
      </div>
    </div>
  );
}
