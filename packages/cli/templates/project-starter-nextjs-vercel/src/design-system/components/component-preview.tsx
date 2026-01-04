"use client";

import type * as React from "react";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps {
	name: string;
	description?: string;
	code: string;
	children: React.ReactNode;
	className?: string;
}

export function ComponentPreview({
	name,
	description,
	code,
	children,
	className,
}: ComponentPreviewProps) {
	return (
		<div className={cn("group relative my-4 flex flex-col space-y-2", className)}>
			<div className="flex flex-col space-y-1.5">
				<h3 className="font-semibold leading-none tracking-tight">{name}</h3>
				{description && <p className="text-sm text-muted-foreground">{description}</p>}
			</div>

			<Tabs defaultValue="preview" className="relative mr-auto w-full">
				<div className="flex items-center justify-between pb-3">
					<TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
						<TabsTrigger
							value="preview"
							className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
						>
							Preview
						</TabsTrigger>
						<TabsTrigger
							value="code"
							className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
						>
							Code
						</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="preview" className="relative rounded-md border">
					<div className="flex min-h-[350px] w-full items-center justify-center p-10 overflow-auto">
						{children}
					</div>
				</TabsContent>
				<TabsContent value="code" className="relative">
					<div className="max-h-[600px] overflow-auto rounded-md border bg-muted/50">
						<CodeBlock language="tsx" code={code} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
