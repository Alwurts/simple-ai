import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { chats, messages } from "@/db/schema/chat";
import { dbMessagesToAIMessages } from "@/lib/chat-utils";
import type { AIUIMessage } from "@/types/ai";
import type { DBChat } from "@/types/chat";

export async function createChat({
	id,
	userId,
	title,
	message,
}: {
	id: string;
	userId: string;
	title: string;
	message: AIUIMessage;
}): Promise<string> {
	return await db.transaction(async (tx) => {
		const [result] = await tx.insert(chats).values({ id, userId, title }).returning();
		await tx.insert(messages).values({
			id: message.id,
			userId,
			chatId: result.id,
			role: message.role,
			parts: message.parts,
			metadata: message.metadata ?? {
				createdAt: new Date().toISOString(),
				status: "success",
			},
		});
		return result.id;
	});
}

export async function getChatMessages(chatId: string): Promise<AIUIMessage[] | null> {
	const chat = await db.query.chats.findFirst({
		where: eq(chats.id, chatId),
	});

	if (!chat) {
		return null;
	}
	const result = await db.query.messages.findMany({
		where: eq(messages.chatId, chatId),
		orderBy: messages.createdAt,
	});
	return dbMessagesToAIMessages(result);
}

export async function getChat(chatId: string): Promise<DBChat | null> {
	const result = await db.query.chats.findFirst({
		where: eq(chats.id, chatId),
	});
	if (!result) {
		return null;
	}
	return result;
}

export async function getChats(
	userId: string,
	options?: { sort?: "asc" | "desc" },
): Promise<DBChat[]> {
	const { sort = "desc" } = options || {};
	const orderBy = sort === "asc" ? asc(chats.createdAt) : desc(chats.createdAt);
	const result = await db.query.chats.findMany({
		where: eq(chats.userId, userId),
		orderBy,
	});
	return result;
}

export async function addMessageToChat({
	chatId,
	message,
	userId,
}: {
	chatId: string;
	message: AIUIMessage;
	userId: string;
}): Promise<void> {
	await db.insert(messages).values({
		id: message.id,
		chatId,
		userId,
		role: message.role,
		parts: message.parts,
		metadata: message.metadata,
	});
}

export async function upsertMessageToChat({
	chatId,
	message,
	userId,
}: {
	chatId: string;
	message: AIUIMessage;
	userId: string;
}): Promise<void> {
	console.log("upsertMessageToChat", chatId, message.id, userId);
	const metadata = message.metadata ?? {
		createdAt: new Date().toISOString(),
		status: "success",
	};
	await db
		.insert(messages)
		.values({
			id: message.id,
			chatId,
			userId,
			role: message.role,
			parts: message.parts,
			metadata,
		})
		.onConflictDoUpdate({
			target: messages.id,
			set: {
				role: message.role,
				parts: message.parts,
				metadata,
			},
		});
}
