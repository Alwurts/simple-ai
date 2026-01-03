import { eq } from "drizzle-orm";
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
			chatId: result.id,
			role: message.role,
			parts: message.parts,
			metadata: message.metadata,
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

export async function getChats(userId: string): Promise<DBChat[]> {
	const result = await db.query.chats.findMany({
		where: eq(chats.userId, userId),
	});
	return result;
}

export async function addMessageToChat({
	chatId,
	message,
}: {
	chatId: string;
	message: AIUIMessage;
}): Promise<void> {
	return await db.transaction(async (tx) => {
		await tx.insert(messages).values({
			id: message.id,
			chatId,
			role: message.role,
			parts: message.parts,
			metadata: message.metadata,
		});
	});
}
