"use client";

import { Check, ChevronRight, Clipboard, File, Folder } from "lucide-react";
import * as React from "react";
import { getIconForLanguageExtension } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { trackEvent } from "@/lib/events";
import type { FileTree } from "@/lib/registry";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";
import { JsonSchemaViewer } from "@/registry/ui/json-schema-viewer";
import { AgentChat } from "./agent-chat";
import { useAgentViewer } from "./agent-viewer";

function ToolCard({ toolId }: { toolId: string }) {
	const { toolMetadata } = useAgentViewer();
	const toolDetails = toolMetadata[toolId];
	const readableName = idToReadableText(toolId);

	if (!toolDetails) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-lg">{readableName}</CardTitle>
					<CardDescription>Tool details unavailable</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-lg">{readableName}</CardTitle>
				<CardDescription>{toolDetails.description}</CardDescription>
			</CardHeader>
			{toolDetails.inputSchema && (
				<CardContent>
					<div className="space-y-3">
						<h5 className="text-sm font-medium">Input Schema:</h5>
						<JsonSchemaViewer schema={toolDetails.inputSchema} />
					</div>
				</CardContent>
			)}
			{toolDetails.outputSchema && (
				<CardContent>
					<div className="space-y-3">
						<h5 className="text-sm font-medium">Output Schema:</h5>
						<JsonSchemaViewer schema={toolDetails.outputSchema} />
					</div>
				</CardContent>
			)}
		</Card>
	);
}

function AgentProfileCard() {
	const { item } = useAgentViewer();
	const meta = item.meta as
		| {
				toolIds: string[];
				suggestions?: string[];
				prompt?: string;
		  }
		| undefined;

	if (!item.categories?.includes("agent") || !meta) {
		return null;
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="space-y-2">
					<CardTitle className="text-2xl font-bold">
						{item.title ?? item.name}
					</CardTitle>
					<CardDescription className="text-base">
						{item.description}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{meta.prompt && (
					<div>
						<Collapsible defaultOpen={false}>
							<CollapsibleTrigger className="flex items-center gap-2 w-full">
								<h4 className="text-sm font-medium">Prompt</h4>
								<ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-90 ml-auto" />
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2">
								<div className="bg-muted rounded-md p-3">
									<pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
										{meta.prompt}
									</pre>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				)}
				<div>
					<h4 className="text-sm font-medium mb-3">Tools</h4>
					<div className="space-y-3">
						{meta.toolIds.map((toolId) => (
							<ToolCard key={toolId} toolId={toolId} />
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function AgentProfileView() {
	const { view, item } = useAgentViewer();

	if (view === "code") {
		return null;
	}

	return (
		<div className="hidden group-data-[view=code]/agent-view-wrapper:hidden lg:flex lg:h-[600px]">
			<ResizablePanelGroup
				id={`agent-viewer-${item.name}`}
				direction="horizontal"
				className="gap-4"
			>
				<ResizablePanel defaultSize={40} minSize={30}>
					<AgentProfileCard />
				</ResizablePanel>
				<ResizableHandle className="w-2" />
				<ResizablePanel defaultSize={60} minSize={40}>
					<AgentChat />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

function AgentCodeView() {
	const { activeFile, highlightedFiles, view } = useAgentViewer();

	const file = React.useMemo(() => {
		return highlightedFiles?.find((file) => file.target === activeFile);
	}, [highlightedFiles, activeFile]);

	if (view === "profile" || !file) {
		return null;
	}

	const language = file.path.split(".").pop() ?? "tsx";

	return (
		<div className="bg-code text-code-foreground mr-[14px] flex overflow-hidden rounded-xl border group-data-[view=profile]/agent-view-wrapper:hidden lg:h-[600px]">
			<div className="w-72">
				<AgentViewerFileTree />
			</div>
			<figure
				data-rehype-pretty-code-figure=""
				className="mx-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none"
			>
				<figcaption
					className="text-code-foreground [&_svg]:text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70"
					data-language={language}
				>
					{getIconForLanguageExtension(language)}
					{file.target}
					<div className="ml-auto flex items-center gap-2">
						<AgentCopyCodeButton />
					</div>
				</figcaption>
				<div
					key={file?.path}
					dangerouslySetInnerHTML={{
						__html: file?.highlightedContent ?? "",
					}}
					className="no-scrollbar overflow-y-auto"
				/>
			</figure>
		</div>
	);
}

function AgentViewerFileTree() {
	const { tree } = useAgentViewer();

	if (!tree) {
		return null;
	}

	return (
		<SidebarProvider className="flex min-h-full! flex-col border-r">
			<Sidebar collapsible="none" className="w-full flex-1">
				<SidebarGroupLabel className="h-12 rounded-none border-b px-4 text-sm">
					Files
				</SidebarGroupLabel>
				<SidebarGroup className="p-0">
					<SidebarGroupContent>
						<SidebarMenu className="translate-x-0 gap-1.5">
							{tree.map((file, index) => (
								<Tree
									key={`${file.name}-${index}`}
									item={file}
									index={1}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</Sidebar>
		</SidebarProvider>
	);
}

function Tree({ item, index }: { item: FileTree; index: number }) {
	const { activeFile, setActiveFile } = useAgentViewer();

	if (!item.children) {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton
					isActive={item.path === activeFile}
					onClick={() => item.path && setActiveFile(item.path)}
					className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
					data-index={index}
					style={
						{
							"--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
						} as React.CSSProperties
					}
				>
					<ChevronRight className="invisible" />
					<File className="h-4 w-4" />
					{item.name}
				</SidebarMenuButton>
			</SidebarMenuItem>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
						style={
							{
								"--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
							} as React.CSSProperties
						}
					>
						<ChevronRight className="transition-transform" />
						<Folder />
						{item.name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
						{item.children.map((subItem, key) => (
							<Tree
								key={`${item.name}-${key}`}
								item={subItem}
								index={index + 1}
							/>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}

function AgentCopyCodeButton() {
	const { activeFile, item } = useAgentViewer();
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	const file = React.useMemo(() => {
		return item.files?.find((file) => file.target === activeFile);
	}, [activeFile, item.files]);

	const content = file?.content;

	if (!content) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			className="size-7"
			onClick={() => {
				copyToClipboard(content);
				trackEvent({
					name: "copy_block_code",
					properties: {
						name: item.name,
						file: file.path,
					},
				});
			}}
		>
			{isCopied ? <Check /> : <Clipboard />}
		</Button>
	);
}

export {
	ToolCard,
	AgentProfileCard,
	AgentProfileView,
	AgentCodeView,
	AgentViewerFileTree,
	Tree,
	AgentCopyCodeButton,
};
