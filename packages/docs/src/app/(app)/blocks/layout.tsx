import type { Metadata } from "next";
import Link from "next/link";
import { BlocksNav } from "@/components/blocks/blocks-nav";
import { Announcement } from "@/components/general/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
	PageHeaderPrimaryButton,
	PageHeaderSecondaryButton,
} from "@/components/layout/page-header";
import { PageNav } from "@/components/layout/page-nav";

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
					<PageHeaderPrimaryButton asChild>
						<a href="#blocks">Browse Blocks</a>
					</PageHeaderPrimaryButton>
					<PageHeaderSecondaryButton asChild>
						<Link href="/docs/blocks">See docs</Link>
					</PageHeaderSecondaryButton>
				</PageActions>
			</PageHeader>
			<PageNav id="blocks">
				<BlocksNav />
				<PageHeaderSecondaryButton
					asChild
					className="mr-7 hidden shadow-none lg:flex"
				>
					<Link href="/blocks/chat">Browse all blocks</Link>
				</PageHeaderSecondaryButton>
			</PageNav>
			<div className="container-wrapper section-soft flex-1 md:py-6">
				<div className="container">{children}</div>
			</div>
		</>
	);
}
