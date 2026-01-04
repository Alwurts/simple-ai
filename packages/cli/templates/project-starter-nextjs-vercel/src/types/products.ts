import { z } from "zod";
import { aiOptional } from "@/lib/zod";

// Product input schemas
export const createProductSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	sku: z.string().min(2, "SKU must be at least 2 characters"),
	price: z.coerce.number().min(0, "Price must be positive").optional(),
	description: z.string().nullable().optional(),
	minStockLevel: z.coerce.number().min(0, "Minimum stock must be positive").optional().default(5),
});

export const productFormSchema = createProductSchema.extend({
	price: z.number().min(0, "Price must be positive"),
	minStockLevel: z.number().min(0, "Minimum stock must be positive"),
	description: z.string().nullable(),
});

export const updateProductSchema = z.object({
	name: z.string().min(2).optional(),
	sku: z.string().min(2).optional(),
	price: z.coerce.number().min(0).optional(),
	description: z.string().nullable().optional(),
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
	productId: z.string().describe("The ID of the product being moved"),
	type: z
		.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"])
		.describe(
			"The type of movement. IN (restock), OUT (sales/removal), TRANSFER (between warehouses), ADJUSTMENT (stock correction).",
		),
	quantity: z.coerce.number().min(1).describe("The quantity of items moved. Must be positive."),
	fromWarehouseId: aiOptional(z.string()).describe(
		"The source warehouse ID. Required for TRANSFER and OUT movements. Optional for ADJUSTMENT when decreasing stock.",
	),
	toWarehouseId: aiOptional(z.string()).describe(
		"The destination warehouse ID. Required for TRANSFER and IN movements. Optional for ADJUSTMENT when increasing stock.",
	),
	notes: aiOptional(z.string()).describe("Optional notes details about the movement"),
});

export const movementFormSchema = createMovementSchema.omit({ productId: true }).extend({
	quantity: z.number().min(1, "Quantity must be at least 1"),
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

export type Product = z.infer<typeof productSchema>;
export type ProductsList = z.infer<typeof productsListSchema>;
export type Movement = z.infer<typeof movementSchema>;
