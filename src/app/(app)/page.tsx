import Link from "next/link";

import { Announcement } from "@/components/announcement";
import Chat from "@/components/chat";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<>
			<PageHeader>
				<Announcement />
				<PageHeaderHeading>
					Easily build AI Powered Applications
				</PageHeaderHeading>
				<PageHeaderDescription>
					AI UI components that you can copy and paste into your apps.
					Customizable. Open Source.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href="/docs">Get Started</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href="/blocks">Browse Blocks</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<div className="container-wrapper flex-1">
				<div className="container py-6">
					<section className="[&>div]:p-0">
						<Chat className="h-[600px] max-w-3xl mx-auto" />
					</section>
				</div>
			</div>
		</>
	);
}
