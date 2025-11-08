"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { Square, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import { BaseHandle } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-handle";
import { BaseNode } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-node";
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderStatus,
	NodeHeaderTitle,
} from "@/registry/blocks/workflow-01/components/workflow/primitives/node-header";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";
import type { NodeClientDefinition } from "../types";
import type { EndNode as EndNodeType } from "./end.shared";

export interface EndNodeProps extends NodeProps<EndNodeType> {}

export function EndNode({ selected, data, deletable, id }: EndNodeProps) {
	const deleteNode = useWorkflow((state) => state.deleteNode);
	const canConnectHandle = useWorkflow((store) => store.canConnectHandle);

	const validationErrors =
		data.validationErrors?.map((error) => ({
			message: error.message,
		})) || [];

	const isTargetConnectable = canConnectHandle({
		nodeId: id,
		handleId: "input",
		type: "target",
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
					<Square />
				</NodeHeaderIcon>
				<NodeHeaderTitle>End</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderStatus
						status={data.status}
						errors={validationErrors}
					/>
					{deletable && (
						<NodeHeaderAction
							onClick={() => deleteNode(id)}
							variant="ghost"
							label="Delete node"
						>
							<Trash />
						</NodeHeaderAction>
					)}
				</NodeHeaderActions>
			</NodeHeader>

			<BaseHandle
				id="input"
				type="target"
				position={Position.Left}
				isConnectable={isTargetConnectable}
			/>
		</BaseNode>
	);
}

export function EndNodePanel({ node: _node }: { node: EndNodeType }) {
	return (
		<div className="space-y-4">
			<div>
				<h4 className="font-medium text-sm mb-2">End Node</h4>
				<p className="text-xs text-gray-600">
					This node terminates the workflow execution.
				</p>
			</div>
		</div>
	);
}

export function createEndNode(position: { x: number; y: number }): EndNodeType {
	return {
		id: nanoid(),
		type: "end",
		position,
		data: {},
	};
}

export const endClientDefinition: NodeClientDefinition<EndNodeType> = {
	component: EndNode,
	panelComponent: EndNodePanel,
	create: createEndNode,
	meta: {
		label: "End",
		icon: Square,
		description: "Terminates the workflow execution",
	},
};
