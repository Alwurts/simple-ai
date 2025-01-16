import { blocks } from "./registry-blocks";
import { examples } from "./registry-examples";
import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
import { ui } from "./registry-ui";
import type { Registry } from "./schema";

export const registry: Registry = [
	...ui,
	...examples,
	...hooks,
	...blocks,
	...lib,
];
