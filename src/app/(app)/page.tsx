"use client";

import Link from "next/link";

import { Announcement } from "@/components/announcement";
import {
	PageActions,
	PageHeaderHeading,
	PageHeaderDescription,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ComponentPreviewSimple } from "@/components/component-preview-simple";
import { ComponentPreview } from "@/components/component-preview";

export default function HomePage() {
	return (
		<>
			<section className="border-grid border-b">
				<div className="container-wrapper">
					<div className="container py-8 md:py-10 lg:py-12">
						<div className="grid lg:grid-cols-2 gap-8 items-start">
							<div className="flex flex-col items-start gap-1">
								<Announcement />
								<PageHeaderHeading>
									Easily build AI Powered Applications
								</PageHeaderHeading>
								<PageHeaderDescription>
									AI UI components that you can copy and paste into your apps.
									Customizable. Open Source.
								</PageHeaderDescription>
								<PageActions>
									<Button asChild size="sm">
										<Link href="/docs">Get Started</Link>
									</Button>
									{/* <Button asChild size="sm" variant="ghost">
										<Link href="/blocks">Browse Blocks</Link>
									</Button> */}
								</PageActions>
							</div>
							<ComponentPreviewSimple name="chat-demo" />
						</div>
					</div>
				</div>
			</section>
			<div className="container-wrapper flex-1">
				<div className="container py-12">
					<h2 className="text-2xl font-bold mb-8">Components</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Message</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A composable component that displays a chat message.
							</p>
							<ComponentPreview name="chat-message-demo" hideCode />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Input</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A chat input component that autoresizes to fit the content and
								features a submit button.
							</p>
							<ComponentPreview name="chat-input-demo" hideCode />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Message Area</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A component that adds auto scrolling functionality to a list of
								chat messages
							</p>
							<ComponentPreview name="chat-message-area-demo" hideCode />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Markdown Content</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A component that renders markdown content.
							</p>
							<ComponentPreview name="markdown-content-demo" hideCode />
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
