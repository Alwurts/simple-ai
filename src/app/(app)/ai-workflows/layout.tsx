import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const title = "AI Agent Workflows";
const description =
	"Example implementations of AI Agent Workflows using Vercel AI SDK and React Flow";

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

export default function WorkflowsLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>
					Explore example implementations of AI Workflows using{" "}
					<a
						href="https://sdk.vercel.ai/docs"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Vercel AI SDK
					</a>{" "}
					and{" "}
					<a
						href="https://reactflow.dev/"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						React Flow
					</a>
					.
				</PageHeaderDescription>
				<PageHeaderDescription>
					These workflows demonstrate how to build conversational AI
					agents with flexible workflow orchestration capabilities.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs/workflows">Get More Information</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/docs/workflows/generate-text-node">
							See Workflow Components
						</Link>
					</Button>
				</PageActions>
			</PageHeader>
			{children}
		</>
	);
}
