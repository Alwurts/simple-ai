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

const title = "AI Agent Builder";
const description = "Build AI Agents using Vercel AI SDK and React Flow";

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

export default function BlocksLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>
					Explore example implementations of AI Agents using{" "}
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
					These workflows are inspired by{" "}
					<a
						href="https://www.anthropic.com/research/building-effective-agents"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Anthropic's article
					</a>{" "}
					on building effective agents.
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
				{/* <PageHeaderDescription>
					Each workflow below is fully customizable and copy-paste ready. Simply
					use our CLI or copy the code directly to integrate these patterns into
					your project. All components are built with TypeScript and follow best
					practices for AI application development.
				</PageHeaderDescription> */}
			</PageHeader>
			{children}
		</>
	);
}
