import type { aiToolId } from "./registry";

// Tool IDs grouped by package

export const toolIdsGroups: Record<string, aiToolId[]> = {
	system: ["load-skill"],
	products: [
		"list-products",
		"get-product",
		"create-product",
		"update-product",
		"create-movement",
		"delete-product",
	],
	warehouses: [
		"list-warehouses",
		"get-warehouse",
		"create-warehouse",
		"update-warehouse",
		"delete-warehouse",
	],
};
