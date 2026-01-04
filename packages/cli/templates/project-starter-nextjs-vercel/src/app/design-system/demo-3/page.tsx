import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChatInputArea } from "@/components/chat/parts/chat-input-area";
import { Chat } from "@/components/chat/parts/chat-layout";
import { ChatMessages } from "@/components/chat/parts/chat-messages";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";

export default function LayoutDemo3Page() {
	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<AppBreadcrumbs items={[{ title: "Layout Demo 3: Full Page Chat" }]} />
				<AppLayoutHeaderActions>
					<Button variant="outline" asChild>
						<Link href="/design-system">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Demos
						</Link>
					</Button>
				</AppLayoutHeaderActions>
			</AppLayoutHeader>
			<AppLayoutContent>
				<Chat id="layout-demo-3-chat" initialMessages={[]}>
					{/* <ChatHeader>
						<ChatHeaderTitle>Layout Demo 3: Full Page Chat</ChatHeaderTitle>
					</ChatHeader> */}
					<ChatMessages />
					<ChatInputArea />
				</Chat>
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
