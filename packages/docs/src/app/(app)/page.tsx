import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BlockPreview } from "@/components/blocks/block-preview";
import { LandingHero } from "@/components/landing/hero";
import { Button } from "@/components/ui/button";

const title = "AI Building Blocks. Build Smarter, Faster.";
const description =
	"An open-source library of AI-focused UI components, app blocks, and React Flow workflows designed to accelerate development. Built with shadcn/UI and Vercel AI SDK.";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					title,
				)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					title,
				)}&description=${encodeURIComponent(description)}`,
			},
		],
	},
};

export default function IndexPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<LandingHero />
			<div className="container-wrapper py-12 md:py-24">
				<div className="container">
					<div className="mb-12 flex items-end justify-between">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tight">
								Agentic Workflows
							</h2>
							<p className="text-muted-foreground text-lg">
								Drag-and-drop flow builders powered by React
								Flow.
							</p>
						</div>
						<Button
							asChild
							variant="ghost"
							className="hidden md:flex"
						>
							<Link href="/ai-workflows">
								View All{" "}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="overflow-hidden rounded-xl border bg-background shadow-sm">
						<BlockPreview name="workflow-01" />
					</div>
				</div>
				<div className="container mt-24">
					<div className="mb-12 flex items-end justify-between">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tight">
								Chat Interfaces
							</h2>
							<p className="text-muted-foreground text-lg">
								Production-ready chat components with tool
								calling support.
							</p>
						</div>
						<Button
							asChild
							variant="ghost"
							className="hidden md:flex"
						>
							<Link href="/blocks/chat">
								View All{" "}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="overflow-hidden rounded-xl border bg-background shadow-sm">
						<BlockPreview name="chat-01" />
					</div>
				</div>
			</div>
		</div>
	);
}
