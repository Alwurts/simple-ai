import { Button } from "@workspace/ui/components/shadcn/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DocsCopyPage } from "@/components/docs/docs-copy-page";
import {
  DocsTableOfContents,
  type DocsTocItem,
} from "@/components/docs/docs-toc";
import type { DocsNavPage } from "@/lib/docs-nav";

export function DocsPage({
  title,
  description,
  toc,
  url,
  previous,
  next,
  children,
}: {
  title: string;
  description?: string;
  toc: DocsTocItem[];
  url: string;
  previous?: DocsNavPage;
  next?: DocsNavPage;
  children: ReactNode;
}) {
  return (
    <div
      className="flex w-full items-stretch text-[1.05rem] sm:text-[15px]"
      data-slot="docs"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-8 px-4 py-6 md:px-0 lg:py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="scroll-m-20 font-semibold text-4xl tracking-tight sm:text-3xl xl:text-4xl">
                {title}
              </h1>
              <DocsCopyPage url={url} />
            </div>
            {description ? (
              <p className="text-balance text-[1.05rem] text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          <div className="w-full flex-1">{children}</div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-3xl items-center gap-2 px-4 sm:flex md:px-0">
          {previous ? (
            <Button
              className="shadow-none"
              render={<a href={previous.url} />}
              size="sm"
              variant="secondary"
            >
              <ArrowLeftIcon /> {previous.title}
            </Button>
          ) : null}
          {next ? (
            <Button
              className="ml-auto shadow-none"
              render={<a href={next.url} />}
              size="sm"
              variant="secondary"
            >
              {next.title} <ArrowRightIcon />
            </Button>
          ) : null}
        </div>
      </div>
      <div className="hidden w-72 shrink-0 flex-col xl:flex">
        <div className="sticky top-[calc(var(--header-total-height)+2.5rem)] h-[calc(100svh-(var(--header-total-height)+3.5rem))] overflow-y-auto pb-8 pl-8">
          <DocsTableOfContents toc={toc} />
        </div>
      </div>
    </div>
  );
}
