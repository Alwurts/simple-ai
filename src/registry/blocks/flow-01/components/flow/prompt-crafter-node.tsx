import { BaseNode } from "@/components/flow/base-node";
import { LabeledHandle } from "@/components/flow/labeled-handle";
import { NodeHeaderIcon, NodeHeaderTitle } from "@/components/flow/node-header";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	EditableHandle,
	HandleEditor,
} from "@/registry/blocks/flow-01/components/flow/editable-handle";
import { NodeHeaderDeleteAction } from "@/registry/blocks/flow-01/components/flow/node-header-delete-action";
import { StatusBadge } from "@/registry/blocks/flow-01/components/flow/status-badge";
import { useStore } from "@/registry/blocks/flow-01/hooks/store";
import type { PromptCrafterNode as TPromptCrafterNode } from "@/registry/blocks/flow-01/types/flow";
import { StreamLanguage } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import CodeMirror from "@uiw/react-codemirror";
import {
	type NodeProps,
	Position,
	useUpdateNodeInternals,
} from "@xyflow/react";
import { BetweenVerticalEnd, PencilRuler, Plus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// Custom theme that matches your app's design
const promptTheme = createTheme({
	theme: "dark",
	settings: {
		background: "transparent",
		foreground: "hsl(var(--foreground))",
		caret: "black",
		selection: "#3B82F6",
		//selectionMatch: "#3B82F6",
		lineHighlight: "transparent",
	},
	styles: [
		{ tag: t.variableName, color: "#10c43d" },
		{ tag: t.string, color: "hsl(var(--foreground))" },
		{ tag: t.invalid, color: "#DC2626" },
	],
});

// Create a function to generate the language with the current inputs
const createPromptLanguage = (validInputs: string[] = []) =>
	StreamLanguage.define({
		token(stream) {
			if (stream.match(/{{[^}]*}}/)) {
				const match = stream.current();
				const inputName = match.slice(2, -2);
				// Check if the input name is valid
				if (validInputs.includes(inputName)) {
					return "variableName";
				}
				return "invalid";
			}
			stream.next();
			return null;
		},
	});

export function PromptCrafterNode({
	id,
	selected,
	deletable,
	data,
}: NodeProps<TPromptCrafterNode>) {
	const updateNode = useStore((state) => state.updateNode);

	const addDynamicHandle = useStore((state) => state.addDynamicHandle);
	const removeDynamicHandle = useStore((state) => state.removeDynamicHandle);

	const updateNodeInternals = useUpdateNodeInternals();
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const editorViewRef = useRef<EditorView>();

	const handlePromptTextChange = useCallback(
		(value: string) => {
			updateNode(id, "prompt-crafter", { config: { template: value } });
		},
		[id, updateNode],
	);

	const insertInputAtCursor = useCallback((inputName: string) => {
		const view = editorViewRef.current;
		if (!view) {
			return;
		}

		const inputTag = `{{${inputName}}}`;
		const from = view.state.selection.main.from;
		view.dispatch({
			changes: { from, insert: inputTag },
			selection: { anchor: from + inputTag.length },
		});
		setIsPopoverOpen(false);
	}, []);

	const handleCreateInput = useCallback(
		(name: string) => {
			if (!name) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === name,
			);
			if (existingInput) {
				toast.error("Input name already exists");
				return false;
			}

			addDynamicHandle(id, "prompt-crafter", "template-tags", {
				name,
			});
			updateNodeInternals(id);
			return true;
		},
		[id, data.dynamicHandles, addDynamicHandle, updateNodeInternals],
	);

	const removeInput = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "prompt-crafter", "template-tags", handleId);
			updateNodeInternals(id);
		},
		[id, updateNodeInternals, removeDynamicHandle],
	);

	const updateInputName = useCallback(
		(handleId: string, newLabel: string): boolean => {
			if (!newLabel) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === newLabel,
			);
			if (existingInput && existingInput.id !== handleId) {
				toast.error("Input name already exists");
				return false;
			}

			const oldInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.id === handleId,
			);
			if (!oldInput) {
				return false;
			}

			updateNode(id, "prompt-crafter", {
				config: {
					...data.config,
					template: (data.config.template || "").replace(
						new RegExp(`{${oldInput.name}}`, "g"),
						`{${newLabel}}`,
					),
				},
				dynamicHandles: {
					...data.dynamicHandles,
					"template-tags": (data.dynamicHandles["template-tags"] || []).map(
						(input) =>
							input.id === handleId ? { ...input, name: newLabel } : input,
					),
				},
			});
			updateNodeInternals(id);
			return true;
		},
		[id, data.dynamicHandles, data.config, updateNode, updateNodeInternals],
	);

	// Create language with current inputs
	const extensions = useMemo(() => {
		const validLabels = (data.dynamicHandles["template-tags"] || []).map(
			(input) => input.name,
		);
		return [createPromptLanguage(validLabels)];
	}, [data.dynamicHandles["template-tags"]]);

	const executionStatus = data.executionState?.status;

	return (
		<BaseNode
			selected={selected}
			isProcessing={executionStatus === "processing"}
			className="px-0 pb-0 flex flex-col w-[350px]"
		>
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<PencilRuler />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Prompt Crafter</NodeHeaderTitle>
				<NodeHeaderActions>
					<StatusBadge status={executionStatus} />
					{deletable && <NodeHeaderDeleteAction id={id} />}
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2">
				<div className="flex items-center gap-2 mb-1">
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" size="sm" className="h-7 px-2">
								<BetweenVerticalEnd className="h-4 w-4 mr-1" />
								Insert Input into Prompt
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0" align="start">
							<Command>
								<CommandInput placeholder="Search inputs..." />
								<CommandList>
									<CommandEmpty>No inputs found.</CommandEmpty>
									<CommandGroup>
										{data.dynamicHandles["template-tags"]?.map(
											(input) =>
												input.name && (
													<CommandItem
														key={input.id}
														onSelect={() => insertInputAtCursor(input.name)}
														className="text-base"
													>
														{input.name}
													</CommandItem>
												),
										)}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				<CodeMirror
					value={data.config.template || ""}
					height="150px"
					theme={promptTheme}
					extensions={extensions}
					onChange={handlePromptTextChange}
					onCreateEditor={(view) => {
						editorViewRef.current = view;
					}}
					className="nodrag border rounded-md overflow-hidden [&_.cm-content]:!cursor-text [&_.cm-line]:!cursor-text nodrag nopan nowheel"
					placeholder="Craft your prompt here... Use {{input-name}} to reference inputs"
					basicSetup={{
						lineNumbers: false,
						foldGutter: false,
						dropCursor: false,
						allowMultipleSelections: false,
						indentOnInput: false,
					}}
				/>
			</div>
			<div className="grid grid-cols-[2fr,1fr] pb-2 text-sm gap-4">
				<div className="flex flex-col min-w-0">
					<div className="flex items-center justify-between py-2 px-4 bg-muted rounded-r-xl">
						<span className="text-sm font-medium">Inputs</span>
						<HandleEditor
							variant="create"
							label=""
							onSave={handleCreateInput}
							onCancel={() => {}}
							align="end"
						>
							<Button
								variant="outline"
								size="sm"
								className="w-fit h-7 px-2 mx-1"
							>
								<Plus className="h-4 w-4 mr-1" />
								New Input
							</Button>
						</HandleEditor>
					</div>
					{data.dynamicHandles["template-tags"]?.map((input) => (
						<EditableHandle
							key={input.id}
							nodeId={id}
							handleId={input.id}
							name={input.name}
							type="target"
							position={Position.Left}
							wrapperClassName="w-full"
							onNameChange={updateInputName}
							onDelete={removeInput}
						/>
					))}
				</div>
				<div className="self-stretch border-l border-border flex items-center justify-end">
					<LabeledHandle
						id="result"
						title="Result"
						type="source"
						position={Position.Right}
					/>
				</div>
			</div>
		</BaseNode>
	);
}
