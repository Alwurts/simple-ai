import { and, eq } from "drizzle-orm";
import type { CreateTodoSchema } from "@/types/todos";
import { db } from "..";
import { todo } from "../schema/todos";
import type { DatabaseClient } from "../types";

export const getTodos = async ({ userId }: { userId: string }, dbClient: DatabaseClient = db) => {
	const todos = await dbClient.select().from(todo).where(eq(todo.userId, userId));
	return todos;
};

export const getTodoById = async (
	{ id, userId }: { id: string; userId: string },
	dbClient: DatabaseClient = db,
) => {
	const todos = await dbClient
		.select()
		.from(todo)
		.where(and(eq(todo.id, id), eq(todo.userId, userId)));
	return todos[0] || null;
};

export const createTodo = async (
	{ userId, ...newTodo }: { userId: string } & CreateTodoSchema,
	dbClient: DatabaseClient = db,
) => {
	const createdTodo = await dbClient
		.insert(todo)
		.values({ userId, ...newTodo })
		.returning();
	return createdTodo[0];
};

export const updateTodo = async (
	{ id, userId, updates }: { id: string; userId: string; updates: Partial<CreateTodoSchema> },
	dbClient: DatabaseClient = db,
) => {
	const updatedTodo = await dbClient
		.update(todo)
		.set({ ...updates, updatedAt: new Date().toISOString() })
		.where(and(eq(todo.id, id), eq(todo.userId, userId)))
		.returning();
	return updatedTodo[0] || null;
};

export const deleteTodo = async (
	{ id, userId }: { id: string; userId: string },
	dbClient: DatabaseClient = db,
) => {
	const deletedTodo = await dbClient
		.delete(todo)
		.where(and(eq(todo.id, id), eq(todo.userId, userId)))
		.returning();
	return deletedTodo[0] || null;
};
