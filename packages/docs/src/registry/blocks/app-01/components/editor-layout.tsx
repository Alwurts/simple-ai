"use client";

import { useMemo, useState } from "react";
import { ChatDialog } from "@/registry/blocks/app-01/components/chat-dialog";
import { CodeEditor } from "@/registry/blocks/app-01/components/code-editor";
import { CopyButton } from "@/registry/blocks/app-01/components/copy-button";
import { EditorToolbar } from "@/registry/blocks/app-01/components/editor-toolbar";
import {
	Preview,
	PreviewControls,
} from "@/registry/blocks/app-01/components/preview";
import { useGenerationStore } from "@/registry/blocks/app-01/hooks/generation-store";

export const EditorLayout = () => {
	const view = useGenerationStore(state => state.view);
	const versions = useGenerationStore(state => state.versions);
	const currentVersion = useGenerationStore(state => state.currentVersion);
	const currentCode = versions[currentVersion]?.code ?? "";
	const [viewerSize, setViewerSize] = useState("100");

	const toolbarActions = useMemo(() => {
		if (view === "preview") {
			return (
				<PreviewControls
					viewerSize={viewerSize}
					onViewerSizeChange={setViewerSize}
				/>
			);
		}
		if (view === "code") {
			return <CopyButton value={currentCode} className="h-8" />;
		}
		return null;
	}, [view, viewerSize, currentCode]);

	return (
		<div className="flex-1 relative py-3 pl-4 pr-1 flex flex-col gap-2 border-l border-border">
			<EditorToolbar actions={toolbarActions} />
			<Preview
				className={view === "preview" ? "block" : "hidden"}
				viewerSize={viewerSize}
				onViewerSizeChange={setViewerSize}
			/>
			<CodeEditor className={view === "code" ? "block" : "hidden"} />
			<ChatDialog />
		</div>
	);
};
