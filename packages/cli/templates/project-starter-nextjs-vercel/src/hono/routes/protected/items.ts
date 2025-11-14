import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createItem, deleteItem, getItemById, getItems, updateItem } from "@/db/services/items";
import type { HonoContextWithAuth } from "@/types/hono";
import { createItemSchema, updateItemSchema } from "@/types/items";

const itemsRoutes = new Hono<HonoContextWithAuth>()
	.get("/", async (c) => {
		try {
			const userId = c.get("user").id;
			const items = await getItems({ userId });
			return c.json(items);
		} catch (error) {
			console.error("Get items error:", error);
			return c.json({ error: "Failed to fetch items" }, 500);
		}
	})
	.get("/:itemId", async (c) => {
		const itemId = c.req.param("itemId");
		const userId = c.get("user").id;
		const item = await getItemById({ id: itemId, userId });
		if (!item) {
			return c.json({ error: "Item not found" }, 404);
		}
		return c.json(item);
	})
	.post("/", zValidator("json", createItemSchema), async (c) => {
		const { name, description, status } = c.req.valid("json");
		const userId = c.get("user").id;
		const newItem = await createItem({
			name,
			description,
			status,
			userId,
		});
		return c.json(newItem);
	})
	.put("/:itemId", zValidator("json", updateItemSchema), async (c) => {
		const itemId = c.req.param("itemId");
		const userId = c.get("user").id;
		const updates = c.req.valid("json");
		const updatedItem = await updateItem({ id: itemId, userId, updates });
		if (!updatedItem) {
			return c.json({ error: "Item not found" }, 404);
		}
		return c.json(updatedItem);
	})
	.delete("/:itemId", async (c) => {
		const itemId = c.req.param("itemId");
		const userId = c.get("user").id;
		const deletedItem = await deleteItem({ id: itemId, userId });
		if (!deletedItem) {
			return c.json({ error: "Item not found" }, 404);
		}
		return c.json({ message: "Item deleted successfully" });
	});

export default itemsRoutes;
