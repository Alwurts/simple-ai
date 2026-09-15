import { REGISTRY } from "./generated";
import type { RegistryEntry } from "./types";

export { REGISTRY } from "./generated";

export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY[name];
}

const entries = Object.values(REGISTRY);

export const components = entries.filter((e) => e.type === "registry:ui");

export const blocks = entries.filter((e) => e.type === "registry:block");

export function getIframeHeight(entry: RegistryEntry): number {
  const h = entry.meta.iframeHeight;
  return typeof h === "number" ? h : 600;
}
