"use client";

import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";

export const CopyWorkflowButton = ({
	className,
	...props
}: React.ComponentProps<typeof Button>) => {
	const { nodes, edges } = useWorkflow((store) => ({
		nodes: store.nodes,
		edges: store.edges,
	}));

	const { isCopied, copyToClipboard } = useCopyToClipboard({
		timeout: 2000,
	});

	const handleCopy = () => {
		const workflowData = {
			nodes,
			edges,
		};
		copyToClipboard(JSON.stringify(workflowData, null, 2));
	};

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			className={cn("group/copy", className)}
			onClick={handleCopy}
			title="Copy workflow as JSON"
			{...props}
		>
			<ClipboardCopy
				className={cn("size-4", isCopied && "text-green-600")}
			/>
			<span className="sr-only">
				{isCopied ? "Copied to clipboard" : "Copy workflow as JSON"}
			</span>
		</Button>
	);
};
