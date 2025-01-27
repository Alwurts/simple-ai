import type { Metadata } from "next";

import { Announcement } from "@/components/announcement";
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
				<Announcement />
				<PageHeaderHeading>AI Agents Workflows</PageHeaderHeading>
				<PageHeaderDescription>
					Explore example implementations of AI Agents using Vercel AI SDK and
					React Flow. These workflows are inspired by Anthropic's research on
					building effective agents.
				</PageHeaderDescription>
				<PageHeaderDescription>
					For deeper reference and more information, check out the{" "}
					<a
						href="https://www.anthropic.com/research/building-effective-agents"
						className="underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Anthropic article
					</a>
					.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs">Get More Information</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/blocks">See Flow Components</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper flex-1">{children}</div>
		</>
	);
}
