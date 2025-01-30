import type { Metadata } from "next";

import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";

import "@/styles/mdx.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "AI Agents Workflows",
	description:
		"Example implementations of AI Agents using Vercel AI SDK and React Flow",
};

export default function BlocksLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<PageHeader>
				<PageHeaderHeading>AI Agents Workflows</PageHeaderHeading>
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
						<Link href="/docs/react-flow">Get More Information</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/docs/react-flow/components/generate-text-node">
							See React Flow Components
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
