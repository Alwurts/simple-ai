import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createProduct,
	getDashboardMetrics,
	getProduct,
	getProductMovements,
	getProducts,
	performStockMovement,
	updateProduct,
} from "@/db/services/inventory";
import type { HonoContextWithAuth } from "@/types/hono";
import { createMovementSchema, createProductSchema, updateProductSchema } from "@/types/inventory";

const inventoryRoutes = new Hono<HonoContextWithAuth>()

	// Get Dashboard Data
	.get("/products", async (c) => {
		const userId = c.get("user").id;
		const data = await getProducts(userId);
		return c.json(data);
	})

	// Get Single Product
	.get("/products/:id", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const data = await getProduct(productId, userId);
		if (!data) {
			return c.json({ error: "Product not found" }, 404);
		}
		return c.json(data);
	})

	// Get Dashboard Metrics (Charts)
	.get("/metrics", async (c) => {
		const userId = c.get("user").id;
		const data = await getDashboardMetrics(userId);
		return c.json(data);
	})

	// Get Product Movements
	.get("/products/:id/movements", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const data = await getProductMovements(productId, userId);
		return c.json(data);
	})

	// Create Product
	.post("/products", zValidator("json", createProductSchema), async (c) => {
		const userId = c.get("user").id;
		const body = c.req.valid("json");
		const result = await createProduct({
			...body,
			userId,
			price: body.price?.toString(),
		});
		return c.json(result[0]);
	})

	// Update Product
	.put("/products/:id", zValidator("json", updateProductSchema), async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const body = c.req.valid("json");
		const result = await updateProduct(productId, userId, {
			...body,
			price: body.price?.toString(),
		});
		return c.json(result);
	})

	// Execute Stock Movement (Receive, Transfer, Adjust)
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
