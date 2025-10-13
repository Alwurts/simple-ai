import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function Announcement() {
	return (
		<Badge asChild variant="secondary" className="rounded-full">
			<Link href="/ai-agents">
				<span
					className="flex size-2 rounded-full bg-blue-500"
					title="New"
				/>
				Newly Released AI Agents Workflows <ArrowRightIcon />
			</Link>
		</Badge>
	);
}
