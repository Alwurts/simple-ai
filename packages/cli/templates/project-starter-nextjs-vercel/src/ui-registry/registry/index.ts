import { z } from "zod";
import { blocks } from "./registry-blocks";
import { examples } from "./registry-examples";
import { hooks } from "./registry-hooks";
import { lib } from "./registry-lib";
// Registry category imports
import { ui } from "./registry-ui";
import { type Registry, registryItemSchema } from "./schema";

const DEPRECATED_ITEMS: string[] = [];

export const registry: Registry = {
	name: "project-starter",
	homepage: "https://your-project.dev",
	items: z.array(registryItemSchema).parse(
		[...ui, ...blocks, ...examples, ...hooks, ...lib].filter((item) => {
			return !DEPRECATED_ITEMS.includes(item.name);
		}),
	),
};

export default { registry };
