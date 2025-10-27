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

const title = "AI Agent Workflowr";
const description =
	"Build powerful AI agent workflows with React Flow components integrated with Vercel AI SDK";

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
					Build sophisticated AI agent workflows using an interactive visual
					interface powered by{" "}
					<a
						href="https://reactflow.dev/"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						React Flow
					</a>{" "}
					and deeply integrated with the{" "}
					<a
						href="https://ai-sdk.dev/docs/introduction"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Vercel AI SDK
					</a>
					.
				</PageHeaderDescription>
				<PageHeaderDescription>
					Create linear, branching, and conditional workflows with real-time
					streaming and state management. Switch between templates to explore
					different workflow patterns.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs/workflows">Get More Information</Link>
					</Button>
				</PageActions>
			</PageHeader>
			{children}
		</>
	);
}
