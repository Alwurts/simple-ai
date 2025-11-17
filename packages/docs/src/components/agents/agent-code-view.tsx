"use client";

import { Check, ChevronRight, Clipboard, File, Folder } from "lucide-react";
import * as React from "react";
import { getIconForLanguageExtension } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { trackEvent } from "@/lib/events";
import type { FileTree } from "@/lib/registry";
import { useAgentViewer } from "./agent-viewer";

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
		<Sidebar
			collapsible="none"
			className="flex min-h-full! flex-col border-r"
		>
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

export { AgentCodeView, AgentViewerFileTree, Tree, AgentCopyCodeButton };
