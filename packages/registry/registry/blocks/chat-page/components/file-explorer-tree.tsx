"use client";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { WorkspaceFileNode } from "../lib/mock-workspace-tree";

export function FileExplorerTree({
  nodes,
  onOpenFile,
  className,
}: {
  nodes: WorkspaceFileNode[];
  onOpenFile: (path: string, name: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-0.5 p-2 text-sm", className)}
      data-slot="file-explorer-tree"
    >
      {nodes.map((node) => (
        <FileExplorerTreeNode
          key={node.path}
          node={node}
          onOpenFile={onOpenFile}
        />
      ))}
    </div>
  );
}

function FileExplorerTreeNode({
  node,
  depth = 0,
  onOpenFile,
}: {
  node: WorkspaceFileNode;
  depth?: number;
  onOpenFile: (path: string, name: string) => void;
}) {
  const isFolder = Boolean(node.children?.length);

  if (!isFolder) {
    return (
      <button
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-muted hover:text-foreground"
        data-slot="file-explorer-tree-file"
        onClick={() => onOpenFile(node.path, node.name)}
        type="button"
      >
        <FileIcon className="size-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <Collapsible defaultOpen={depth < 2}>
      <CollapsibleTrigger
        className="group flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left hover:bg-muted"
        data-slot="file-explorer-tree-folder-trigger"
      >
        <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
        <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{node.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="ml-3.5 flex flex-col gap-0.5 border-border/60 border-l pl-1.5"
        data-slot="file-explorer-tree-folder-content"
      >
        {node.children?.map((child) => (
          <FileExplorerTreeNode
            depth={depth + 1}
            key={child.path}
            node={child}
            onOpenFile={onOpenFile}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
