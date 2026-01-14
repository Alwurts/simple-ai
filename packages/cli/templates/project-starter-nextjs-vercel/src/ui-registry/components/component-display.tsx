"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { highlightCode } from "@/ui-registry/lib/highlight-code";
import { Index } from "@/ui-registry/registry/__index__";

export function ComponentPreview({
	name,
	className,
	align = "center",
	hideCode = false,
	chromeLessOnMobile = false,
	...props
}: React.ComponentProps<"div"> & {
	name: string;
	align?: "center" | "start" | "end";
	description?: string;
	hideCode?: boolean;
	chromeLessOnMobile?: boolean;
}) {
	const [tab, setTab] = React.useState("preview");
	const [source, setSource] = React.useState<string | null>(null);

	const Component = Index[name]?.component;

	React.useEffect(() => {
		async function loadSource() {
			try {
				const item = Index[name];
				if (item?.files?.[0]?.path) {
					const response = await fetch(item.files[0].path);
					const content = await response.text();
					const highlighted = await highlightCode(content);
					setSource(highlighted);
				}
			} catch (error) {
				console.error("Failed to load source:", error);
			}
		}

		if (!hideCode) {
			loadSource();
		}
	}, [name, hideCode]);

	if (!Component) {
		return (
			<p className="text-muted-foreground mt-6 text-sm">
				Component{" "}
				<code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
					{name}
				</code>{" "}
				not found in registry.
			</p>
		);
	}

	return (
		<div className={cn("group relative mt-4 mb-12 flex flex-col gap-2", className)} {...props}>
			<Tabs className="relative mr-auto w-full" value={tab} onValueChange={setTab}>
				<div className="flex items-center justify-between">
					{!hideCode && (
						<TabsList className="justify-start gap-4 rounded-none bg-transparent px-2 md:px-0">
							<TabsTrigger
								value="preview"
								className="text-muted-foreground data-[state=active]:text-foreground px-0 text-base data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
							>
								Preview
							</TabsTrigger>
							<TabsTrigger
								value="code"
								className="text-muted-foreground data-[state=active]:text-foreground px-0 text-base data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
							>
								Code
							</TabsTrigger>
						</TabsList>
					)}
				</div>
			</Tabs>
			<div
				data-tab={tab}
				data-chrome-less-on-mobile={chromeLessOnMobile}
				className="data-[tab=code]:border-code relative rounded-lg border data-[chrome-less-on-mobile=true]:border-0 sm:data-[chrome-less-on-mobile=true]:border md:-mx-1"
			>
				<div
					data-slot="preview"
					data-active={tab === "preview"}
					className="invisible data-[active=true]:visible"
				>
					<div
						data-align={align}
						className={cn(
							"preview flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start",
							chromeLessOnMobile ? "sm:p-10" : "h-[450px] p-10",
						)}
					>
						<React.Suspense fallback={<div>Loading...</div>}>
							<Component />
						</React.Suspense>
					</div>
				</div>
				<div
					data-slot="code"
					data-active={tab === "code"}
					className={cn(
						"absolute inset-0 hidden overflow-hidden data-[active=true]:block **:[figure]:!m-0 **:[pre]:h-[450px]",
					)}
				>
					{source && (
						<figure className="mx-0 mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none">
							<figcaption className="text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70">
								{Index[name]?.files?.[0]?.target || name}
							</figcaption>
							<div
								// biome-ignore lint/security/noDangerouslySetInnerHtml: Ok
								dangerouslySetInnerHTML={{
									__html: source,
								}}
								className="no-scrollbar overflow-y-auto"
							/>
						</figure>
					)}
				</div>
			</div>
		</div>
	);
}
