"use client";

import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SidePanelChat } from "@/components/chat/chat-floating-panel";
import { DemoContent } from "@/components/demo-content";
import { AppBreadcrumbs } from "@/components/layout/app-breadcrumbs";
import {
	AppLayoutContent,
	AppLayoutHeader,
	AppLayoutHeaderActions,
	AppLayoutPage,
} from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";

export default function LayoutDemo2Page() {
	const [open, setOpen] = useState(false);
	return (
		<AppLayoutPage>
			<AppLayoutHeader>
				<AppBreadcrumbs items={[{ title: "Layout Demo 2" }]} />
				<AppLayoutHeaderActions>
					<Button variant="outline" asChild>
						<Link href="/design-system">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Demos
						</Link>
					</Button>
					<Button size="icon" onClick={() => setOpen((open) => !open)}>
						<MessageSquare className="h-4 w-4" />
					</Button>
				</AppLayoutHeaderActions>
			</AppLayoutHeader>
			<AppLayoutContent>
				<SidePanelChat id="layout-demo-2-chat" open={open} onOpenChange={setOpen} />

				<DemoContent />
			</AppLayoutContent>
		</AppLayoutPage>
	);
}
