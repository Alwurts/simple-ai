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
  return slug.replaceAll("-", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function itemToPage(item: Item): DocsNavPage {
  return {
    title: asText(item.name, titleFromUrl(item.url)),
    url: item.url,
  };
}

function folderPages(folder: Folder): DocsNavPage[] {
  const pages: DocsNavPage[] = [];
  const childPages: DocsNavPage[] = [];
  for (const child of folder.children) {
    if (child.type === "page" && child.url !== folder.index?.url) {
      childPages.push(itemToPage(child));
    }
  }
  // Folder index is the section landing — don't repeat the folder name as a page.
  if (folder.index && childPages.length === 0) {
    pages.push(itemToPage(folder.index));
  }
  pages.push(...childPages);
  return pages;
}

export function docsNavFromTree(tree: Root): DocsNavGroup[] {
  const start: DocsNavPage[] = [];
  const groups: DocsNavGroup[] = [];

  for (const node of tree.children) {
    if (node.type === "page") {
      start.push(itemToPage(node));
    }
    if (node.type === "folder") {
      groups.push({
        title: asText(node.name, "Section"),
        pages: folderPages(node),
      });
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
