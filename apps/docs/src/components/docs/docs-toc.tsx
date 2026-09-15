"use client";

import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

export interface DocsTocItem {
  title?: ReactNode;
  url: string;
  depth: number;
}

export function DocsTableOfContents({
  toc,
  className,
}: {
  toc: DocsTocItem[];
  className?: string;
}) {
  if (toc.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-3 pb-8", className)}>
      <h4 className="px-1 font-bold text-foreground/70 text-xs uppercase tracking-wider">
        On This Page
      </h4>
      <div className="flex flex-col gap-0.5">
        {toc.map((item) => (
          <a
            className={cn(
              "relative block py-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground",
              item.depth === 3 && "pl-6",
              item.depth >= 4 && "pl-9",
              item.depth < 3 && "pl-3"
            )}
            href={item.url}
            key={item.url}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}
