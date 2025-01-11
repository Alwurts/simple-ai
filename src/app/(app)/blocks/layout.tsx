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
				<PageActions>
					<Button asChild size="sm">
						<a href="#blocks">Browse Blocks</a>
					</Button>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper flex-1">{children}</div>
		</>
	);
}
