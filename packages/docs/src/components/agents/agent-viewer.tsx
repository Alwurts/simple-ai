"use client";

import { Check, Terminal } from "lucide-react";
import * as React from "react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { createFileTreeForRegistryItemFiles } from "@/lib/registry";
import type { ToolDetails } from "@/lib/tool-metadata";
import type {
	registryItemFileSchema,
	registryItemSchema,
} from "@/shadcn-temp/schema";
import { AgentChat } from "./agent-chat";
import { AgentCodeView } from "./agent-code-view";
import { AgentProfileCard } from "./agent-profile-card";
import { AgentProfileView } from "./agent-profile-view";

type AgentViewerContext = {
	item: z.infer<typeof registryItemSchema>;
	view: "profile" | "code";
	setView: (view: "profile" | "code") => void;
	activeFile: string | null;
	setActiveFile: (file: string) => void;
	tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
	highlightedFiles:
		| (z.infer<typeof registryItemFileSchema> & {
				highlightedContent: string;
		  })[]
		| null;
	agentId: string;
	toolMetadata: Record<string, ToolDetails>;
};

const AgentViewerContext = React.createContext<AgentViewerContext | null>(null);

export function useAgentViewer() {
	const context = React.useContext(AgentViewerContext);
	if (!context) {
		throw new Error(
			"useAgentViewer must be used within a AgentViewerProvider.",
		);
	}
	return context;
}

function AgentViewerProvider({
	item,
	tree,
	highlightedFiles,
	agentId,
	toolMetadata,
	children,
}: Pick<
	AgentViewerContext,
	"item" | "tree" | "highlightedFiles" | "agentId" | "toolMetadata"
> & {
	children: React.ReactNode;
}) {
	const [view, setView] =
		React.useState<AgentViewerContext["view"]>("profile");
	const [activeFile, setActiveFile] = React.useState<
		AgentViewerContext["activeFile"]
	>(highlightedFiles?.[0].target ?? null);

	return (
		<AgentViewerContext.Provider
			value={{
				item,
				view,
				setView,
				activeFile,
				setActiveFile,
				tree,
				highlightedFiles,
				agentId,
				toolMetadata,
			}}
		>
			<div
				id={item.name}
				data-view={view}
				className="group/agent-view-wrapper flex min-w-0 scroll-mt-24 flex-col items-stretch gap-4 overflow-hidden"
			>
				{children}
			</div>
		</AgentViewerContext.Provider>
	);
}

function AgentViewerToolbar() {
	const { setView, view, item } = useAgentViewer();
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	return (
		<div className="hidden w-full items-center gap-2 pl-2 md:pr-6 lg:flex">
			<Tabs
				value={view}
				onValueChange={(value) => setView(value as "profile" | "code")}
			>
				<TabsList className="grid h-8 grid-cols-2 items-center rounded-md p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
					<TabsTrigger value="profile">View</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
			</Tabs>
			<Separator orientation="vertical" className="mx-2 h-4!" />
			<div className="flex flex-col flex-1">
				<div className="text-lg font-semibold">
					{item.title ?? item.name}
				</div>
				<div className="text-sm text-muted-foreground">
					{item.description?.replace(/\.$/, "")}
				</div>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<Separator orientation="vertical" className="mx-1 h-4!" />
				<Button
					variant="outline"
					className="w-fit gap-1 px-2 shadow-none"
					size="sm"
					onClick={() => {
						copyToClipboard(
							`npx shadcn@latest add @simple-ai/${item.name}`,
						);
					}}
				>
					{isCopied ? <Check /> : <Terminal />}
					<span>npx shadcn add @simple-ai/{item.name}</span>
				</Button>
			</div>
		</div>
	);
}

function AgentViewerMobile() {
	const { item, view, setView } = useAgentViewer();

	return (
		<div className="flex flex-col gap-4 lg:hidden">
			<div className="flex items-center gap-2 px-2">
				<div className="line-clamp-1 text-sm font-medium">
					{item.description}
				</div>
				<div className="text-muted-foreground ml-auto shrink-0 font-mono text-xs">
					{item.name}
				</div>
			</div>
			<Tabs
				value={view}
				onValueChange={(value) => setView(value as "profile" | "code")}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="profile">View</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
			</Tabs>
			{view === "profile" ? (
				<div className="space-y-4">
					<AgentProfileCard />
					<AgentChat />
				</div>
			) : (
				<AgentCodeView />
			)}
		</div>
	);
}

export function AgentViewer({
	item,
	tree,
	highlightedFiles,
	agentId,
	toolMetadata,
	...props
}: Pick<
	AgentViewerContext,
	"item" | "tree" | "highlightedFiles" | "agentId" | "toolMetadata"
>) {
	return (
		<AgentViewerProvider
			item={item}
			tree={tree}
			highlightedFiles={highlightedFiles}
			agentId={agentId}
			toolMetadata={toolMetadata}
			{...props}
		>
			<AgentViewerToolbar />
			<AgentProfileView />
			<AgentCodeView />
			<AgentViewerMobile />
		</AgentViewerProvider>
	);
}
