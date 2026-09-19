import type { Folder, Item, Root } from "fumadocs-core/page-tree";
import { findNeighbour } from "fumadocs-core/page-tree";
import type { ReactNode } from "react";

export interface DocsNavPage {
  title: string;
  url: string;
}

export interface DocsNavGroup {
  title: string;
  pages: DocsNavPage[];
}

function asText(name: ReactNode, fallback: string) {
  if (typeof name === "string" && name.length > 0) {
    return name;
  }
  if (typeof name === "number") {
    return String(name);
  }
  return fallback;
}

function titleFromUrl(url: string) {
  const slug = url.split("/").filter(Boolean).at(-1);
  if (!slug || slug === "docs") {
    return "Introduction";
  }
  return slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function itemToPage(item: Item): DocsNavPage {
  return {
    title: asText(item.name, titleFromUrl(item.url)),
    url: item.url,
  };
}

function folderGroups(folder: Folder): DocsNavGroup[] {
  const groups: DocsNavGroup[] = [];
  let title = asText(folder.name, "Section");
  let pages: DocsNavPage[] = [];

  const flush = () => {
    if (pages.length === 0) {
      return;
    }
    groups.push({ pages, title });
    pages = [];
  };

  for (const child of folder.children) {
    if (child.type === "separator") {
      flush();
      title = asText(child.name, "Section");
      continue;
    }
    if (child.type === "page" && child.url !== folder.index?.url) {
      pages.push(itemToPage(child));
    }
  }

  if (folder.index && groups.length === 0 && pages.length === 0) {
    pages.push(itemToPage(folder.index));
  }
  flush();
  return groups;
}

export function docsNavFromTree(tree: Root): DocsNavGroup[] {
  const start: DocsNavPage[] = [];
  const groups: DocsNavGroup[] = [];

  for (const node of tree.children) {
    if (node.type === "page") {
      start.push(itemToPage(node));
    }
    if (node.type === "folder") {
      groups.push(...folderGroups(node));
    }
  }

  return [{ title: "Get Started", pages: start }, ...groups].filter(
    (group) => group.pages.length > 0
  );
}

export function docsNeighbours(tree: Root, url: string) {
  const { previous, next } = findNeighbour(tree, url);
  return {
    previous: previous ? itemToPage(previous) : undefined,
    next: next ? itemToPage(next) : undefined,
  };
}
