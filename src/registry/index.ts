import { examples } from "./registry-examples";
import { hooks } from "./registry-hooks";
import { ui } from "./registry-ui";
import { blocks } from "./registry-blocks";
import type { Registry } from "./schema";

export const registry: Registry = [...ui, ...examples, ...hooks, ...blocks];
