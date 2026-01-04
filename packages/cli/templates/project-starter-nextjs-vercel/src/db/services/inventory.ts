import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { movements, products, stockLevels } from "@/db/schema/inventory";

// --- Products ---
export const getProducts = async (userId: string) => {
	// Join with stockLevels to get total quantity
	return await db
		.select({
			id: products.id,
			userId: products.userId,
			sku: products.sku,
			name: products.name,
			description: products.description,
			price: products.price,
			cost: products.cost,
			minStockLevel: products.minStockLevel,
			imageUrl: products.imageUrl,
			createdAt: products.createdAt,
			updatedAt: products.updatedAt,
			totalStock: sql<number>`coalesce(sum(${stockLevels.quantity}), 0)`.mapWith(Number),
		})
		.from(products)
		.leftJoin(stockLevels, eq(products.id, stockLevels.productId))
		.where(eq(products.userId, userId))
		.groupBy(products.id);
};

export const createProduct = async (data: typeof products.$inferInsert) => {
	return await db.insert(products).values(data).returning();
};

// --- Operations ---

// This is the "Brain" of the operation - used by both UI and AI
export const performStockMovement = async (data: {
	userId: string;
	productId: string;
	type: "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";
	quantity: number;
	fromWarehouseId?: string;
	toWarehouseId?: string;
	notes?: string;
}) => {
	return await db.transaction(async (tx) => {
		// 1. Log the movement
		const [movement] = await tx
			.insert(movements)
			.values({
				userId: data.userId,
				productId: data.productId,
				type: data.type,
				quantity: data.quantity,
				fromWarehouseId: data.fromWarehouseId,
				toWarehouseId: data.toWarehouseId,
				notes: data.notes,
			})
			.returning();

		// 2. Update Stock Levels
		if (data.toWarehouseId) {
			// Increase stock at destination
			await tx
				.insert(stockLevels)
				.values({
					productId: data.productId,
					warehouseId: data.toWarehouseId,
					quantity: data.quantity,
				})
				.onConflictDoUpdate({
					target: [stockLevels.productId, stockLevels.warehouseId],
					set: { quantity: sql`${stockLevels.quantity} + ${data.quantity}` },
				});
		}

		if (data.fromWarehouseId) {
			// Decrease stock at source
			await tx
				.update(stockLevels)
				.set({ quantity: sql`${stockLevels.quantity} - ${data.quantity}` })
				.where(
					and(
						eq(stockLevels.productId, data.productId),
						eq(stockLevels.warehouseId, data.fromWarehouseId),
					),
				);
		}

		return movement;
	});
};
