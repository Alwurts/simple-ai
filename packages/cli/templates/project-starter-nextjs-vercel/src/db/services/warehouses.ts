import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { warehouses } from "@/db/schema/warehouses";

export const getWarehouses = async (userId: string) => {
	return await db
		.select()
		.from(warehouses)
		.where(eq(warehouses.userId, userId))
		.orderBy(warehouses.name);
};

export const getWarehouse = async (id: string, userId: string) => {
	const [warehouse] = await db
		.select()
		.from(warehouses)
		.where(and(eq(warehouses.id, id), eq(warehouses.userId, userId)));
	return warehouse;
};

export const getDefaultWarehouse = async (userId: string) => {
	const [warehouse] = await db
		.select()
		.from(warehouses)
		.where(and(eq(warehouses.userId, userId), eq(warehouses.isDefault, true)));
	return warehouse;
};

export const createWarehouse = async (data: typeof warehouses.$inferInsert) => {
	return await db.transaction(async (tx) => {
		// If this is set as default, unset others first
		if (data.isDefault) {
			await tx
				.update(warehouses)
				.set({ isDefault: false })
				.where(eq(warehouses.userId, data.userId));
		}

		return await tx.insert(warehouses).values(data).returning();
	});
};

export const updateWarehouse = async (
	id: string,
	userId: string,
	data: Partial<typeof warehouses.$inferInsert>,
) => {
	return await db.transaction(async (tx) => {
		// If setting as default, unset others
		if (data.isDefault) {
			await tx.update(warehouses).set({ isDefault: false }).where(eq(warehouses.userId, userId));
		}

		const [updated] = await tx
			.update(warehouses)
			.set(data)
			.where(and(eq(warehouses.id, id), eq(warehouses.userId, userId)))
			.returning();
		return updated;
	});
};

export const deleteWarehouse = async (id: string, userId: string) => {
	const [deleted] = await db
		.delete(warehouses)
		.where(and(eq(warehouses.id, id), eq(warehouses.userId, userId)))
		.returning();
	return deleted;
};
