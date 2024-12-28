import { ui } from "./registry-ui";
import { examples } from "./registry-examples";
import type { Registry } from "./schema";

export const registry: Registry = [...ui, ...examples];
