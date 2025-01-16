import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/registry/blocks/generative-ui-01/hooks/generation-store";
import { BotMessageSquare } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export function Versions({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const setChatOpen = useGenerationStore((state) => state.setChatOpen);
	const currentVersionData = versions[currentVersion];
	const isGenerating = currentVersionData?.status === "generating";

	return (
		<div
			{...props}
			className={cn(
				"flex flex-col h-full w-[200px] shrink-0 border-r border-border",
				className,
			)}
		>
			<div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
				{versions.length === 0 ? (
					<div className="p-4 text-sm text-muted-foreground text-center">
						No versions yet
					</div>
				) : (
					versions.map((version) => (
						<Card
							key={version.versionNumber}
							className={cn(
								"transition-all",
								version.versionNumber === currentVersion && "border-primary",
								version.status === "generating" &&
									"border-primary animate-pulse",
							)}
						>
							<CardContent className="p-3">
								<div className="flex items-center justify-between">
									<div className="text-xs font-medium">
										Version {version.versionNumber + 1}
									</div>
									{version.versionNumber === currentVersion && (
										<Badge
											variant="secondary"
											className="text-[10px] px-1 py-0"
										>
											{version.status === "generating"
												? "Loading..."
												: "Current"}
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
			<div className="p-2 border-t">
				<Button
					size="sm"
					className="w-full"
					onClick={() => setChatOpen(true)}
					disabled={isGenerating}
				>
					<BotMessageSquare className="h-4 w-4 mr-2" />
					New generation
				</Button>
			</div>
		</div>
	);
}
