import { ChatMain } from "@/registry/blocks/chat-01/components/chat/chat-main";
import { AppLayout } from "@/registry/blocks/chat-01/components/layout/app-layout";

export default function Page() {
	return (
		<AppLayout sidebarChildren={null}>
			<ChatMain />
		</AppLayout>
	);
}
