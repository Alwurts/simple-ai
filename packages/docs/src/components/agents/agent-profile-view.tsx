"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AgentChat } from "./agent-chat";
import { AgentInfo } from "./agent-info";
import { useAgentViewer } from "./agent-viewer";

function AgentProfileView() {
	const { view, item } = useAgentViewer();

	if (view === "code") {
		return null;
	}

	return (
		<div className="hidden group-data-[view=code]/agent-view-wrapper:hidden lg:flex h-full">
			<div className="relative w-full h-[700px]">
				<ResizablePanelGroup
					id={`agent-viewer-${item.name}`}
					direction="horizontal"
					className="rounded-xl overflow-hidden border"
				>
					{/* Agent Info - 2/3 of space */}
					<ResizablePanel defaultSize={66} minSize={50}>
						<AgentInfo />
					</ResizablePanel>

					<ResizableHandle className="w-px bg-border" />

					{/* Chat - 1/3 of space */}
					<ResizablePanel defaultSize={34} minSize={25}>
						<AgentChat />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}

export { AgentProfileView };
