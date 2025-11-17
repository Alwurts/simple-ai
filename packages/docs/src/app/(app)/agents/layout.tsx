import type { Metadata } from "next";
import Link from "next/link";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const title = "AI Agents";
const description =
	"Pre-built AI agents with tools and prompts. Copy and paste into your apps. Open Source.";

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

export default function AgentsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs/agents">Get More Information</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex-1 md:py-12">
				<div className="container">{children}</div>
			</div>
		</>
	);
}
