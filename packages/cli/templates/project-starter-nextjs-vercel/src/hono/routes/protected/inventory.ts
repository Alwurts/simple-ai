import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
	createProduct,
	deleteProduct,
	getDashboardMetrics,
	getProduct,
	getProductMovements,
	getProducts,
	performStockMovement,
	updateProduct,
} from "@/db/services/inventory";
import {
	createWarehouse,
	deleteWarehouse,
	getWarehouse,
	getWarehouses,
	updateWarehouse,
} from "@/db/services/warehouses";
import type { HonoContextWithAuth } from "@/types/hono";
import {
	createMovementSchema,
	createProductSchema,
	createWarehouseSchema,
	updateProductSchema,
	updateWarehouseSchema,
} from "@/types/inventory";

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

	// Delete Product
	.delete("/products/:id", async (c) => {
		const userId = c.get("user").id;
		const productId = c.req.param("id");
		const result = await deleteProduct(productId, userId);
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
	})

	// --- Warehouses ---

	// List Warehouses
	.get("/warehouses", async (c) => {
		const userId = c.get("user").id;
		const data = await getWarehouses(userId);
		return c.json(data);
	})

	// Get Single Warehouse
	.get("/warehouses/:id", async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const data = await getWarehouse(id, userId);
		if (!data) {
			return c.json({ error: "Warehouse not found" }, 404);
		}
		return c.json(data);
	})

	// Create Warehouse
	.post("/warehouses", zValidator("json", createWarehouseSchema), async (c) => {
		const userId = c.get("user").id;
		const body = c.req.valid("json");
		const result = await createWarehouse({
			...body,
			userId,
		});
		return c.json(result[0]);
	})

	// Update Warehouse
	.put("/warehouses/:id", zValidator("json", updateWarehouseSchema), async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const body = c.req.valid("json");
		const result = await updateWarehouse(id, userId, body);
		return c.json(result);
	})

	// Delete Warehouse
	.delete("/warehouses/:id", async (c) => {
		const userId = c.get("user").id;
		const id = c.req.param("id");
		const result = await deleteWarehouse(id, userId);
		return c.json(result);
	});

export default inventoryRoutes;
