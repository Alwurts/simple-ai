"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/shadcn/collapsible";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react";

export const REGISTRY_FILE_PREFIX =
  /^packages\/registry\/registry\/[^/]+\/[^/]+\//;

export function registryFileLabel(file: { path: string; target?: string }) {
  const path = file.target ?? file.path;
  return path.replace(REGISTRY_FILE_PREFIX, "");
}

export type FileTreeNode =
  | { type: "file"; name: string; path: string }
  | { type: "dir"; name: string; children: FileTreeNode[] };

export function buildFileTree(
  files: Array<{ path: string; target?: string }>
): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  for (const file of files) {
    insertNode(
      root,
      registryFileLabel(file).split("/").filter(Boolean),
      file.path
    );
  }
  return sortTree(root);
}

function insertNode(nodes: FileTreeNode[], parts: string[], path: string) {
  const [head, ...rest] = parts;
  if (!head) {
    return;
  }
  if (rest.length === 0) {
    nodes.push({ type: "file", name: head, path });
    return;
  }
  let dir = nodes.find(
    (node): node is Extract<FileTreeNode, { type: "dir" }> =>
      node.type === "dir" && node.name === head
  );
  if (!dir) {
    dir = { type: "dir", name: head, children: [] };
    nodes.push(dir);
  }
  insertNode(dir.children, rest, path);
}

function sortTree(nodes: FileTreeNode[]): FileTreeNode[] {
  const dirs = nodes
    .filter(
      (node): node is Extract<FileTreeNode, { type: "dir" }> =>
        node.type === "dir"
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((dir) => ({ ...dir, children: sortTree(dir.children) }));
  const files = nodes
    .filter(
      (node): node is Extract<FileTreeNode, { type: "file" }> =>
        node.type === "file"
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...dirs, ...files];
}

function dirContains(node: FileTreeNode, path: string): boolean {
  if (node.type === "file") {
    return node.path === path;
  }
  return node.children.some((child) => dirContains(child, path));
}

function TreeDir({
  node,
  activePath,
  onSelect,
}: {
  node: Extract<FileTreeNode, { type: "dir" }>;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  return (
    <Collapsible
      className="group/folder flex flex-col"
      defaultOpen={activePath ? dirContains(node, activePath) : true}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm hover:bg-muted">
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/folder:rotate-90 group-data-open/folder:rotate-90" />
        <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 truncate">{node.name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-3 flex flex-col border-border/60 border-l pl-1">
        {node.children.map((child) => (
          <TreeNode
            activePath={activePath}
            key={child.type === "file" ? child.path : `dir:${child.name}`}
            node={child}
            onSelect={onSelect}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function TreeNode({
  node,
  activePath,
  onSelect,
}: {
  node: FileTreeNode;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  if (node.type === "dir") {
    return <TreeDir activePath={activePath} node={node} onSelect={onSelect} />;
  }
  return (
    <button
      className={cn(
        "flex w-full items-center gap-1.5 rounded-md py-1 pr-2 pl-2 text-left text-sm hover:bg-muted",
        activePath === node.path && "bg-muted"
      )}
      onClick={() => onSelect(node.path)}
      type="button"
    >
      <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 truncate">{node.name}</span>
    </button>
  );
}

export function RegistryFileTree({
  files,
  activePath,
  onSelect,
}: {
  files: Array<{ path: string; target?: string }>;
  activePath: string | null;
  onSelect: (path: string) => void;
}) {
  const tree = buildFileTree(files);
  return (
    <div className="flex flex-col p-1">
      {tree.map((node) => (
        <TreeNode
          activePath={activePath}
          key={node.type === "file" ? node.path : `dir:${node.name}`}
          node={node}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
