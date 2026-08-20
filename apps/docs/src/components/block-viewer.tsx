"use client";

import { getEntry, getIframeHeight } from "@workspace/registry";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import { cn } from "@workspace/ui/lib/utils";
import { trackEvent } from "@/lib/events";
import {
  Check,
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react";
import { useState } from "react";

const WIDTHS = [
  { value: "desktop", label: "Desktop", icon: Monitor, css: "100%" },
  { value: "tablet", label: "Tablet", icon: Tablet, css: "60%" },
  { value: "mobile", label: "Mobile", icon: Smartphone, css: "30%" },
] as const;

type WidthValue = (typeof WIDTHS)[number]["value"];

function copyText(value: string, onCopied: () => void) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return;
  }
  navigator.clipboard.writeText(value).then(onCopied, console.error);
}

export function BlockViewer({ name }: { name: string }) {
  const [width, setWidth] = useState<WidthValue>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const block = getEntry(name);

  if (!block) {
    return (
      <div className="not-prose rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
        Unknown block: <code>{name}</code>
      </div>
    );
  }

  const css = WIDTHS.find((item) => item.value === width)?.css ?? "100%";
  const install = `npx shadcn@latest add @simple-ai/${name}`;

  return (
    <div
      className="not-prose flex min-w-0 scroll-mt-24 flex-col gap-4"
      id={name}
      style={
        {
          "--block-height": `${getIframeHeight(block)}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <a
          className="min-w-0 flex-1 font-medium text-sm underline-offset-2 hover:underline"
          href={`#${name}`}
        >
          {block.description?.replace(/\.$/, "") ?? block.title}
        </a>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex h-8 items-center gap-1 rounded-md border p-1">
            {WIDTHS.map((item) => (
              <Button
                className="size-6 rounded-sm p-0"
                key={item.value}
                onClick={() => setWidth(item.value)}
                size="icon"
                title={item.label}
                variant={width === item.value ? "secondary" : "ghost"}
              >
                <item.icon className="size-4" />
                <span className="sr-only">{item.label}</span>
              </Button>
            ))}
            <Separator
              className="mx-0.5 h-4 w-px self-center data-vertical:h-4 data-vertical:self-center"
              orientation="vertical"
            />
            <Button
              className="size-6 rounded-sm p-0"
              render={
                <a
                  href={`/view/${name}`}
                  rel="noreferrer"
                  target="_blank"
                  title="Open in New Tab"
                />
              }
              size="icon"
              variant="ghost"
            >
              <Fullscreen className="size-4" />
              <span className="sr-only">Open in New Tab</span>
            </Button>
            <Separator
              className="mx-0.5 h-4 w-px self-center data-vertical:h-4 data-vertical:self-center"
              orientation="vertical"
            />
            <Button
              className="size-6 rounded-sm p-0"
              onClick={() => setIframeKey((key) => key + 1)}
              size="icon"
              title="Refresh Preview"
              variant="ghost"
            >
              <RotateCw className="size-4" />
              <span className="sr-only">Refresh Preview</span>
            </Button>
          </div>

          <Button
            className="w-fit gap-1 px-2 shadow-none"
            onClick={() => {
              copyText(install, () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
              trackEvent({
                name: "copy_npm_command",
                properties: { command: install },
              });
            }}
            size="sm"
            variant="outline"
          >
            {copied ? <Check className="size-4" /> : <Terminal className="size-4" />}
            <span>npx shadcn add @simple-ai/{name}</span>
          </Button>
        </div>
      </div>

      <div className="relative grid w-full gap-4">
        <div className="absolute inset-0 right-4 rounded-xl bg-muted" />
        <div className="after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl after:bg-surface/50 relative z-10 min-h-(--block-height)">
          <div
            className={cn(
              "relative z-10 h-(--block-height) overflow-hidden rounded-xl border bg-background transition-[width] duration-300 ease-out"
            )}
            style={{ width: css }}
          >
            <iframe
              className="no-scrollbar relative z-20 size-full bg-background"
              key={iframeKey}
              loading="lazy"
              src={`/view/${name}`}
              title={block.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
