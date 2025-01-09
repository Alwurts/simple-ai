"use client";

import { Index } from "@/__registry__";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface ComponentPreviewSimpleProps
	extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	align?: "center" | "start" | "end";
}

export function ComponentPreviewSimple({
	name,
	align = "center",
}: ComponentPreviewSimpleProps) {
	const Preview = useMemo(() => {
		const Component = Index[name]?.component;

		if (!Component) {
			return (
				<p className="text-sm text-muted-foreground">
					Component{" "}
					<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
						{name}
					</code>{" "}
					not found in registry.
				</p>
			);
		}

		return <Component />;
	}, [name]);

	return (

			<div
				className={cn("flex min-h-[350px] w-full justify-center p-10", {
					"items-center": align === "center",
					"items-start": align === "start",
					"items-end": align === "end",
				})}
			>
				<React.Suspense
					fallback={
						<div className="flex w-full items-center justify-center text-sm text-muted-foreground">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</div>
					}
				>
					{Preview}
				</React.Suspense>
			</div>
	
	);
}
