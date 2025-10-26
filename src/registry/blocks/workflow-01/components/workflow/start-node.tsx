import { type Node, type NodeProps, Position } from "@xyflow/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseHandle } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-handle";
import { BaseNode } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-node";
import {
	NodeHeader,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderStatus,
	NodeHeaderTitle,
} from "@/registry/blocks/workflow-01/components/workflow/primitives/node-header";
import type {
	NodeStatus,
	TextNodeOutput,
	ValidationError,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { useWorkflow } from "@/registry/blocks/workflow-01/workflow/use-workflow";

export type StartNodeData = {
	status?: NodeStatus;
	sourceType: TextNodeOutput;
	validationErrors?: ValidationError[];
};

export type StartNode = Node<StartNodeData, "start">;

export interface StartNodeProps extends NodeProps<StartNode> {}

export function StartNode({ id, selected, data }: StartNodeProps) {
	const canConnectHandle = useWorkflow((store) => store.canConnectHandle);

	const validationErrors =
		data.validationErrors?.map((error) => ({
			message: error.message,
		})) || [];

	const isHandleConnectable = canConnectHandle({
		nodeId: id,
		handleId: "message",
		type: "source",
	});

	return (
		<BaseNode
			selected={selected}
			className={cn("flex flex-col p-2", {
				"border-orange-500": data.status === "processing",
				"border-red-500": data.status === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<Play />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Start</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderStatus
						status={data.status}
						errors={validationErrors}
					/>
				</NodeHeaderActions>
			</NodeHeader>

			<BaseHandle
				id="message"
				type="source"
				position={Position.Right}
				isConnectable={isHandleConnectable}
			/>
		</BaseNode>
	);
}

export function StartNodePanel({ node: _node }: { node: StartNode }) {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="font-medium text-sm mb-2">Start Node</h4>
				<p className="text-xs text-gray-600">
					This node initiates the workflow execution.
				</p>
			</div>
		</div>
	);
}
