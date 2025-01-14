"use client";

import type { ImperativePanelHandle } from "react-resizable-panels";

import { cn } from "@/lib/utils";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	type SetStateAction,
	type Dispatch,
	useCallback,
	useEffect,
	useRef,
	type RefObject,
} from "react";

interface CanvasMessage {
	type: string;
	code: string;
}

export function Preview({
	setViewerSize,
	code,
	className,
	viewerPanelRef,
}: {
	setViewerSize: Dispatch<SetStateAction<string>>;
	code: string;
	className?: string;
	viewerPanelRef: RefObject<ImperativePanelHandle>;
}) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const sendMessageToCanvas = useCallback((message: CanvasMessage) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage(message, "*");
		}
	}, []);

	useEffect(() => {
		sendMessageToCanvas({
			type: "CODE",
			code,
		});
	}, [sendMessageToCanvas, code]);

	return (
		<div
			className={cn(
				"flex-1 relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted-foreground/25 after:border after:border-border",
				className,
			)}
		>
			<ResizablePanelGroup direction="horizontal" className="relative z-10">
				<ResizablePanel
					ref={viewerPanelRef}
					order={1}
					className={cn(
						"relative rounded-lg border bg-background border-border",
					)}
					defaultSize={100}
					onResize={(size) => {
						setViewerSize(size.toString());
					}}
					minSize={30}
				>
					<iframe
						ref={iframeRef}
						title="block-preview"
						src={"/canvas"}
						height={"100%"}
						className="relative z-20 w-full bg-background"
					/>
				</ResizablePanel>
				<ResizableHandle
					className={cn(
						"relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block",
					)}
				/>
				<ResizablePanel defaultSize={0} minSize={0} order={2} />
			</ResizablePanelGroup>
		</div>
	);
}
