import type { LazyExoticComponent } from "react";
import type { RegistryItem } from "shadcn/schema";

export type RegistryMeta = {
  /** Embedded-preview height (px) for an iframed block — shadcn's convention. */
  iframeHeight?: number;
  /** Render the component docs preview in an iframe (full-page layouts). */
  fullBleed?: boolean;
} & Record<string, unknown>;

export type SimpleAiRegistryItem = RegistryItem & { meta?: RegistryMeta };

/**
 * What each `registry/{blocks,components}/<name>/item.ts` default-exports — the
 * source for one item.
 *
 * - `item` is the shadcn `RegistryItem` that lands in the generated root
 *   `registry.json`. Authors write `files[].path` RELATIVE to the item directory;
 *   the build rewrites them repo-root-relative (the GitHub-registry requirement).
 * - `preview` names the file under the item directory (no extension) to lazy-load
 *   for the gallery preview.
 */
export interface RegistryItemDef {
  item: SimpleAiRegistryItem;
  preview: string;
}

/**
 * A gallery-ready entry: the display subset of the manifest plus the lazily
 * loaded preview component. The generate script emits a map of these into
 * `src/generated.ts`.
 */
export type RegistryEntry = Pick<
  SimpleAiRegistryItem,
  "name" | "type" | "title" | "description"
> & {
  meta: RegistryMeta;
  component: LazyExoticComponent<() => React.JSX.Element>;
};
