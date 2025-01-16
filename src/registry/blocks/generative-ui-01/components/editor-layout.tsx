"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChatDialog } from "@/registry/blocks/generative-ui-01/components/chat-dialog";
import { CodeEditor } from "@/registry/blocks/generative-ui-01/components/code-editor";
import { Preview } from "@/registry/blocks/generative-ui-01/components/preview";
import { CopyButton } from "@/registry/blocks/generative-ui-01/components/copy-button";
import { useGenerationStore } from "@/registry/blocks/generative-ui-01/hooks/generation-store";
import {
	BotMessageSquare,
	Code,
	EyeIcon,
	Monitor,
	Smartphone,
	Tablet,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

interface EditorLayoutProps {
	chatOpen: boolean;
	onChatOpenChange: (open: boolean) => void;
}

export function EditorLayout({
	chatOpen,
	onChatOpenChange,
}: EditorLayoutProps) {
	const viewerPanelRef = useRef<ImperativePanelHandle>(null);
	const [viewerSize, setViewerSize] = useState("100");
	const { view, setView } = useGenerationStore();
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const currentVersionData = versions[currentVersion];
	const isGenerating = currentVersionData?.status === "generating";
	const currentCode = versions[currentVersion]?.code ?? "";

	return (
		<div className="flex-1 relative py-3 pl-4 pr-1 flex flex-col gap-2 border-l border-border">
			<div className="h-10 flex items-center justify-start gap-4">
				<Button
					size="icon"
					onClick={() => onChatOpenChange(true)}
					disabled={isGenerating}
				>
					<BotMessageSquare className="h-4 w-4" />
				</Button>
				<Separator orientation="vertical" className="h-6" />
				<div className="flex items-center gap-1.5">
					<Code className="h-4 w-4" />
					<Switch
						checked={view === "preview"}
						onCheckedChange={(checked) => setView(checked ? "preview" : "code")}
					/>
					<EyeIcon className="h-4 w-4" />
				</div>
				<Separator orientation="vertical" className="h-6" />
				{view === "preview" && (
					<ToggleGroup
						type="single"
						size="sm"
						defaultValue="100"
						value={viewerSize}
						onValueChange={(value) => {
							if (viewerPanelRef.current) {
								viewerPanelRef.current.resize(Number.parseInt(value));
								setViewerSize(value);
							}
						}}
						className="items-center gap-1.5 rounded-md border p-1 shadow-sm flex bg-background"
					>
						<ToggleGroupItem value="100" className="h-7 w-7 rounded-sm p-0">
							<Monitor className="h-3.5 w-3.5" />
						</ToggleGroupItem>
						<ToggleGroupItem value="60" className="h-7 w-7 rounded-sm p-0">
							<Tablet className="h-3.5 w-3.5" />
						</ToggleGroupItem>
						<ToggleGroupItem value="35" className="h-7 w-7 rounded-sm p-0">
							<Smartphone className="h-3.5 w-3.5" />
						</ToggleGroupItem>
					</ToggleGroup>
				)}
				{view === "code" && <CopyButton value={currentCode} className="h-8" />}
			</div>
			<Preview
				className={view === "preview" ? "block" : "hidden"}
				viewerPanelRef={viewerPanelRef}
				setViewerSize={setViewerSize}
			/>
			<CodeEditor className={view === "code" ? "block" : "hidden"} />
			<ChatDialog open={chatOpen} onOpenChange={onChatOpenChange} />
		</div>
	);
}
