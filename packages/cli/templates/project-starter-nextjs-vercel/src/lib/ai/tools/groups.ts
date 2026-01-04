import type { aiToolId } from "./registry";

// Tool IDs grouped by package

export const toolIdsGroups: Record<string, aiToolId[]> = {
	system: ["load-skill"],
	inventory: [
		"list-products",
		"get-product",
		"create-product",
		"update-product",
		"create-movement",
	],
};
