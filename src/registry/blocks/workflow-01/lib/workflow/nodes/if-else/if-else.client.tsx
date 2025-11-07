"use client";

import {
	type NodeProps,
	Position,
	useUpdateNodeInternals,
} from "@xyflow/react";
import { GitBranch, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ConditionEditor } from "@/registry/blocks/workflow-01/components/editor/condition-editor";
import { BaseNode } from "@/registry/blocks/workflow-01/components/workflow/primitives/base-node";
import { LabeledHandle } from "@/registry/blocks/workflow-01/components/workflow/primitives/labeled-handle";
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderStatus,
	NodeHeaderTitle,
} from "@/registry/blocks/workflow-01/components/workflow/primitives/node-header";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";
import { getAvailableVariables } from "@/registry/blocks/workflow-01/lib/workflow/variables";
import type { NodeClientDefinition } from "../types";
import type { IfElseNode as IfElseNodeType } from "./if-else.shared";

export interface IfElseNodeProps extends NodeProps<IfElseNodeType> {}

export function IfElseNode({ selected, data, deletable, id }: IfElseNodeProps) {
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const validationErrors =
		data.validationErrors?.map((error) => ({
			message: error.message,
		})) || [];

	return (
		<BaseNode
			selected={selected}
			className={cn("flex flex-col p-0", {
				"border-orange-500": data.status === "processing",
				"border-red-500": data.status === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<GitBranch />
				</NodeHeaderIcon>
				<NodeHeaderTitle>If/Else</NodeHeaderTitle>
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
			<Separator />
			<div className="grid grid-cols-3 gap-2 pt-2 pb-4 text-sm">
				<div className="col-span-1 flex flex-col gap-2">
					<LabeledHandle
						id="input"
						title="Input"
						type="target"
						position={Position.Left}
					/>
				</div>
				<div className="col-span-2 flex flex-col gap-2 justify-self-end">
					{data.dynamicSourceHandles.map((handle) => {
						const displayText =
							handle.label || handle.condition || "-";
						const isPlaceholder =
							!handle.label && !handle.condition;
						return (
							<LabeledHandle
								key={handle.id}
								id={handle.id}
								title={displayText}
								labelClassName={cn(
									"max-w-56 truncate",
									isPlaceholder
										? "text-muted-foreground"
										: "",
								)}
								type="source"
								position={Position.Right}
							/>
						);
					})}
					<LabeledHandle
						id="else"
						title="Else"
						labelClassName="max-w-32 truncate"
						type="source"
						position={Position.Right}
					/>
				</div>
			</div>
		</BaseNode>
	);
}

export function IfElseNodePanel({ node }: { node: IfElseNodeType }) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const nodes = useWorkflow((state) => state.nodes);
	const edges = useWorkflow((state) => state.edges);
	const updateNodeInternals = useUpdateNodeInternals();

	const availableVariables = useMemo(
		() => getAvailableVariables(node.id, nodes, edges),
		[node.id, nodes, edges],
	);
	const addSourceHandle = () => {
		updateNode({
			id: node.id,
			nodeType: "if-else",
			data: {
				dynamicSourceHandles: [
					...node.data.dynamicSourceHandles,
					{
						id: nanoid(),
						label: null,
						condition: "",
					},
				],
			},
		});
		updateNodeInternals(node.id);
	};

	const updateSourceHandle = (
		handleId: string,
		updates: { label?: string | null; condition?: string },
	) => {
		updateNode({
			id: node.id,
			nodeType: "if-else",
			data: {
				dynamicSourceHandles: node.data.dynamicSourceHandles.map(
					(handle) =>
						handle.id === handleId
							? { ...handle, ...updates }
							: handle,
				),
			},
		});
	};

	const removeSourceHandle = (handleId: string) => {
		updateNode({
			id: node.id,
			nodeType: "if-else",
			data: {
				dynamicSourceHandles: node.data.dynamicSourceHandles.filter(
					(handle) => handle.id !== handleId,
				),
			},
		});
		updateNodeInternals(node.id);
	};

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs text-gray-600">
					This node routes execution based on a condition. The "If"
					output executes when the condition is true, and the "Else"
					output executes when the condition is false.
				</p>
			</div>

			<div>
				<h4 className="font-medium text-sm mb-3">Conditions</h4>
				<Separator className="my-2" />
				<div className="space-y-4">
					{node.data.dynamicSourceHandles.map((handle, index) => (
						<div key={handle.id} className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Condition {index + 1}
								</span>
								{node.data.dynamicSourceHandles.length > 1 && (
									<Button
										onClick={() =>
											removeSourceHandle(handle.id)
										}
										size="icon-sm"
										variant="destructive"
									>
										<Trash className="w-3 h-3" />
									</Button>
								)}
							</div>
							<div className="grid grid-cols-1 gap-2">
								<div>
									<label
										htmlFor={`label-${handle.id}`}
										className="text-xs text-gray-600 mb-1 block"
									>
										Label
									</label>
									<Input
										id={`label-${handle.id}`}
										value={handle.label || ""}
										onChange={(e) =>
											updateSourceHandle(handle.id, {
												label: e.target.value || null,
											})
										}
										placeholder="Enter label (optional)"
										className="h-8 text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor={`condition-${handle.id}`}
										className="text-xs text-gray-600 mb-1 block"
									>
										Condition
									</label>
									<ConditionEditor
										value={handle.condition}
										onChange={(value) =>
											updateSourceHandle(handle.id, {
												condition: value,
											})
										}
										availableVariables={availableVariables}
										placeholder="Enter condition expression"
									/>
								</div>
							</div>
							{index <
								node.data.dynamicSourceHandles.length - 1 && (
								<Separator className="my-2" />
							)}
						</div>
					))}
				</div>
			</div>

			<div>
				<Button onClick={addSourceHandle} size="sm" className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					Add Condition
				</Button>
			</div>
		</div>
	);
}

export function createIfElseNode(position: {
	x: number;
	y: number;
}): IfElseNodeType {
	return {
		id: nanoid(),
		type: "if-else",
		position,
		data: {
			status: "idle",
			dynamicSourceHandles: [
				{
					id: nanoid(),
					label: "If",
					condition: "",
				},
			],
		},
	};
}

export const ifElseClientDefinition: NodeClientDefinition<IfElseNodeType> = {
	component: IfElseNode,
	panelComponent: IfElseNodePanel,
	create: createIfElseNode,
	meta: {
		label: "If/Else",
		icon: GitBranch,
		description: "Routes execution based on conditional expressions",
	},
};
