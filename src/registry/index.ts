import { z } from "zod";
import { hooks } from "@/registry/registry-hooks";
import { ui } from "@/registry/registry-ui";
import { type Registry, registryItemSchema } from "@/shadcn-temp/schema";
import { examples } from "./registry-examples";

const DEPRECATED_ITEMS: string[] = [];

export const registry: Registry = {
	name: "simple-ai",
	homepage: "https://simple-ai.dev",
	items: z.array(registryItemSchema).parse(
		[...ui, ...hooks, ...examples].filter((item) => {
			return !DEPRECATED_ITEMS.includes(item.name);
		}),
	),
};

export default { registry };
