"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { Play } from "lucide-react";
import { nanoid } from "nanoid";
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
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";
import type { StartNode as StartNodeType } from "@/registry/blocks/workflow-01/lib/workflow/nodes/start/start.shared";
import type { NodeClientDefinition } from "@/registry/blocks/workflow-01/types/workflow";

export interface StartNodeProps extends NodeProps<StartNodeType> {}

export function StartNode({ id, selected, data }: StartNodeProps) {
	const canConnectHandle = useWorkflow((store) => store.canConnectHandle);

	const validationErrors =
		data.validationErrors?.map((error) => ({
			message: error.message,
		})) || [];

	const isHandleConnectable = canConnectHandle({
		nodeId: id,
		handleId: "output",
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
				id="output"
				type="source"
				position={Position.Right}
				isConnectable={isHandleConnectable}
			/>
		</BaseNode>
	);
}

export function StartNodePanel({ node: _node }: { node: StartNodeType }) {
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

export function createStartNode(position: {
	x: number;
	y: number;
}): StartNodeType {
	return {
		id: nanoid(),
		type: "start",
		position,
		deletable: false,
		data: {
			sourceType: { type: "text" },
		},
	};
}

export const startClientDefinition: NodeClientDefinition<StartNodeType> = {
	component: StartNode,
	panelComponent: StartNodePanel,
	create: createStartNode,
	meta: {
		label: "Start",
		icon: Play,
		description: "The entry point of the workflow",
	},
};
