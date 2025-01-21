import type { Metadata } from "next";

import { Announcement } from "@/components/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

import "@/styles/mdx.css";
import { BlocksNav } from "@/components/blocks/blocks-nav";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Building Blocks for AI.",
	description:
		"Beautifully designed. Copy and paste into your apps. Open Source.",
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
				<PageHeaderHeading>Building Blocks for AI</PageHeaderHeading>
				<PageHeaderDescription>
					Building blocks for AI. Copy and paste into your apps. Works with all
					React frameworks. Open Source..
				</PageHeaderDescription>
				<PageHeaderDescription>
					All of our blocks use the Vercel AI SDK, click{" "}
					<Link href="/docs/blocks" className="underline">
						here
					</Link>{" "}
					for more details.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<a href="/docs/blocks">See Docs</a>
					</Button>
				</PageActions>
			</PageHeader>
			<div id="blocks" className="border-grid scroll-mt-24 border-b">
				<div className="container-wrapper">
					<div className="container flex items-center py-4">
						<BlocksNav />
					</div>
				</div>
			</div>
			<div className="container-wrapper flex-1">{children}</div>
		</>
	);
}
