import type { Metadata } from "next";
import Link from "next/link";
import { BlocksNav } from "@/components/blocks/blocks-nav";
import { Announcement } from "@/components/general/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { PageNav } from "@/components/layout/page-nav";
import { Button } from "@/components/ui/button";

const title = "Building Blocks for AI";
const description =
	"Beautifully designed. Copy and paste into your apps. Open Source.";

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

export default function BlocksLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<PageHeader>
				<Announcement />
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<a href="#blocks">Browse Blocks</a>
					</Button>
					<Button asChild variant="ghost" size="sm">
						<Link href="/docs/blocks">Add a block</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<PageNav id="blocks">
				<BlocksNav />
				<Button
					asChild
					variant="secondary"
					size="sm"
					className="mr-7 hidden shadow-none lg:flex"
				>
					<Link href="/blocks/sidebar">Browse all blocks</Link>
				</Button>
			</PageNav>
			<div className="container-wrapper section-soft flex-1 md:py-12">
				<div className="container">{children}</div>
			</div>
		</>
	);
}
