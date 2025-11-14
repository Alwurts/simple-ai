import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const todo = pgTable("todo", (t) => ({
	id: t.uuid("id").primaryKey().defaultRandom(),
	title: t.text("title").notNull(),
	description: t.text("description"),
	completed: t.boolean("completed").default(false).notNull(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
}));
