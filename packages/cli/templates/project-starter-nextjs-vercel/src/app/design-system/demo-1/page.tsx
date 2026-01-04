import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChatInputArea } from "@/components/chat/parts/chat-input-area";
import { Chat, ChatHeader, ChatHeaderTitle } from "@/components/chat/parts/chat-layout";
import { ChatMessages } from "@/components/chat/parts/chat-messages";
import { DemoContent } from "@/components/demo-content";
import {
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
	AppLayoutResizable,
	AppLayoutResizablePanelPrimary,
	AppLayoutResizablePanelSecondary,
	AppLayoutResizablePanelTrigger,
} from "@/components/layout/app-layout";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export default function LayoutDemo1Page() {
	return (
		<AppLayoutPage>
			<AppLayoutResizable>
				<AppLayoutResizablePanelPrimary id="content-panel" order={1} defaultSize={70} minSize={30}>
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
									<BreadcrumbPage>Layout Demo 1</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<AppLayoutHeaderActions>
							<Button variant="outline" asChild>
								<Link href="/design-system">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to Demos
								</Link>
							</Button>
							<AppLayoutResizablePanelTrigger panelId="chat-panel" />
						</AppLayoutHeaderActions>
					</AppLayoutHeader>

					<DemoContent />
				</AppLayoutResizablePanelPrimary>

				<AppLayoutResizablePanelSecondary
					id="chat-panel"
					order={2}
					defaultSize={30}
					minSize={25}
					defaultOpen={true}
				>
					<Chat id="layout-demo-1-chat" initialMessages={[]}>
						<ChatHeader>
							<ChatHeaderTitle>
								Layout Demo 1: Resizable Panels with Chat in Right Panel
							</ChatHeaderTitle>
						</ChatHeader>
						<ChatMessages />
						<ChatInputArea />
					</Chat>
				</AppLayoutResizablePanelSecondary>
			</AppLayoutResizable>
		</AppLayoutPage>
	);
}
