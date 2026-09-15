"use client";

import {
  FileIcon,
  FolderTreeIcon,
  GlobeIcon,
  PanelRightCloseIcon,
  PlusIcon,
  TerminalIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import type {
  ChatSidePanelTab,
  ChatSidePanelTool,
} from "../hooks/use-chat-side-panel";
import {
  MOCK_WORKSPACE_FILE_CONTENT,
  MOCK_WORKSPACE_TREE,
} from "../lib/mock-workspace-tree";
import { FileExplorerTree } from "./file-explorer-tree";

const TOOL_OPTIONS: {
  tool: ChatSidePanelTool;
  label: string;
  icon: typeof FolderTreeIcon;
}[] = [
  {
    tool: "files",
    label: "Files",
    icon: FolderTreeIcon,
  },
  {
    tool: "browser",
    label: "Browser",
    icon: GlobeIcon,
  },
  {
    tool: "terminal",
    label: "Terminal",
    icon: TerminalIcon,
  },
];
function tabLabel(tab: ChatSidePanelTab): string {
  if (tab.type === "file") {
    return tab.name;
  }
  return (
    TOOL_OPTIONS.find((option) => option.tool === tab.type)?.label ?? tab.type
  );
}
function tabIcon(tab: ChatSidePanelTab) {
  if (tab.type === "file") {
    return FileIcon;
  }
  return (
    TOOL_OPTIONS.find((option) => option.tool === tab.type)?.icon ?? FileIcon
  );
}
export function ChatSidePanel({
  tabs,
  activeTabId,
  activeTab,
  onClosePanel,
  onOpenToolTab,
  onCloseTab,
  onSelectTab,
}: {
  tabs: ChatSidePanelTab[];
  activeTabId: string | null;
  activeTab: ChatSidePanelTab | null;
  onClosePanel: () => void;
  onOpenToolTab: (tool: ChatSidePanelTool) => void;
  onCloseTab: (tabId: string) => void;
  onSelectTab: (tabId: string) => void;
}) {
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-muted/15"
      data-slot="chat-side-panel"
    >
      <div
        className="flex items-center gap-1 border-b bg-background px-2 py-1.5"
        data-slot="chat-side-panel-toolbar"
      >
        {tabs.map((tab) => {
          const Icon = tabIcon(tab);
          const isActive = tab.id === activeTabId;
          return (
            <div
              className={cn(
                "group flex max-w-[180px] shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs",
                isActive
                  ? "border-border bg-muted text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted/60"
              )}
              key={tab.id}
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-1.5"
                onClick={() => onSelectTab(tab.id)}
                type="button"
              >
                <Icon className="size-3 shrink-0" />
                <span className="truncate">{tabLabel(tab)}</span>
              </button>
              <button
                className="rounded-sm p-0.5 opacity-60 hover:bg-background hover:opacity-100"
                onClick={() => onCloseTab(tab.id)}
                type="button"
              >
                <XIcon className="size-3" />
                <span className="sr-only">Close tab</span>
              </button>
            </div>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="size-7 shrink-0"
                size="icon"
                type="button"
                variant="ghost"
              />
            }
          >
            <PlusIcon className="size-3.5" />
            <span className="sr-only">Open new tab</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {TOOL_OPTIONS.map(({ tool, label, icon: Icon }) => (
              <DropdownMenuItem key={tool} onClick={() => onOpenToolTab(tool)}>
                <Icon />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="ml-auto size-7"
          onClick={onClosePanel}
          size="icon"
          type="button"
          variant="ghost"
        >
          <PanelRightCloseIcon className="size-3.5" />
          <span className="sr-only">Close panel</span>
        </Button>
      </div>

      <div
        className="min-h-0 flex-1 overflow-hidden"
        data-slot="chat-side-panel-content"
      >
        {activeTab ? (
          <ChatSidePanelTabContent
            activeFilePath={activeFilePath}
            onOpenFile={(path) => setActiveFilePath(path)}
            tab={activeTab}
          />
        ) : (
          <ChatSidePanelEmptyState onOpenToolTab={onOpenToolTab} />
        )}
      </div>
    </div>
  );
}
function ChatSidePanelEmptyState({
  onOpenToolTab,
}: {
  onOpenToolTab: (tool: ChatSidePanelTool) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-muted-foreground text-sm">
        Open a tool to start exploring the assistant workspace.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {TOOL_OPTIONS.map(({ tool, label, icon: Icon }) => (
          <Button
            className="gap-1.5"
            key={tool}
            onClick={() => onOpenToolTab(tool)}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Icon className="size-3.5" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
function ChatSidePanelTabContent({
  tab,
  activeFilePath,
  onOpenFile,
}: {
  tab: ChatSidePanelTab;
  activeFilePath: string | null;
  onOpenFile: (path: string, name: string) => void;
}) {
  if (tab.type === "files") {
    const fileName = activeFilePath
      ? (activeFilePath.split("/").pop() ?? activeFilePath)
      : null;
    return (
      <ResizablePanelGroup
        data-slot="chat-side-panel-files-split"
        orientation="horizontal"
      >
        <ResizablePanel className="min-h-0" defaultSize="65%" minSize="40%">
          {fileName && activeFilePath ? (
            <FileContent name={fileName} path={activeFilePath} />
          ) : (
            <NoFileSelected />
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          className="min-h-0 overflow-auto bg-background"
          defaultSize="35%"
          maxSize="55%"
          minSize="20%"
        >
          <FileExplorerTree
            nodes={MOCK_WORKSPACE_TREE}
            onOpenFile={onOpenFile}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
  if (tab.type === "browser") {
    return (
      <SidePanelPlaceholder
        description="Embedded browser sessions will render here — navigate URLs, capture snapshots, and hand context back to the assistant."
        title="Browser"
      />
    );
  }
  if (tab.type === "terminal") {
    return (
      <SidePanelPlaceholder
        description="Shell output and command history will appear here once a terminal session is attached to this chat."
        title="Terminal"
      />
    );
  }
  return null;
}
function FileContent({ path, name }: { path: string; name: string }) {
  const content = MOCK_WORKSPACE_FILE_CONTENT[path];
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "pdf" || extension === "docx") {
    return (
      <SidePanelPlaceholder
        description={`Document preview for ${name} — PDF and Word viewers will open here.`}
        title={name}
      />
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-3 py-2 text-muted-foreground text-xs">
        {path}
      </div>
      <pre className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
        {content ?? `// Placeholder content for ${name}`}
      </pre>
    </div>
  );
}
function NoFileSelected() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center"
      data-slot="no-file-selected"
    >
      <FileIcon className="size-6 text-muted-foreground" />
      <p className="font-medium text-sm">No file selected</p>
      <p className="max-w-xs text-muted-foreground text-xs">
        Select a file from the tree to preview its contents.
      </p>
    </div>
  );
}
function SidePanelPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="font-medium text-sm">{title}</p>
      <p className="max-w-xs text-muted-foreground text-xs">{description}</p>
    </div>
  );
}
