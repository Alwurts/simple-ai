import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChatMain } from "@/components/chat/chat-main";
import {
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
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

export default function LayoutDemo3Page() {
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
				<AppLayoutHeaderActions>
					<Button variant="outline" asChild>
						<Link href="/layout">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Demos
						</Link>
					</Button>
				</AppLayoutHeaderActions>
			</AppLayoutHeader>
			<AppLayoutContent>
				<ChatMain id="layout-demo-3-chat" />
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
