import { Hono } from "hono";
import { addMessageToChat, createChat, getChat, getChatMessages } from "@/db/services/chat";
import { agentRespond } from "@/lib/ai/agents/agent-respond";
import { generateChatTitle } from "@/lib/ai/title-generator";
import type { AIUIMessage } from "@/types/ai";
import type { HonoContextWithAuth } from "@/types/hono";

const chatRoutes = new Hono<HonoContextWithAuth>().post("/", async (c) => {
	const { newMessage, chatId } = (await c.req.json()) as {
		newMessage: AIUIMessage;
		chatId: string;
	};
	const abortSignal = c.req.raw.signal;

	const userId = c.get("user").id;

	const savedChat = await getChat(chatId);

	if (!savedChat) {
		const messageFirstPartText = newMessage.parts.find((p) => p.type === "text");

		const title = await generateChatTitle(messageFirstPartText?.text ?? "");
		const newChatId = await createChat({
			id: chatId,
			userId,
			title,
			message: newMessage,
		});
		return agentRespond({
			messages: [newMessage],
			onNewMessage: async (message) => {
				await addMessageToChat({
					chatId: newChatId,
					message,
				});
			},
			abortSignal,
		});
	}

	if (savedChat.userId !== userId) {
		throw new Error("Unauthorized");
	}

	const messagesToProcess = await getChatMessages(chatId);

	if (!messagesToProcess) {
		throw new Error("Chat messages not found");
	}

	// TODO: For approval we need to handle the message already exists in the chat

	return agentRespond({
		messages: messagesToProcess,
		onNewMessage: async (message) => {
			await addMessageToChat({
				chatId,
				message,
			});
		},
		abortSignal,
	});
});

export default chatRoutes;
