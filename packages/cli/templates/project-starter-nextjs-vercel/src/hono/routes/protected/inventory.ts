import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
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
	.post(
		"/products",
		zValidator(
			"json",
			z.object({
				name: z.string(),
				sku: z.string(),
				price: z.coerce.number().optional(),
				description: z.string().optional(),
				minStockLevel: z.coerce.number().optional(),
			}),
		),
		async (c) => {
			const userId = c.get("user").id;
			const body = c.req.valid("json");
			const result = await createProduct({
				...body,
				userId,
				price: body.price?.toString(),
			});
			return c.json(result[0]);
		},
	)

	// Update Product
	.put(
		"/products/:id",
		zValidator(
			"json",
			z.object({
				name: z.string().optional(),
				sku: z.string().optional(),
				price: z.coerce.number().optional(),
				description: z.string().optional(),
				minStockLevel: z.coerce.number().optional(),
			}),
		),
		async (c) => {
			const userId = c.get("user").id;
			const productId = c.req.param("id");
			const body = c.req.valid("json");
			const result = await updateProduct(productId, userId, {
				...body,
				price: body.price?.toString(),
			});
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
