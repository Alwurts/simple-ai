import { REGISTRY } from "./generated";
import type { RegistryEntry } from "./types";

export { REGISTRY } from "./generated";

export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY[name];
}

const entries = Object.values(REGISTRY);

/** Component demos rendered inline (shadcn `registry:ui`). */
export const components = entries.filter((e) => e.type === "registry:ui");

/** Full-page compositions rendered in an iframe (shadcn `registry:block`). */
export const blocks = entries.filter((e) => e.type === "registry:block");

/** ToolLoopAgent definitions shown on /agents. */
export const agents = entries.filter((e) => e.categories?.includes("agent"));

/** Embedded-preview height (px) for a block, from shadcn's `meta.iframeHeight`. */
export function getIframeHeight(entry: RegistryEntry): number {
  const h = entry.meta.iframeHeight;
  return typeof h === "number" ? h : 600;
}
