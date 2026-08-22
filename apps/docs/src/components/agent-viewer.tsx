"use client";

import type { AgentToolMeta } from "@workspace/registry";
import { getEntry } from "@workspace/registry";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/shadcn/tabs";
import { Check, Clipboard, FileIcon, Terminal } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  RegistryFileTree,
  registryFileLabel,
} from "@/components/registry-file-tree";
import { trackEvent } from "@/lib/events";
import { highlightCode, languageFromPath } from "@/lib/highlight-code";

type View = "overview" | "code";

interface RegistryFile {
  path: string;
  type?: string;
  target?: string;
  content?: string;
}

function copyText(value: string, onCopied: () => void) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return;
  }
  navigator.clipboard.writeText(value).then(onCopied, console.error);
}

function readTools(meta: Record<string, unknown>): AgentToolMeta[] {
  const tools = meta.tools;
  if (!Array.isArray(tools)) {
    return [];
  }
  return tools.flatMap((tool) => {
    if (
      tool &&
      typeof tool === "object" &&
      "name" in tool &&
      "description" in tool &&
      typeof tool.name === "string" &&
      typeof tool.description === "string"
    ) {
      return [{ name: tool.name, description: tool.description }];
    }
    return [];
  });
}

function readWireWith(meta: Record<string, unknown>): string[] {
  const wireWith = meta.wireWith;
  if (!Array.isArray(wireWith)) {
    return [];
  }
  return wireWith.filter((item): item is string => typeof item === "string");
}

function AgentOverview({
  title,
  description,
  tools,
  wireWith,
}: {
  title: string;
  description?: string;
  tools: AgentToolMeta[];
  wireWith: string[];
}) {
  return (
    <div className="rounded-xl border bg-background" data-slot="agent-overview">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-1">
          <p className="font-medium">{title}</p>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {tools.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Tools
            </h3>
            <ul className="divide-y rounded-lg border">
              {tools.map((tool) => (
                <li
                  className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-baseline sm:gap-4"
                  key={tool.name}
                >
                  <code className="shrink-0 font-mono text-sm">
                    {tool.name}
                  </code>
                  <span className="text-muted-foreground text-sm">
                    {tool.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {wireWith.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Wire with
            </h3>
            <p className="text-muted-foreground text-sm">
              Add a chat page and an API, then point{" "}
              <code>chat-transport.ts</code> at <code>/api/chat</code>.
            </p>
            <ul className="flex flex-wrap gap-2">
              {wireWith.map((item) => (
                <li key={item}>
                  <code className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs">
                    {item}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AgentSource({
  files,
  filesError,
  activePath,
  activeFile,
  highlightedHtml,
  copiedFile,
  onSelectPath,
  onCopyFile,
}: {
  files: RegistryFile[] | null;
  filesError: string | null;
  activePath: string | null;
  activeFile: RegistryFile | null;
  highlightedHtml: string | undefined;
  copiedFile: boolean;
  onSelectPath: (path: string) => void;
  onCopyFile: () => void;
}) {
  let body: ReactNode;
  if (highlightedHtml) {
    body = (
      <div
        className="min-w-0"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki HTML from highlightCode
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    );
  } else if (activeFile?.content) {
    body = (
      <pre className="overflow-x-auto p-4 font-mono text-sm">
        {activeFile.content}
      </pre>
    );
  } else {
    body = (
      <p className="p-4 text-muted-foreground text-sm">
        {files === null ? "Loading source…" : "No files in this agent."}
      </p>
    );
  }

  return (
    <div
      className="flex min-h-80 overflow-hidden rounded-xl border bg-code text-code-foreground"
      data-slot="highlighted-code"
    >
      <nav className="hidden w-64 shrink-0 overflow-y-auto border-r md:block">
        <div className="flex h-12 items-center border-b px-4 font-medium text-sm">
          Files
        </div>
        <RegistryFileTree
          activePath={activePath}
          files={files ?? []}
          onSelect={onSelectPath}
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
              onClick={onCopyFile}
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
              onChange={(event) => onSelectPath(event.target.value)}
              value={activePath ?? ""}
            >
              {(files ?? []).map((file) => (
                <option key={file.path} value={file.path}>
                  {registryFileLabel(file)}
                </option>
              ))}
            </select>
          </div>
          {body}
        </div>
      </div>
    </div>
  );
}

export function AgentViewer({ name }: { name: string }) {
  const [view, setView] = useState<View>("overview");
  const [copied, setCopied] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);
  const [files, setFiles] = useState<RegistryFile[] | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<Record<string, string>>({});
  const agent = getEntry(name);

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

  if (!agent) {
    return (
      <div className="not-prose rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
        Unknown agent: <code>{name}</code>
      </div>
    );
  }

  const install = `npx shadcn@latest add @simple-ai/${name}`;
  const highlightedHtml = activeFile ? highlighted[activeFile.path] : undefined;
  const tools = readTools(agent.meta);
  const wireWith = readWireWith(agent.meta);

  return (
    <div
      className="not-prose flex min-w-0 scroll-mt-24 flex-col gap-4"
      data-view={view}
      id={name}
    >
      <div className="flex flex-col gap-2">
        <a
          className="min-w-0 font-medium text-sm underline-offset-2 hover:underline lg:hidden"
          href={`#${name}`}
        >
          {agent.title ?? name}
        </a>
        <div className="flex w-full min-w-0 flex-nowrap items-center gap-2">
          <Tabs
            className="shrink-0 gap-0"
            onValueChange={(value) => setView(value as View)}
            value={view}
          >
            <TabsList className="h-8 p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
          <a
            className="hidden min-w-0 flex-1 truncate font-medium text-sm underline-offset-2 hover:underline lg:block"
            href={`#${name}`}
          >
            {agent.title ?? name}
          </a>
          <Button
            className="ml-auto h-8 w-fit shrink-0 gap-1 px-2 shadow-none"
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

      {view === "overview" ? (
        <AgentOverview
          description={agent.description}
          title={agent.title ?? name}
          tools={tools}
          wireWith={wireWith}
        />
      ) : (
        <AgentSource
          activeFile={activeFile}
          activePath={activePath}
          copiedFile={copiedFile}
          files={files}
          filesError={filesError}
          highlightedHtml={highlightedHtml}
          onCopyFile={() => {
            if (!activeFile?.content) {
              return;
            }
            copyText(activeFile.content, () => {
              setCopiedFile(true);
              window.setTimeout(() => setCopiedFile(false), 2000);
            });
            trackEvent({
              name: "copy_block_code",
              properties: {
                name,
                file: activeFile.path,
              },
            });
          }}
          onSelectPath={setActivePath}
        />
      )}
    </div>
  );
}
