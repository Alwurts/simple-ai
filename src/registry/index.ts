import { ui } from "./registry-ui";
import { examples } from "./registry-examples";
import type { Registry } from "./schema";
import { hooks } from "./registry-hooks";

export const registry: Registry = [...ui, ...examples, ...hooks];
