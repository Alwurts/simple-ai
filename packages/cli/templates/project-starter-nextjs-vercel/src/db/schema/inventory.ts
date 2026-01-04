import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const movementTypeEnum = pgEnum("movement_type", ["IN", "OUT", "TRANSFER", "ADJUSTMENT"]);

export const warehouses = pgTable("warehouses", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	location: text("location"),
	isDefault: boolean("is_default").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const products = pgTable("products", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	sku: text("sku").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	price: decimal("price", { precision: 10, scale: 2 }).default("0"),
	cost: decimal("cost", { precision: 10, scale: 2 }).default("0"),
	minStockLevel: integer("min_stock_level").default(5), // For alerts
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const stockLevels = pgTable("stock_levels", {
	id: uuid("id").primaryKey().defaultRandom(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	warehouseId: uuid("warehouse_id")
		.notNull()
		.references(() => warehouses.id, { onDelete: "cascade" }),
	quantity: integer("quantity").default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const movements = pgTable("movements", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id),
	fromWarehouseId: uuid("from_warehouse_id").references(() => warehouses.id),
	toWarehouseId: uuid("to_warehouse_id").references(() => warehouses.id),
	type: movementTypeEnum("type").notNull(),
	quantity: integer("quantity").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
	stockLevels: many(stockLevels),
	movements: many(movements),
}));

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
	product: one(products, { fields: [stockLevels.productId], references: [products.id] }),
	warehouse: one(warehouses, { fields: [stockLevels.warehouseId], references: [warehouses.id] }),
}));
