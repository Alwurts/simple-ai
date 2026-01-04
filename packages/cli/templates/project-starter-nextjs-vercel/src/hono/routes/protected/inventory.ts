import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createProduct, getProducts, performStockMovement } from "@/db/services/inventory";
import type { HonoContextWithAuth } from "@/types/hono";

const inventoryRoutes = new Hono<HonoContextWithAuth>()

	// Get Dashboard Data
	.get("/products", async (c) => {
		const userId = c.get("user").id;
		const data = await getProducts(userId);
		return c.json(data);
	})

	// Create Product
	.post(
		"/products",
		zValidator(
			"json",
			z.object({
				name: z.string(),
				sku: z.string(),
				price: z.number().optional(),
			}),
		),
		async (c) => {
			const userId = c.get("user").id;
			const body = c.req.valid("json");
			const result = await createProduct({ ...body, userId, price: body.price?.toString() });
			return c.json(result);
		},
	)

	// Execute Stock Movement (Receive, Transfer, Adjust)
	.post(
		"/movements",
		zValidator(
			"json",
			z.object({
				productId: z.string(),
				type: z.enum(["IN", "OUT", "TRANSFER", "ADJUSTMENT"]),
				quantity: z.number(),
				fromWarehouseId: z.string().optional(),
				toWarehouseId: z.string().optional(),
				notes: z.string().optional(),
			}),
		),
		async (c) => {
			const userId = c.get("user").id;
			const body = c.req.valid("json");

			try {
				const result = await performStockMovement({ ...body, userId });
				return c.json(result);
			} catch (e) {
				return c.json({ error: "Failed to move stock", details: e }, 500);
			}
		},
	);

export default inventoryRoutes;
