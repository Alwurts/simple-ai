import type { aiToolId } from "./registry";

// Tool IDs grouped by package

export const toolIdsGroups: Record<string, aiToolId[]> = {
	system: ["load-skill"],
	productManagement: [
		"list-products",
		"get-product",
		"create-product",
		"update-product",
		"delete-product",
	],
	warehouseManagement: [
		"list-warehouses",
		"get-warehouse",
		"create-warehouse",
		"update-warehouse",
		"delete-warehouse",
	],
	stockMovements: ["create-movement", "list-products", "list-warehouses"],
};
