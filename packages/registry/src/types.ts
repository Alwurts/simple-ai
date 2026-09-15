import type { LazyExoticComponent } from "react";
import type { RegistryItem } from "shadcn/schema";

export type RegistryMeta = {
  iframeHeight?: number;
  fullBleed?: boolean;
} & Record<string, unknown>;

export type SimpleAiRegistryItem = RegistryItem & { meta?: RegistryMeta };

/**
 * `item.files[].path` is relative to the item's file root (`ui/` or
 * `blocks/<name>/`); generate rewrites it repo-root-relative. `preview` is the
 * extensionless path under `registry/` that docs lazy-load. Examples are not
 * installable catalog items.
 */
export interface RegistryItemDef {
  item: SimpleAiRegistryItem;
  preview: string;
}

export type RegistryEntry = Pick<
  SimpleAiRegistryItem,
  "name" | "type" | "title" | "description" | "categories"
> & {
  meta: RegistryMeta;
  component: LazyExoticComponent<() => React.JSX.Element>;
};
