import type { Metadata } from "next";
import Link from "next/link";
import { BlockPreview } from "@/components/blocks/block-preview";
import { Announcement } from "@/components/general/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { PageNav, PageNavTitle } from "@/components/layout/page-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
		<div className="flex flex-1 flex-col">
			<PageHeader>
				<Announcement />
				<PageHeaderHeading className="max-w-4xl">
					{title}
				</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs/installation">Get Started</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/blocks">View Blocks</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper md:px-10">
				<Separator className="md:mb-6" />
			</div>
			<PageNav>
				<PageNavTitle>Agentic Builder</PageNavTitle>
			</PageNav>
			<div className="container-wrapper">
				<div className="container flex flex-col gap-4">
					<BlockPreview name="workflow-01" />
				</div>
			</div>
			<div className="container-wrapper md:px-10">
				<Separator className="mt-8 md:mt-12 mb-0" />
			</div>
			<PageNav>
				<PageNavTitle>Agentic Chat</PageNavTitle>
			</PageNav>
			<div className="container-wrapper">
				<div className="container flex flex-col gap-4">
					<BlockPreview name="chat-01" />
				</div>
			</div>
		</div>
	);
}
