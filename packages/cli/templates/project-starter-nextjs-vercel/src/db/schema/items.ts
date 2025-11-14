import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const item = pgTable("item", (t) => ({
	id: t.uuid("id").primaryKey().defaultRandom(),
	name: t.text("name").notNull(),
	description: t.text("description"),
	status: t.text("status").default("active").notNull(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
}));
