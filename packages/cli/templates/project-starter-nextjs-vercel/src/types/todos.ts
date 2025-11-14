import z from "zod";
import type { todo } from "@/db/schema/todos";

export type DBTodo = typeof todo.$inferSelect;

export const createTodoSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	completed: z.boolean(),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	completed: z.boolean().optional(),
});

export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
