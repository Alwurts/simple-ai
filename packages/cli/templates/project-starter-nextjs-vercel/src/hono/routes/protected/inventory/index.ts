import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getDashboardMetrics, performStockMovement } from "@/db/services/products";
import type { HonoContextWithAuth } from "@/types/hono";
import { createMovementSchema } from "@/types/products";
import productsRoutes from "./products";
import searchRoutes from "./search";
import warehousesRoutes from "./warehouses";

const inventoryRoutes = new Hono<HonoContextWithAuth>()
	.route("/products", productsRoutes)
	.route("/warehouses", warehousesRoutes)
	.route("/search", searchRoutes)
	.get("/metrics", async (c) => {
		const userId = c.get("user").id;
		const data = await getDashboardMetrics(userId);
		return c.json(data);
	})
	.post("/movements", zValidator("json", createMovementSchema), async (c) => {
		const userId = c.get("user").id;
		const body = c.req.valid("json");

		try {
			const result = await performStockMovement({ ...body, userId });
			return c.json(result);
		} catch (e) {
			return c.json({ error: "Failed to move stock", details: e }, 500);
		}
	});

export default inventoryRoutes;
