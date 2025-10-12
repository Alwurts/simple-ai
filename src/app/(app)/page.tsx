import type { Metadata } from "next";
// import Image from "next/image";
import Link from "next/link";

import { Announcement } from "@/components/general/announcement";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { PageNav } from "@/components/layout/page-nav";
import { Button } from "@/components/ui/button";


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
						<Link href="/docs/components">View Components</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<PageNav className="hidden md:flex">
				{/* <ExamplesNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" /> */}
			</PageNav>
			<div className="container-wrapper section-soft flex-1 pb-6">
				<div className="container overflow-hidden">
					<section className="theme-container hidden md:block">
						{/* <RootComponents /> */}
					</section>
				</div>
			</div>
		</div>
	);
}
