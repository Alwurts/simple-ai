import { ChatHistoryWithNavigation } from "@/components/chat/chat-history-with-navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import { getChat, getChatMessages } from "@/db/services/chat";
import type { AIUIMessage } from "@/types/ai";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const savedChat = await getChat(id);

	let initialMessages: AIUIMessage[] = [];

	if (savedChat) {
		const messages = await getChatMessages(id);
		if (messages) {
			initialMessages = messages;
		}
	}

	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<AppBreadcrumbs items={[{ title: `Chat ${id}` }]} />
				<AppLayoutHeaderActions>
					<ChatHistoryWithNavigation currentChatId={id} />
				</AppLayoutHeaderActions>
			</AppLayoutHeader>
			<AppLayoutContent>
				<ChatInterface id={id} initialMessages={initialMessages} />
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
