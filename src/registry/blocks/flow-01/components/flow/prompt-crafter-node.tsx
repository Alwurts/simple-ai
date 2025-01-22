import {
	Position,
	type NodeProps,
	useUpdateNodeInternals,
} from "@xyflow/react";
import type React from "react";
import { useCallback, useRef } from "react";
import {
	useStore,
	type TPromptCrafterNode,
} from "@/registry/blocks/flow-01/hooks/store";
import {
	NodeHeaderAction,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/components/flow/node-header";
import { BaseNode } from "@/components/flow/base-node";
import { NodeHeader, NodeHeaderActions } from "@/components/flow/node-header";
import { PenLine, Trash, Plus } from "lucide-react";
import { EditableLabeledHandle } from "@/components/flow/editable-labeled-handle";
import { Separator } from "@/components/ui/separator";
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
import { LabeledHandle } from "@/components/flow/labeled-handle";

export function PromptCrafterNode({
	id,
	selected,
	data,
}: NodeProps<TPromptCrafterNode>) {
	const updateNode = useStore((state) => state.updateNode);
	const updateNodeInternals = useUpdateNodeInternals();
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			updateNode(id, { text: e.target.value });
		},
		[id, updateNode],
	);

	const insertInputAtCursor = useCallback(
		(inputName: string) => {
			const textarea = textAreaRef.current;
			if (!textarea) {
				return;
			}

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;
			const before = text.substring(0, start);
			const after = text.substring(end);
			const newText = `${before}{${inputName}}${after}`;

			updateNode(id, { text: newText });

			// Reset cursor position after React rerender
			requestAnimationFrame(() => {
				textarea.focus();
				const newCursorPos = start + inputName.length + 2;
				textarea.setSelectionRange(newCursorPos, newCursorPos);
			});
		},
		[id, updateNode],
	);

	const addInput = useCallback(() => {
		const newInput = "new-input";
		updateNode(id, {
			inputs: [...(data.inputs || []), newInput],
		});
		updateNodeInternals(id);
	}, [id, data.inputs, updateNode, updateNodeInternals]);

	const updateInputName = useCallback(
		(oldName: string, newName: string) => {
			if (!newName || oldName === newName) {
				return;
			}
			updateNode(id, {
				inputs: (data.inputs || []).map((input) =>
					input === oldName ? newName : input,
				),
				// Also update references in the text
				text: (data.text || "").replace(
					new RegExp(`{${oldName}}`, "g"),
					`{${newName}}`,
				),
			});
			updateNodeInternals(id);
		},
		[id, data.inputs, data.text, updateNode, updateNodeInternals],
	);

	const removeInput = useCallback(
		(inputName: string) => {
			updateNode(id, {
				inputs: (data.inputs || []).filter((input) => input !== inputName),
			});
			updateNodeInternals(id);
		},
		[id, data.inputs, updateNode, updateNodeInternals],
	);

	return (
		<BaseNode selected={selected} className="px-0 pb-0 flex flex-col">
			<NodeHeader className="px-8 mb-0">
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Prompt Crafter</NodeHeaderTitle>
				<NodeHeaderActions>
					<NodeHeaderDeleteAction id={id} />
				</NodeHeaderActions>
			</NodeHeader>
			<Separator />
			<div className="p-2 w-[400px]">
				<div className="flex gap-2 mb-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="w-full justify-start">
								Insert input...
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0" align="start">
							<Command>
								<CommandInput placeholder="Search inputs..." />
								<CommandList>
									<CommandEmpty>No inputs found.</CommandEmpty>
									<CommandGroup>
										{data.inputs?.map((input) => (
											<CommandItem
												key={input}
												onSelect={() => insertInputAtCursor(input)}
											>
												{input}
											</CommandItem>
										))}
										<CommandItem onSelect={addInput} className="text-primary">
											<Plus className="w-4 h-4 mr-2" />
											Add new input
										</CommandItem>
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				<textarea
					ref={textAreaRef}
					value={data.text || ""}
					onChange={handleTextChange}
					className="w-full h-[150px] resize-none border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring"
					placeholder="Craft your prompt here... Use {input-name} to reference inputs"
				/>
			</div>
			<div className="grid grid-cols-2 gap-2 pt-2 pb-4 text-sm">
				<div className="flex flex-col gap-2">
					{data.inputs?.map((input, index) => (
						<EditableLabeledHandle
							key={`${index}-${input}`}
							id={input}
							title={input}
							type="target"
							position={Position.Left}
							wrapperClassName="w-full"
							onDelete={() => removeInput(input)}
							onTitleChange={(newTitle) => updateInputName(input, newTitle)}
						/>
					))}
					<div className="px-4 py-1">
						<Button
							variant="outline"
							size="sm"
							className="w-fit"
							onClick={addInput}
						>
							<Plus />
							New Input
						</Button>
					</div>
				</div>
				<div className="justify-self-end">
					<LabeledHandle
						id="output"
						title="Output"
						type="source"
						position={Position.Right}
					/>
				</div>
			</div>
		</BaseNode>
	);
}

const NodeHeaderDeleteAction = ({ id }: { id: string }) => {
	const deleteNode = useStore((state) => state.deleteNode);
	const handleClick = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<NodeHeaderAction onClick={handleClick} variant="ghost" label="Delete node">
			<Trash />
		</NodeHeaderAction>
	);
};
