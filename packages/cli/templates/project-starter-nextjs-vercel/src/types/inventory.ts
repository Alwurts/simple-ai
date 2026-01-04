import { z } from "zod";

// Product input schemas
export const createProductSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	sku: z.string().min(2, "SKU must be at least 2 characters"),
	price: z.coerce.number().min(0, "Price must be positive").optional(),
	description: z.string().optional(),
	minStockLevel: z.coerce.number().min(0, "Minimum stock must be positive").optional().default(5),
});

export const updateProductSchema = z.object({
	name: z.string().min(2).optional(),
	sku: z.string().min(2).optional(),
	price: z.coerce.number().min(0).optional(),
	description: z.string().optional(),
	minStockLevel: z.coerce.number().min(0).optional(),
});

// Product output schemas
export const productSchema = z.object({
	id: z.string(),
	userId: z.string(),
	sku: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.string().nullable(),
	cost: z.string().nullable(),
	minStockLevel: z.number().nullable(),
	imageUrl: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	totalStock: z.number(),
});

export const productsListSchema = z.array(productSchema);

// Movement schemas
export const createMovementSchema = z.object({
	productId: z.string(),
	type: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"]),
	quantity: z.coerce.number().min(1),
	fromWarehouseId: z.string().optional(),
	toWarehouseId: z.string().optional(),
	notes: z.string().optional(),
});

export const movementSchema = z.object({
	type: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"]),
	id: z.string(),
	createdAt: z.string(),
	userId: z.string(),
	productId: z.string(),
	quantity: z.number(),
	fromWarehouseId: z.string().nullable(),
	toWarehouseId: z.string().nullable(),
	notes: z.string().nullable(),
});

// Infer types from schemas (single source of truth)
export type Product = z.infer<typeof productSchema>;
export type ProductsList = z.infer<typeof productsListSchema>;
export type Movement = z.infer<typeof movementSchema>;
