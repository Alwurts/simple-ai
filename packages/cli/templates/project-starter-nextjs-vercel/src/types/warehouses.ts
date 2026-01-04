import { z } from "zod";

// Warehouse schemas
export const createWarehouseSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	location: z.string(),
	isDefault: z.boolean(),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();

export const warehouseSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	location: z.string().nullable(),
	isDefault: z.boolean(),
	createdAt: z.string(),
});

export const warehouseListSchema = z.array(warehouseSchema);

export type Warehouse = z.infer<typeof warehouseSchema>;
export type WarehouseList = z.infer<typeof warehouseListSchema>;
