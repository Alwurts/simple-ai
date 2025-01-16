"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGenerationStore } from "@/registry/blocks/generative-ui-01/hooks/generation-store";
import { BotMessageSquare, Code, EyeIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

interface EditorToolbarProps {
	actions?: ReactNode;
}

export const EditorToolbar: FC<EditorToolbarProps> = ({ actions }) => {
	const view = useGenerationStore((state) => state.view);
	const setView = useGenerationStore((state) => state.setView);
	const setChatOpen = useGenerationStore((state) => state.setChatOpen);
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const currentVersionData = versions[currentVersion];
	const isGenerating = currentVersionData?.status === "generating";

	return (
		<div className="h-10 flex items-center justify-start gap-4">
			<Button
				size="icon"
				onClick={() => setChatOpen(true)}
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
			{actions}
		</div>
	);
};
