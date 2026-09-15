"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { cn } from "@workspace/ui/lib/utils";
import { useDocsSearch } from "fumadocs-core/search/client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TAGS = /<[^>]+>/g;
const MARK_SPLIT = /(<mark>[\s\S]*?<\/mark>)/gi;
const MARK_EXACT = /^<mark>([\s\S]*?)<\/mark>$/i;

function stripTags(value: string) {
  return value.replace(TAGS, "");
}

function SearchSnippet({ content }: { content: string }) {
  const parts = content.split(MARK_SPLIT);
  return (
    <>
      {parts.map((part, index) => {
        const marked = part.match(MARK_EXACT);
        if (marked) {
          return (
            <mark
              className="rounded bg-brand/20 px-0.5 text-foreground"
              key={`m-${String(index)}`}
            >
              {stripTags(marked[1] ?? "")}
            </mark>
          );
        }
        return <span key={`t-${String(index)}`}>{stripTags(part)}</span>;
      })}
    </>
  );
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
  });

  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, [setSearch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const results = Array.isArray(query.data) ? query.data : [];

  const dialog =
    open && typeof document !== "undefined" ? (
      <div className="fixed inset-0 z-[200]">
        <button
          aria-label="Close search"
          className="absolute inset-0 bg-black/40"
          onClick={close}
          type="button"
        />
        <div
          aria-labelledby={titleId}
          className="relative mx-auto mt-[15vh] w-[min(100%-2rem,32rem)] rounded-xl bg-background p-2 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
          role="dialog"
        >
          <h2 className="sr-only" id={titleId}>
            Search documentation
          </h2>
          <Input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documentation..."
            ref={inputRef}
            value={search}
          />
          <div className="mt-2 max-h-80 overflow-y-auto p-1">
            {search.length === 0 ? (
              <p className="px-2 py-8 text-center text-muted-foreground text-sm">
                Type to search docs.
              </p>
            ) : null}
            {search.length > 0 && results.length === 0 && !query.isLoading ? (
              <p className="px-2 py-8 text-center text-muted-foreground text-sm">
                No results found.
              </p>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {results.map((item) => (
                <li key={item.id}>
                  <a
                    className={cn(
                      "block rounded-md px-2 py-2 text-sm hover:bg-accent",
                      item.type !== "page" && "pl-4 text-muted-foreground"
                    )}
                    href={item.url}
                    onClick={close}
                  >
                    <SearchSnippet content={String(item.content ?? "")} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <Button
        className="relative h-8 w-full justify-start border-0 bg-surface pr-12 pl-3 font-medium text-foreground shadow-none md:w-48 lg:w-56 xl:w-64 dark:bg-card"
        onClick={() => setOpen(true)}
        variant="secondary"
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <span className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <kbd className="rounded border bg-background px-1 font-sans text-[10px] text-muted-foreground">
            ⌘
          </kbd>
          <kbd className="rounded border bg-background px-1 font-sans text-[10px] text-muted-foreground">
            K
          </kbd>
        </span>
      </Button>
      {dialog ? createPortal(dialog, document.body) : null}
    </>
  );
}
