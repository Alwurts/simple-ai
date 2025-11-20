import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";

import Link from "next/link";

const announcementVariants = cva(
	"inline-flex items-center rounded-full border bg-background px-3 py-1 font-medium backdrop-blur-sm",
	{
		variants: {
			size: {
				sm: "text-xs gap-1.5 [&>span:first-child]:size-1.5",
				lg: "text-sm gap-2 [&>span:first-child]:size-2",
			},
		},
		defaultVariants: {
			size: "sm",
		},
	},
);

interface AnnouncementProps extends VariantProps<typeof announcementVariants> {}

export function Announcement({ size }: AnnouncementProps = {}) {
	return (
		<Link href="/agents" className={announcementVariants({ size })}>
			<span className="flex h-2 w-2 rounded-full bg-brand mr-1 animate-pulse" />
			New AI Agents Gallery
			<ArrowRightIcon className="h-3 w-3" />
		</Link>
	);
}
