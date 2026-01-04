import type { movements, products, stockLevels, warehouses } from "@/db/schema/inventory";

export type DBWarehouse = typeof warehouses.$inferSelect;
export type DBProduct = typeof products.$inferSelect;
export type DBStockLevel = typeof stockLevels.$inferSelect;
export type DBMovement = typeof movements.$inferSelect;

// Extended types for API responses
export type ProductWithStock = DBProduct & {
	totalStock: number;
};
