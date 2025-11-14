import z from "zod";
import type { item } from "@/db/schema/items";

export type DBItem = typeof item.$inferSelect;

export const createItemSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export type CreateItemSchema = z.infer<typeof createItemSchema>;

export const updateItemSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	status: z.enum(["active", "inactive", "archived"]).optional(),
});

export type UpdateItemSchema = z.infer<typeof updateItemSchema>;
