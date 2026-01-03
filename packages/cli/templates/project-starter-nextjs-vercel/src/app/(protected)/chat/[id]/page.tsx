import Link from "next/link";
import { ChatFull } from "@/components/chat/chat-full";
import { AppLayoutContent, AppLayoutHeader, AppLayoutPage } from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Layout Demo 3: Full Page Chat</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</AppLayoutHeader>
			<AppLayoutContent>
				<ChatFull id={id} initialMessages={initialMessages} />
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
