import { pgTable } from "drizzle-orm/pg-core";
import type { AIUIMessage } from "@/types/ai";
import { user } from "./auth";

export const chats = pgTable("chats", (t) => ({
	id: t.text("id").primaryKey(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: t.text("title").default("New chat").notNull(),
	createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
}));

export const messages = pgTable("messages", (t) => ({
	id: t.text("id").primaryKey(),
	chatId: t
		.text("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	role: t.jsonb("data").$type<AIUIMessage["role"]>().notNull(),
	parts: t.jsonb("parts").$type<AIUIMessage["parts"]>().notNull(),
	metadata: t.jsonb("metadata").$type<AIUIMessage["metadata"]>().notNull(),
	createdAt: t.timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
}));
