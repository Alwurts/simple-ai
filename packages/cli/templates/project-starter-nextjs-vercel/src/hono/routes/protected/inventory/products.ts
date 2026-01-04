import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProductMovements,
	getProducts,
	updateProduct,
} from "@/db/services/products";
import type { HonoContextWithAuth } from "@/types/hono";
import { createProductSchema, updateProductSchema } from "@/types/products";

const productsRoutes = new Hono<HonoContextWithAuth>()
	// Get Products
	.get("/", async (c) => {
		const userId = c.get("user").id;
		const data = await getProducts(userId);
		return c.json(data);
	})

	// Get Single Product
	.get("/:id", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const data = await getProduct(productId, userId);
		if (!data) {
			return c.json({ error: "Product not found" }, 404);
		}
		return c.json(data);
	})

	// Get Product Movements
	.get("/:id/movements", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const data = await getProductMovements(productId, userId);
		return c.json(data);
	})

	// Create Product
	.post("/", zValidator("json", createProductSchema), async (c) => {
		const userId = c.get("user").id;
		const body = c.req.valid("json");
		const result = await createProduct({
			...body,
			userId,
		});

		return c.json(result[0]);
	})

	// Update Product
	.put("/:id", zValidator("json", updateProductSchema), async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const body = c.req.valid("json");
		const result = await updateProduct(productId, userId, body);

		return c.json(result);
	})

	// Delete Product
	.delete("/:id", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const result = await deleteProduct(productId, userId);
		return c.json(result);
	});

export default productsRoutes;
