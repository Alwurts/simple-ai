"use client";

import { LoaderCircle, Monitor, Smartphone, Tablet } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/registry/blocks/app-01/hooks/generation-store";

interface CanvasMessage {
	type: string;
	code: string;
}

interface PreviewProps {
	className?: string;
	viewerSize: string;
	onViewerSizeChange: (size: string) => void;
}

export function PreviewControls({
	viewerSize,
	onViewerSizeChange,
}: {
	viewerSize: string;
	onViewerSizeChange: (value: string) => void;
}) {
	return (
		<ToggleGroup
			type="single"
			size="sm"
			defaultValue="100"
			value={viewerSize}
			onValueChange={value => {
				onViewerSizeChange(value);
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
	);
}

export function Preview({
	className,
	viewerSize,
	onViewerSizeChange,
}: PreviewProps) {
	const versions = useGenerationStore(state => state.versions);
	const currentVersion = useGenerationStore(state => state.currentVersion);
	const currentCode = versions[currentVersion]?.code ?? "";
	const isGenerating = versions[currentVersion]?.status === "generating";
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const viewerPanelRef = useRef<ImperativePanelHandle>(null);

	const sendMessageToCanvas = useCallback((message: CanvasMessage) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage(message, "*");
		}
	}, []);

	useEffect(() => {
		sendMessageToCanvas({
			type: "CODE",
			code: currentCode,
		});
	}, [sendMessageToCanvas, currentCode]);

	// Update panel size when viewerSize changes
	useEffect(() => {
		if (viewerPanelRef.current) {
			viewerPanelRef.current.resize(Number.parseInt(viewerSize, 10));
		}
	}, [viewerSize]);

	return (
		<div className={cn("flex-1 relative", className)}>
			<div
				className={cn(
					"h-full relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted-foreground/25 after:border after:border-border",
				)}
			>
				<ResizablePanelGroup
					id="app-01-preview"
					direction="horizontal"
					className="relative z-10"
				>
					<ResizablePanel
						ref={viewerPanelRef}
						order={1}
						className={cn(
							"relative rounded-lg border bg-background border-border",
						)}
						defaultSize={Number.parseInt(viewerSize, 10)}
						onResize={size => {
							onViewerSizeChange(size.toString());
						}}
						minSize={30}
					>
						<iframe
							ref={iframeRef}
							title="block-preview"
							src={"/canvas"}
							className="relative z-20 w-full h-full bg-background"
						/>
						{isGenerating && (
							<div className="absolute inset-0 z-30 bg-background/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto animate-pulse">
								<LoaderCircle className="w-10 h-10 animate-spin" />
							</div>
						)}
					</ResizablePanel>
					<ResizableHandle
						className={cn(
							"relative w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100",
						)}
					/>
					<ResizablePanel defaultSize={0} minSize={0} order={2} />
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
