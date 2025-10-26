import type { Node, NodeProps } from "@xyflow/react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ResizableNode } from "@/registry/blocks/workflow-01/components/workflow/primitives/resizable-node";
import { useWorkflow } from "@/registry/blocks/workflow-01/workflow/use-workflow";

export type NoteNodeData = {
	content: string;
};

export type NoteNode = Node<NoteNodeData, "note">;

export interface NoteNodeProps extends NodeProps<NoteNode> {}

export function NoteNode({ id, selected, data }: NoteNodeProps) {
	const updateNode = useWorkflow((store) => store.updateNode);

	const handleContentChange = (content: string) => {
		updateNode({
			id,
			nodeType: "note",
			data: { content },
		});
	};

	return (
		<ResizableNode selected={selected} className="p-4">
			<Textarea
				value={data.content}
				onChange={(e) => handleContentChange(e.target.value)}
				placeholder="Enter your note here..."
				className={cn(
					"h-full w-full resize-none border-none bg-transparent dark:bg-transparent focus-visible:ring-0 p-0 shadow-none",
					"placeholder:text-muted-foreground/50 text-sm",
					"nodrag nopan nowheel cursor-auto",
				)}
			/>
		</ResizableNode>
	);
}
