import type { Metadata } from "next";
import Link from "next/link";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
	PageHeaderPrimaryButton,
} from "@/components/layout/page-header";

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
					<PageHeaderPrimaryButton asChild>
						<Link href="/docs/agents">Get more nformation</Link>
					</PageHeaderPrimaryButton>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper section-soft flex-1 py-12">
				<div className="container">{children}</div>
			</div>
		</>
	);
}
