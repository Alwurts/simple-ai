import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createWarehouse,
	deleteWarehouse,
	getWarehouse,
	getWarehouses,
	updateWarehouse,
} from "@/db/services/warehouses";
import type { HonoContextWithAuth } from "@/types/hono";
import { createWarehouseSchema, updateWarehouseSchema } from "@/types/warehouses";

const warehousesRoutes = new Hono<HonoContextWithAuth>()
	// List Warehouses
	.get("/", async (c) => {
		const userId = c.get("user").id;
		const data = await getWarehouses(userId);
		return c.json(data);
	})

	// Get Single Warehouse
	.get("/:id", async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const data = await getWarehouse(id, userId);
		if (!data) {
			return c.json({ error: "Warehouse not found" }, 404);
		}
		return c.json(data);
	})

	// Create Warehouse
	.post("/", zValidator("json", createWarehouseSchema), async (c) => {
		const userId = c.get("user").id;
		const body = c.req.valid("json");
		const result = await createWarehouse({
			...body,
			userId,
		});
		return c.json(result[0]);
	})

	// Update Warehouse
	.put("/:id", zValidator("json", updateWarehouseSchema), async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const result = await updateWarehouse(id, userId, body);
		return c.json(result);
	})

	// Delete Warehouse
	.delete("/:id", async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const result = await deleteWarehouse(id, userId);
		return c.json(result);
	});

export default warehousesRoutes;
