import { tool } from "ai";
import { z } from "zod";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	performStockMovement,
	updateProduct,
} from "@/db/services/inventory";
import {
	createWarehouse,
	deleteWarehouse,
	getWarehouse,
	getWarehouses,
	updateWarehouse,
} from "@/db/services/warehouses";
import {
	createMovementSchema,
	createProductSchema,
	createWarehouseSchema,
	movementSchema,
	productSchema,
	productsListSchema,
	updateProductSchema,
	updateWarehouseSchema,
	warehouseListSchema,
	warehouseSchema,
} from "@/types/inventory";

export const createInventoryTools = (userId: string) => {
	return {
		"list-products": tool({
			description: "List all inventory products with their stock levels.",
			inputSchema: z.object({}),
			outputSchema: productsListSchema,
			execute: async () => {
				return await getProducts(userId);
			},
		}),
		"get-product": tool({
			description: "Get details of a specific product by ID.",
			inputSchema: z.object({ id: z.string() }),
			outputSchema: productSchema,
			execute: async ({ id }) => {
				return await getProduct(id, userId);
			},
		}),
		"create-product": tool({
			description: "Create a new inventory product.",
			inputSchema: createProductSchema,
			outputSchema: productSchema,
			execute: async (input) => {
				const result = await createProduct({
					...input,
					userId,
					price: input.price?.toString(),
				});
				return result[0];
			},
		}),
		"update-product": tool({
			description: "Update an existing product.",
			inputSchema: z.object({
				id: z.string(),
				data: updateProductSchema,
			}),
			outputSchema: productSchema,
			execute: async ({ id, data }) => {
				const result = await updateProduct(id, userId, {
					...data,
					price: data.price?.toString(),
				});
				return result;
			},
		}),
		"create-movement": tool({
			description: "Record a stock movement (restock, adjust, transfer).",
			inputSchema: createMovementSchema,
			outputSchema: movementSchema,
			execute: async (input) => {
				const result = await performStockMovement({
					...input,
					userId,
				});
				return result;
			},
		}),
		"list-warehouses": tool({
			description: "List all warehouses.",
			inputSchema: z.object({}),
			outputSchema: warehouseListSchema,
			execute: async () => {
				return await getWarehouses(userId);
			},
		}),
		"get-warehouse": tool({
			description: "Get details of a specific warehouse by ID.",
			inputSchema: z.object({ id: z.string() }),
			outputSchema: warehouseSchema,
			execute: async ({ id }) => {
				return await getWarehouse(id, userId);
			},
		}),
		"create-warehouse": tool({
			description: "Create a new warehouse.",
			inputSchema: createWarehouseSchema,
			outputSchema: warehouseSchema,
			execute: async (input) => {
				const result = await createWarehouse({
					...input,
					userId,
				});
				return result[0];
			},
		}),
		"update-warehouse": tool({
			description: "Update an existing warehouse.",
			inputSchema: z.object({
				id: z.string(),
				data: updateWarehouseSchema,
			}),
			outputSchema: warehouseSchema,
			execute: async ({ id, data }) => {
				const result = await updateWarehouse(id, userId, data);
				return result;
			},
		}),
		"delete-product": tool({
			description: "Delete a product.",
			inputSchema: z.object({ id: z.string() }),
			outputSchema: z.any(),
			execute: async ({ id }) => {
				return await deleteProduct(id, userId);
			},
		}),
		"delete-warehouse": tool({
			description: "Delete a warehouse.",
			inputSchema: z.object({ id: z.string() }),
			outputSchema: z.any(),
			execute: async ({ id }) => {
				return await deleteWarehouse(id, userId);
			},
		}),
	};
};
