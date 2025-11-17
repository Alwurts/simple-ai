"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AgentChat } from "./agent-chat";
import { AgentProfileCard } from "./agent-profile-card";
import { useAgentViewer } from "./agent-viewer";

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

export { AgentProfileView };
