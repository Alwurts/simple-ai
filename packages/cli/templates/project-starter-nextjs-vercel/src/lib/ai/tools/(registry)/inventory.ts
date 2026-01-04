import { tool } from "ai";
import { z } from "zod";
import {
	createProduct,
	getProduct,
	getProducts,
	performStockMovement,
	updateProduct,
} from "@/db/services/inventory";
import {
	createMovementSchema,
	createProductSchema,
	movementSchema,
	productSchema,
	productsListSchema,
	updateProductSchema,
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
	};
};
