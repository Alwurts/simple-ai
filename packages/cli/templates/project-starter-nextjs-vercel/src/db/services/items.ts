import { and, eq } from "drizzle-orm";
import type { CreateItemSchema } from "@/types/items";
import { db } from "..";
import { item } from "../schema/items";

export const getItems = async ({ userId }: { userId: string }) => {
	const items = await db.select().from(item).where(eq(item.userId, userId));
	return items;
};

export const getItemById = async ({ id, userId }: { id: string; userId: string }) => {
	const items = await db
		.select()
		.from(item)
		.where(and(eq(item.id, id), eq(item.userId, userId)));
	return items[0] || null;
};

export const createItem = async ({ userId, ...newItem }: { userId: string } & CreateItemSchema) => {
	const createdItem = await db
		.insert(item)
		.values({ userId, ...newItem })
		.returning();
	return createdItem[0];
};

export const updateItem = async ({
	id,
	userId,
	updates,
}: {
	id: string;
	userId: string;
	updates: Partial<CreateItemSchema>;
}) => {
	const updatedItem = await db
		.update(item)
		.set({ ...updates, updatedAt: new Date().toISOString() })
		.where(and(eq(item.id, id), eq(item.userId, userId)))
		.returning();
	return updatedItem[0] || null;
};

export const deleteItem = async ({ id, userId }: { id: string; userId: string }) => {
	const deletedItem = await db
		.delete(item)
		.where(and(eq(item.id, id), eq(item.userId, userId)))
		.returning();
	return deletedItem[0] || null;
};
