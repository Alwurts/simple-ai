import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { warehouses } from "@/db/schema/warehouses";
import type { SearchResult } from "@/types/search";

export const searchInventory = async (userId: string, query: string): Promise<SearchResult[]> => {
	const searchPattern = `%${query}%`;

	// 1. Search Products
	const productResults = await db
		.select({
			id: products.id,
			name: products.name,
			sku: products.sku,
			description: products.description,
		})
		.from(products)
		.where(
			and(
				eq(products.userId, userId),
				or(ilike(products.name, searchPattern), ilike(products.sku, searchPattern)),
			),
		)
		.limit(10);

	// 2. Search Warehouses
	const warehouseResults = await db
		.select({
			id: warehouses.id,
			name: warehouses.name,
			location: warehouses.location,
		})
		.from(warehouses)
		.where(and(eq(warehouses.userId, userId), ilike(warehouses.name, searchPattern)))
		.limit(10);

	// 3. Combine and Format
	const results: SearchResult[] = [
		...productResults.map((p) => ({
			path: `/inventory/products/${p.id}`,
			snippet: p.description || `Product SKU: ${p.sku}`,
			score: 1.0, // Basic scoring for now
			metadata: {
				type: "product" as const,
				id: p.id,
				title: p.name,
				sku: p.sku,
			},
		})),
		...warehouseResults.map((w) => ({
			path: `/inventory/warehouses/${w.id}`,
			snippet: w.location || "Warehouse location not specified",
			score: 0.9, // Slightly lower score for warehouses if we want to prioritize products
			metadata: {
				type: "warehouse" as const,
				id: w.id,
				title: w.name,
				location: w.location,
			},
		})),
	];

	return results.sort((a, b) => b.score - a.score);
};
