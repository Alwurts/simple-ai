import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "@/db/services/todos";
import type { HonoContextWithAuth } from "@/types/hono";
import { createTodoSchema, updateTodoSchema } from "@/types/todos";

const todosRoutes = new Hono<HonoContextWithAuth>()
	.get("/", async (c) => {
		try {
			const userId = c.get("user").id;
			const todos = await getTodos({ userId });
			return c.json(todos);
		} catch (error) {
			console.error("Get todos error:", error);
			return c.json({ error: "Failed to fetch todos" }, 500);
		}
	})
	.get("/:todoId", async (c) => {
		const todoId = c.req.param("todoId");
		const userId = c.get("user").id;
		const todo = await getTodoById({ id: todoId, userId });
		if (!todo) {
			return c.json({ error: "Todo not found" }, 404);
		}
		return c.json(todo);
	})
	.post("/", zValidator("json", createTodoSchema), async (c) => {
		const { title, description, completed } = c.req.valid("json");
		const userId = c.get("user").id;
		const newTodo = await createTodo({
			title,
			description,
			completed,
			userId,
		});
		return c.json(newTodo);
	})
	.put("/:todoId", zValidator("json", updateTodoSchema), async (c) => {
		const todoId = c.req.param("todoId");
		const userId = c.get("user").id;
		const updates = c.req.valid("json");
		const updatedTodo = await updateTodo({ id: todoId, userId, updates });
		if (!updatedTodo) {
			return c.json({ error: "Todo not found" }, 404);
		}
		return c.json(updatedTodo);
	})
	.delete("/:todoId", async (c) => {
		const todoId = c.req.param("todoId");
		const userId = c.get("user").id;
		const deletedTodo = await deleteTodo({ id: todoId, userId });
		if (!deletedTodo) {
			return c.json({ error: "Todo not found" }, 404);
		}
		return c.json({ message: "Todo deleted successfully" });
	});

export default todosRoutes;
