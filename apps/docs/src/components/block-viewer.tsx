"use client";

import { getEntry, getIframeHeight } from "@workspace/registry";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Separator } from "@workspace/ui/components/shadcn/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/shadcn/tabs";
import { cn } from "@workspace/ui/lib/utils";
import {
  Check,
  Clipboard,
  FileIcon,
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  RegistryFileTree,
  registryFileLabel,
} from "@/components/registry-file-tree";
import { trackEvent } from "@/lib/events";
import { highlightCode, languageFromPath } from "@/lib/highlight-code";

const WIDTHS = [
  { value: "desktop", label: "Desktop", icon: Monitor, css: "100%" },
  { value: "tablet", label: "Tablet", icon: Tablet, css: "60%" },
  { value: "mobile", label: "Mobile", icon: Smartphone, css: "30%" },
] as const;

type WidthValue = (typeof WIDTHS)[number]["value"];
type View = "preview" | "code";
const TRAILING_DOT = /\.$/;

interface RegistryFile {
  path: string;
  type?: string;
  target?: string;
  content?: string;
}

function headingText(block: { description?: string; title?: string }) {
  return block.description?.replace(TRAILING_DOT, "") ?? block.title;
}

function copyText(value: string, onCopied: () => void) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return;
  }
  navigator.clipboard.writeText(value).then(onCopied, console.error);
}

export function BlockViewer({ name }: { name: string }) {
  const [view, setView] = useState<View>("preview");
  const [width, setWidth] = useState<WidthValue>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);
  const [files, setFiles] = useState<RegistryFile[] | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<Record<string, string>>({});
  const block = getEntry(name);

  useEffect(() => {
    if (view !== "code" || files !== null) {
      return;
    }
    let cancelled = false;
    fetch(`/r/${name}.json`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${name} source`);
        }
        const payload = (await response.json()) as { files?: RegistryFile[] };
        const nextFiles = payload.files ?? [];
        if (cancelled) {
          return;
        }
        setFiles(nextFiles);
        setActivePath(nextFiles[0]?.path ?? null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFilesError(
            error instanceof Error ? error.message : "Failed to load source"
          );
          setFiles([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [files, name, view]);

  const activeFile = useMemo(
    () => files?.find((file) => file.path === activePath) ?? null,
    [activePath, files]
  );

  useEffect(() => {
    if (!activeFile?.content || highlighted[activeFile.path]) {
      return;
    }
    let cancelled = false;
    const language = languageFromPath(activeFile.target ?? activeFile.path);
    highlightCode(activeFile.content, language)
      .then((html) => {
        if (!cancelled) {
          setHighlighted((current) => ({
            ...current,
            [activeFile.path]: html,
          }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHighlighted((current) => ({
            ...current,
            [activeFile.path]: "",
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeFile, highlighted]);

  if (!block) {
    return (
      <div className="not-prose rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
        Unknown block: <code>{name}</code>
      </div>
    );
  }

  const css = WIDTHS.find((item) => item.value === width)?.css ?? "100%";
  const install = `npx shadcn@latest add @simple-ai/${name}`;
  const highlightedHtml = activeFile ? highlighted[activeFile.path] : undefined;

  return (
    <div
      className="not-prose flex min-w-0 scroll-mt-24 flex-col gap-4"
      data-view={view}
      id={name}
      style={
        {
          "--block-height": `${getIframeHeight(block)}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col gap-2">
        <a
          className="min-w-0 font-medium text-sm underline-offset-2 hover:underline lg:hidden"
          href={`#${name}`}
        >
          {headingText(block)}
        </a>
        <div className="flex w-full min-w-0 flex-nowrap items-center gap-2">
          <Tabs
            className="shrink-0 gap-0"
            onValueChange={(value) => setView(value as View)}
            value={view}
          >
            <TabsList className="h-8 p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
          <a
            className="hidden min-w-0 flex-1 truncate font-medium text-sm underline-offset-2 hover:underline lg:block"
            href={`#${name}`}
          >
            {headingText(block)}
          </a>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {view === "preview" ? (
              <PreviewControls
                name={name}
                onRefresh={() => setIframeKey((key) => key + 1)}
                onWidth={setWidth}
                width={width}
              />
            ) : null}
            <Button
              className="h-8 w-fit gap-1 px-2 shadow-none"
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
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Terminal className="size-4" />
              )}
              <span className="md:hidden">{copied ? "Copied" : "Copy"}</span>
              <span className="hidden md:inline">
                npx shadcn add @simple-ai/{name}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {view === "preview" ? (
        <PreviewFrame
          iframeKey={iframeKey}
          name={name}
          title={block.title}
          width={css}
        />
      ) : (
        <CodePanel
          activeFile={activeFile}
          activePath={activePath}
          copiedFile={copiedFile}
          files={files}
          filesError={filesError}
          highlightedHtml={highlightedHtml}
          name={name}
          onCopiedFile={() => {
            setCopiedFile(true);
            window.setTimeout(() => setCopiedFile(false), 2000);
          }}
          onSelect={setActivePath}
        />
      )}
    </div>
  );
}

function PreviewControls({
  name,
  width,
  onWidth,
  onRefresh,
}: {
  name: string;
  width: WidthValue;
  onWidth: (value: WidthValue) => void;
  onRefresh: () => void;
}) {
  return (
    <>
      <div className="hidden h-8 items-center gap-1 rounded-md border p-1 md:flex">
        {WIDTHS.map((item) => (
          <Button
            className="size-6 rounded-sm p-0"
            key={item.value}
            onClick={() => onWidth(item.value)}
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
          onClick={onRefresh}
          size="icon"
          title="Refresh Preview"
          variant="ghost"
        >
          <RotateCw className="size-4" />
          <span className="sr-only">Refresh Preview</span>
        </Button>
      </div>
      <Button
        className="size-8 md:hidden"
        render={
          <a
            href={`/view/${name}`}
            rel="noreferrer"
            target="_blank"
            title="Open in New Tab"
          />
        }
        size="icon"
        variant="outline"
      >
        <Fullscreen className="size-4" />
        <span className="sr-only">Open in New Tab</span>
      </Button>
    </>
  );
}

function PreviewFrame({
  iframeKey,
  name,
  title,
  width,
}: {
  iframeKey: number;
  name: string;
  title?: string;
  width: string;
}) {
  return (
    <div className="relative grid w-full gap-4">
      <div className="absolute inset-0 right-4 rounded-xl bg-muted" />
      <div className="relative z-10 min-h-(--block-height) after:absolute after:inset-0 after:right-3 after:-z-0 after:rounded-xl after:bg-surface/50">
        <div
          className={cn(
            "relative z-10 h-(--block-height) w-full overflow-hidden rounded-xl border bg-background transition-[width] duration-300 ease-out md:w-(--preview-width)"
          )}
          style={
            {
              "--preview-width": width,
            } as React.CSSProperties
          }
        >
          <iframe
            allow="xr-spatial-tracking"
            className="no-scrollbar relative z-20 size-full bg-background"
            key={iframeKey}
            loading="lazy"
            src={`/view/${name}`}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}

function CodeSource({
  content,
  files,
  highlightedHtml,
}: {
  content?: string;
  files: RegistryFile[] | null;
  highlightedHtml?: string;
}) {
  if (highlightedHtml) {
    return (
      <div
        className="min-w-0"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki HTML from highlightCode
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    );
  }
  if (content) {
    return (
      <pre className="overflow-x-auto p-4 font-mono text-sm">{content}</pre>
    );
  }
  return (
    <p className="p-4 text-muted-foreground text-sm">
      {files === null ? "Loading source…" : "No files in this block."}
    </p>
  );
}

function CodePanel({
  activeFile,
  activePath,
  copiedFile,
  files,
  filesError,
  highlightedHtml,
  name,
  onCopiedFile,
  onSelect,
}: {
  activeFile: RegistryFile | null;
  activePath: string | null;
  copiedFile: boolean;
  files: RegistryFile[] | null;
  filesError: string | null;
  highlightedHtml?: string;
  name: string;
  onCopiedFile: () => void;
  onSelect: (path: string) => void;
}) {
  return (
    <div
      className="flex min-h-(--block-height) overflow-hidden rounded-xl border bg-code text-code-foreground"
      data-slot="highlighted-code"
    >
      <nav className="hidden w-64 shrink-0 overflow-y-auto border-r md:block">
        <div className="flex h-12 items-center border-b px-4 font-medium text-sm">
          Files
        </div>
        <RegistryFileTree
          activePath={activePath}
          files={files ?? []}
          onSelect={onSelect}
        />
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4 text-sm">
          <FileIcon className="size-4 text-muted-foreground" />
          <span className="min-w-0 truncate">
            {activeFile ? registryFileLabel(activeFile) : "Source"}
          </span>
          {activeFile?.content ? (
            <Button
              className="ml-auto size-7"
              onClick={() => {
                copyText(activeFile.content ?? "", onCopiedFile);
                trackEvent({
                  name: "copy_block_code",
                  properties: {
                    name,
                    file: activeFile.path,
                  },
                });
              }}
              size="icon"
              variant="ghost"
            >
              {copiedFile ? <Check /> : <Clipboard />}
              <span className="sr-only">Copy file</span>
            </Button>
          ) : null}
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
          {filesError ? (
            <p className="p-4 text-destructive text-sm">{filesError}</p>
          ) : null}
          <div className="border-b px-2 py-2 md:hidden">
            <select
              className="h-8 w-full rounded-md border bg-background px-2 text-sm"
              onChange={(event) => onSelect(event.target.value)}
              value={activePath ?? ""}
            >
              {(files ?? []).map((file) => (
                <option key={file.path} value={file.path}>
                  {registryFileLabel(file)}
                </option>
              ))}
            </select>
          </div>
          <CodeSource
            content={activeFile?.content}
            files={files}
            highlightedHtml={highlightedHtml}
          />
        </div>
      </div>
    </div>
  );
}
