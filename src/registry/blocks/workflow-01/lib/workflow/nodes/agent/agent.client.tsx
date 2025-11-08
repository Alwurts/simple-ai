"use client";

import { type NodeProps, Position } from "@xyflow/react";
import { Bot, ChevronDown, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SchemaEditorDialog } from "@/registry/blocks/workflow-01/components/editor/schema-editor";
import { SchemaPreview } from "@/registry/blocks/workflow-01/components/editor/schema-preview";
import { ModelSelector } from "@/registry/blocks/workflow-01/components/model-selector";
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
import {
	WORKFLOW_TOOLS,
	workflowTools,
} from "@/registry/blocks/workflow-01/lib/tools";
import type { workflowModelID } from "@/registry/blocks/workflow-01/lib/workflow/models";
import type { AgentNode as AgentNodeType } from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent/agent.shared";
import type { NodeClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/types";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export interface AgentNodeProps extends NodeProps<AgentNodeType> {}

export function AgentNode({ selected, data, deletable, id }: AgentNodeProps) {
	const deleteNode = useWorkflow((state) => state.deleteNode);
	const canConnectHandle = useWorkflow((store) => store.canConnectHandle);

	const validationErrors =
		data.validationErrors?.map((error) => ({
			message: error.message,
		})) || [];

	const isSourceConnectable = canConnectHandle({
		nodeId: id,
		handleId: "result",
		type: "source",
	});
	const isTargetConnectable = canConnectHandle({
		nodeId: id,
		handleId: "prompt",
		type: "target",
	});

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
					<Bot />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Agent</NodeHeaderTitle>
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
			<div className="text-left text text-muted-foreground p-2 pl-4 pt-0 max-w-[200px] truncate">
				{data.name}
			</div>

			<BaseHandle
				id="prompt"
				type="target"
				position={Position.Left}
				isConnectable={isTargetConnectable}
			/>

			<BaseHandle
				id="result"
				type="source"
				position={Position.Right}
				isConnectable={isSourceConnectable}
			/>
		</BaseNode>
	);
}

export function AgentNodePanel({ node }: { node: AgentNodeType }) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const [advancedOpen, setAdvancedOpen] = useState(false);

	return (
		<div className="space-y-4">
			<div>
				<h4 className="font-medium text-sm mb-2">Configuration</h4>
				<div className="space-y-3">
					<div>
						<label
							htmlFor={`name-${node.id}`}
							className="block text-xs font-medium mb-1"
						>
							Name
						</label>
						<Input
							id={`name-${node.id}`}
							value={node.data.name}
							onChange={(e) => {
								updateNode({
									id: node.id,
									nodeType: "agent",
									data: {
										name: e.target.value,
									},
								});
							}}
							placeholder="Enter agent name..."
							className="text-xs"
						/>
					</div>
					<div>
						<label
							htmlFor={`model-${node.id}`}
							className="block text-xs font-medium mb-1"
						>
							Model
						</label>
						<ModelSelector
							value={node.data.model as workflowModelID}
							onChange={(model) => {
								updateNode({
									id: node.id,
									nodeType: "agent",
									data: {
										model,
									},
								});
							}}
						/>
					</div>
					<div>
						<div className="block text-xs font-medium mb-2">
							Tools
						</div>
						<div className="space-y-2 rounded-md border border-input p-3 bg-background">
							{WORKFLOW_TOOLS.map((toolId) => {
								const isSelected =
									node.data.selectedTools.includes(toolId);

								return (
									<div
										key={toolId}
										className="flex items-start gap-2"
									>
										<Checkbox
											id={`tool-${toolId}-${node.id}`}
											checked={isSelected}
											onCheckedChange={(checked) => {
												const newSelectedTools = checked
													? [
															...node.data
																.selectedTools,
															toolId,
														]
													: node.data.selectedTools.filter(
															(t) => t !== toolId,
														);

												updateNode({
													id: node.id,
													nodeType: "agent",
													data: {
														selectedTools:
															newSelectedTools,
													},
												});
											}}
										/>
										<label
											htmlFor={`tool-${toolId}-${node.id}`}
											className="flex flex-col gap-0.5 cursor-pointer"
										>
											<span className="text-xs font-medium leading-none">
												{idToReadableText(toolId)}
											</span>
											<span className="text-xs text-muted-foreground">
												{workflowTools[toolId]
													.description ??
													"No description"}
											</span>
										</label>
									</div>
								);
							})}
						</div>
					</div>
					<div>
						<label
							htmlFor={`outputType-${node.id}`}
							className="block text-xs font-medium mb-1"
						>
							Output Type
						</label>
						<Select
							value={node.data.sourceType.type}
							onValueChange={(value: "text" | "structured") => {
								updateNode({
									id: node.id,
									nodeType: "agent",
									data: {
										sourceType:
											value === "text"
												? { type: "text" }
												: {
														type: "structured",
														schema: null,
													},
									},
								});
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select output type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="text">Text</SelectItem>
								<SelectItem value="structured">
									Structured
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{node.data.sourceType.type === "structured" && (
						<div>
							<div className="flex items-center gap-2 mb-1">
								<div className="text-xs font-medium">
									JSON Schema
								</div>
							</div>
							<SchemaEditorDialog
								schema={node.data.sourceType.schema}
								onSave={(schema) => {
									updateNode({
										id: node.id,
										nodeType: "agent",
										data: {
											sourceType: {
												type: "structured",
												schema,
											},
										},
									});
								}}
							/>
							{node.data.sourceType.schema && (
								<div className="mt-2">
									<SchemaPreview
										schema={node.data.sourceType.schema}
									/>
								</div>
							)}
						</div>
					)}
					<div>
						<label
							htmlFor={`prompt-${node.id}`}
							className="block text-xs font-medium mb-1"
						>
							System Prompt
						</label>
						<Textarea
							id={`prompt-${node.id}`}
							value={node.data.systemPrompt}
							onChange={(e) => {
								updateNode({
									id: node.id,
									nodeType: "agent",
									data: {
										systemPrompt: e.target.value,
									},
								});
							}}
							placeholder="Enter system prompt..."
							className="min-h-[80px] text-xs resize-none nodrag"
						/>
					</div>
				</div>
			</div>

			<div>
				<Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
					<CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted/50 transition-colors">
						<h4 className="font-medium text-sm">Advanced</h4>
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-200 ${
								advancedOpen ? "rotate-180" : ""
							}`}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="space-y-3 mt-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor={`hideResponse-${node.id}`}
								className="text-xs font-medium"
							>
								Hide response in chat
							</label>
							<Switch
								id={`hideResponse-${node.id}`}
								checked={node.data.hideResponseInChat ?? false}
								onCheckedChange={(checked) => {
									updateNode({
										id: node.id,
										nodeType: "agent",
										data: {
											hideResponseInChat: checked,
										},
									});
								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<label
								htmlFor={`excludeConversation-${node.id}`}
								className="text-xs font-medium"
							>
								Exclude from conversation history
							</label>
							<Switch
								id={`excludeConversation-${node.id}`}
								checked={
									node.data.excludeFromConversation ?? false
								}
								onCheckedChange={(checked) => {
									updateNode({
										id: node.id,
										nodeType: "agent",
										data: {
											excludeFromConversation: checked,
										},
									});
								}}
							/>
						</div>
						<div className="flex items-center justify-between">
							<label
								htmlFor={`maxSteps-${node.id}`}
								className="text-xs font-medium"
							>
								Max steps
							</label>
							<Input
								id={`maxSteps-${node.id}`}
								type="number"
								min="1"
								max="50"
								value={node.data.maxSteps ?? 5}
								onChange={(e) => {
									const value = Number.parseInt(
										e.target.value,
										10,
									);
									if (
										!Number.isNaN(value) &&
										value >= 1 &&
										value <= 50
									) {
										updateNode({
											id: node.id,
											nodeType: "agent",
											data: {
												maxSteps: value,
											},
										});
									}
								}}
								className="w-16 h-8 text-xs"
							/>
						</div>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
}

export function createAgentNode(position: {
	x: number;
	y: number;
}): AgentNodeType {
	return {
		id: nanoid(),
		type: "agent",
		position,
		data: {
			name: "Agent",
			status: "idle",
			model: "gpt-5-nano",
			systemPrompt: "",
			selectedTools: [],
			sourceType: { type: "text" },
			hideResponseInChat: false,
			excludeFromConversation: false,
			maxSteps: 5,
		},
	};
}

export const agentClientDefinition: NodeClientDefinition<AgentNodeType> = {
	component: AgentNode,
	panelComponent: AgentNodePanel,
	create: createAgentNode,
	meta: {
		label: "Agent",
		icon: Bot,
		description: "An AI agent that can process input and generate output",
	},
};
