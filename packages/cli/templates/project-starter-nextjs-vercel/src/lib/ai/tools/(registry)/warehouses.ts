import { tool } from "ai";
import { z } from "zod";
import {
	createWarehouse,
	deleteWarehouse,
	getWarehouse,
	getWarehouses,
	updateWarehouse,
} from "@/db/services/warehouses";
import {
	createWarehouseSchema,
	updateWarehouseSchema,
	warehouseListSchema,
	warehouseSchema,
} from "@/types/warehouses";

export const createWarehouseTools = (userId: string) => {
	return {
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
