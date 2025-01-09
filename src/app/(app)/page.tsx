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
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";
import { ComponentPreviewSimple } from "@/components/component-preview-simple";

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
									<Button asChild size="sm" variant="ghost">
										<Link href="/blocks">Browse Blocks</Link>
									</Button>
								</PageActions>
							</div>
							<div className="w-full">
								<Card className="w-full mx-auto flex flex-col h-[500px]">
									<div className="flex-1 flex flex-col min-h-0">
										<ChatMessageArea className="px-4 py-8 space-y-4">
											<ChatMessage id="1">
												<ChatMessageAvatar />
												<ChatMessageContent content="Hi! I'm an AI assistant. I can help you build amazing applications with our UI components." />
											</ChatMessage>
											<ChatMessage id="2" variant="bubble" type="outgoing">
												<ChatMessageContent content="That sounds great! How do I get started?" />
											</ChatMessage>
											<ChatMessage id="3">
												<ChatMessageAvatar />
												<ChatMessageContent content="You can start by checking our documentation or browsing our pre-built blocks. Each component is customizable and easy to integrate." />
											</ChatMessage>
										</ChatMessageArea>
										<div className="border-t p-4">
											<ChatInput variant="default">
												<ChatInputTextArea placeholder="Type a message..." />
												<ChatInputSubmit />
											</ChatInput>
										</div>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="container-wrapper flex-1">
				<div className="container py-12">
					<h2 className="text-2xl font-bold mb-8">Example Components</h2>
					<div className="grid sm:grid-cols-2 gap-6">
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Message</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A composable component that displays a chat message.
							</p>
							<ComponentPreviewSimple name="chat-message-demo" />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Input</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A chat input component that autoresizes to fit the content and
								features a submit button.
							</p>
							<ComponentPreviewSimple name="chat-input-demo" />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Chat Message Area</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A component that adds auto scrolling functionality to a list of
								chat messages
							</p>
							<ComponentPreviewSimple name="chat-message-area-demo" />
						</Card>
						<Card className="p-6">
							<h3 className="font-semibold mb-2">Markdown Content</h3>
							<p className="text-sm text-muted-foreground mb-4">
								A component that renders markdown content.
							</p>
							<ComponentPreviewSimple name="markdown-content-demo" />
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
