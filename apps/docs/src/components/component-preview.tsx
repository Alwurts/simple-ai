import { getEntry, getIframeHeight } from "@workspace/registry";
import { Button } from "@workspace/ui/components/shadcn/button";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { Fullscreen } from "lucide-react";
import { Suspense } from "react";

/**
 * ComponentPreview — renders a `registry:ui` demo inline (direct render, no
 * iframe) in a centered, bordered surface. The lightweight counterpart to
 * `BlockViewer`: components are small and self-contained, so they live in the
 * docs page; only full-page layouts (`meta.fullBleed`) are iframed.
 */
export function ComponentPreview({ name }: { name: string }) {
  const entry = getEntry(name);
  if (!entry) {
    return (
      <div className="not-prose rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
        Unknown component: <code>{name}</code>
      </div>
    );
  }
  const Demo = entry.component;
  const fullBleed = Boolean(entry.meta.fullBleed);
  return (
    <div className="not-prose relative mt-4 mb-12 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="px-2 font-medium text-base text-muted-foreground md:px-0">
          Preview
        </p>
        <Button
          className="size-7 rounded-sm p-0"
          render={
            <a
              href={`/view/${entry.name}`}
              rel="noreferrer"
              target="_blank"
              title="Open full screen"
            >
              <span className="sr-only">Open full screen</span>
            </a>
          }
          size="icon"
          variant="ghost"
        >
          <Fullscreen className="size-4" />
          <span className="sr-only">Open full screen</span>
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-lg border md:-mx-1">
        {fullBleed ? (
          <iframe
            className="w-full"
            src={`/view/${entry.name}`}
            style={{ height: getIframeHeight(entry) }}
            title={entry.title ?? entry.name}
          />
        ) : (
          <div className="preview flex h-[450px] w-full items-center justify-center p-10">
            <TooltipProvider delay={0}>
              <Suspense fallback={null}>
                <Demo />
              </Suspense>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
