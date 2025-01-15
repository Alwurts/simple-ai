import { cn } from "@/lib/utils";
import { useGenerationStore } from "../store";
import type { ComponentPropsWithoutRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Versions({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);

	return (
		<div
			{...props}
			className={cn(
				"flex flex-col h-full overflow-y-auto w-[200px] shrink-0 border-r border-border",
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
								"transition-all cursor-pointer",
								version.versionNumber === currentVersion && version.status === "generating"
									? "border-primary shadow-[0_0_10px_rgba(var(--primary)_/_0.2)] animate-pulse"
									: version.versionNumber === currentVersion
									? "border-primary"
									: "hover:bg-muted/50",
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
											{version.status === "generating" ? "Loading..." : "Current"}
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
