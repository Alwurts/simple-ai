import Link from "next/link";

import { Announcement } from "@/components/announcement";
import {
	PageActions,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { ComponentPreview } from "@/components/component-preview";
import { ComponentPreviewSimple } from "@/components/component-preview-simple";

export default function HomePage() {
	return (
		<>
			<section className="border-grid border-b">
				<div className="container-wrapper">
					<div className="container py-8 md:py-10 lg:py-12">
						<div className="grid lg:grid-cols-2 gap-8 items-start">
							<div className="flex flex-col items-start gap-2">
								<Announcement />
								<PageHeaderHeading>
									Copy-Paste AI Components. Build Smarter, Faster.
								</PageHeaderHeading>
								<PageHeaderDescription>
									An open-source library of AI-focused UI components, app
									blocks, and React Flow workflows designed to accelerate
									development. Built with shadcn/UI and Vercel AI SDK.
								</PageHeaderDescription>
								<PageActions>
									<Button asChild size="lg">
										<Link href="/docs">Get Started</Link>
									</Button>
									<Button asChild size="lg" variant="outline">
										<Link href="/blocks">Browse Examples</Link>
									</Button>
								</PageActions>
							</div>
							<ComponentPreviewSimple name="chat-demo" />
						</div>
					</div>
				</div>
			</section>
			<div className="container-wrapper flex-1">
				<div className="container py-12 space-y-16">
					{/* React Flow Components Section */}
					<div>
						<div className="flex flex-col gap-2 mb-8">
							<h2 className="text-3xl font-bold">React Flow AI Components</h2>
							<p className="text-muted-foreground">
								Drag-and-drop AI nodes to build no-code workflows powered by
								React Flow
							</p>
						</div>
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="p-6 overflow-hidden">
								<h3 className="font-semibold mb-2">Generate Text Node</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Generate text using LLMs with built-in streaming and error
									handling.
								</p>
								<div className="w-full overflow-hidden">
									<ComponentPreview name="generate-text-node-demo" hideCode />
								</div>
							</Card>
							<Card className="p-6 overflow-hidden">
								<h3 className="font-semibold mb-2">Prompt Crafter Node</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Create dynamic prompts with variables and templating support.
								</p>
								<div className="w-full overflow-hidden">
									<ComponentPreview name="prompt-crafter-node-demo" hideCode />
								</div>
							</Card>
							<Card className="p-6 overflow-hidden">
								<h3 className="font-semibold mb-2">Text Input Node</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Collect and validate user input within your AI workflows.
								</p>
								<div className="w-full overflow-hidden">
									<ComponentPreview name="text-input-node-demo" hideCode />
								</div>
							</Card>
							<Card className="p-6 overflow-hidden">
								<h3 className="font-semibold mb-2">Visualize Text Node</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Display and format text output with markdown support.
								</p>
								<div className="w-full overflow-hidden">
									<ComponentPreview name="visualize-text-node-demo" hideCode />
								</div>
							</Card>
						</div>
					</div>

					{/* AI Components Section */}
					<div>
						<div className="flex flex-col gap-2 mb-8">
							<h2 className="text-3xl font-bold">AI-Ready Components</h2>
							<p className="text-muted-foreground">
								Pre-styled React components optimized for AI applications
							</p>
						</div>
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="p-6">
								<h3 className="font-semibold mb-2">Chat Message</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Polished chat messages with support for avatars, markdown, and
									code blocks.
								</p>
								<ComponentPreview
									name="chat-message-demo-avatar-image"
									hideCode
								/>
							</Card>
							<Card className="p-6">
								<h3 className="font-semibold mb-2">Chat Input</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Auto-resizing chat input with streaming state management.
								</p>
								<ComponentPreview name="chat-input-demo" hideCode />
							</Card>
							<Card className="p-6">
								<h3 className="font-semibold mb-2">Chat Message Area</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Smart message container with auto-scroll and virtual list
									support.
								</p>
								<ComponentPreview name="chat-message-area-demo" hideCode />
							</Card>
							<Card className="p-6">
								<h3 className="font-semibold mb-2">Markdown Content</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Rich markdown rendering with syntax highlighting and LaTeX
									support.
								</p>
								<ComponentPreview name="markdown-content-demo" hideCode />
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
