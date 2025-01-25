"use client";

import { BaseHandle } from "@/components/flow/base-handle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { HandleProps, Node } from "@xyflow/react";
import { useOnSelectionChange } from "@xyflow/react";
import { Edit2, Trash } from "lucide-react";
import React, { useState } from "react";
import { useCallback } from "react";
import { toast } from "sonner";

type HandleEditorProps = {
	variant: "edit" | "create";
	label: string;
	description?: string;
	onSave: (newLabel: string, newDescription?: string) => boolean;
	onCancel: () => void;
	align?: "start" | "end";
	children: React.ReactNode;
};

function HandleEditor({
	variant,
	label,
	description,
	onSave,
	onCancel,
	align = "start",
	children,
}: HandleEditorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [localLabel, setLocalLabel] = useState(label);
	const [localDescription, setLocalDescription] = useState(description);

	const handleSave = () => {
		// Trim and validate the label has no spaces
		const trimmedLabel = localLabel.trim();
		if (trimmedLabel.includes(" ")) {
			toast.error("Label cannot contain spaces");
			return;
		}
		const success = onSave(trimmedLabel, localDescription?.trim());
		if (success) {
			setIsOpen(false);
			if (variant === "create") {
				reset();
			}
		}
	};

	const handleCancel = () => {
		setIsOpen(false);
		if (variant === "create") {
			reset();
		}
		onCancel();
	};

	const reset = () => {
		setLocalLabel("");
		setLocalDescription("");
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-80 p-4" align={align}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="label" className="text-sm font-medium">
							Label
						</label>
						<Input
							id="label"
							value={localLabel}
							onChange={(e) => setLocalLabel(e.target.value)}
							placeholder="Enter label"
							className="h-8"
							autoFocus
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description (optional)
						</label>
						<Textarea
							id="description"
							value={localDescription}
							onChange={(e) => setLocalDescription(e.target.value)}
							placeholder="Enter description"
							className="resize-none h-20"
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" size="sm" onClick={handleCancel}>
							Cancel
						</Button>
						<Button size="sm" onClick={handleSave}>
							{variant === "create" ? "Create" : "Save"}
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

type EditableHandleProps = HandleProps &
	React.HTMLAttributes<HTMLDivElement> & {
		nodeId: string;
		handleId: string;
		name: string;
		description?: string;
		handleClassName?: string;
		labelClassName?: string;
		wrapperClassName?: string;
		onNameChange: (
			handleId: string,
			newName: string,
			newDescription?: string,
		) => boolean;
		onDelete: (handleId: string) => void;
	};

const EditableHandle = React.forwardRef<HTMLDivElement, EditableHandleProps>(
	(
		{
			nodeId,
			handleId,
			labelClassName,
			handleClassName,
			name: label,
			description,
			position,
			wrapperClassName,
			onNameChange,
			onDelete,
			...handleProps
		},
		ref,
	) => {
		const [isEditing, setIsEditing] = useState(label.length === 0);

		const handleSelectionChange = useCallback(
			({ nodes }: { nodes: Node[] }) => {
				if (isEditing && !nodes.some((node) => node.id === nodeId)) {
					resetEditing();
				}
			},
			[isEditing, nodeId],
		);

		useOnSelectionChange({
			onChange: handleSelectionChange,
		});

		const resetEditing = () => {
			if (label.length === 0) {
				onDelete(handleId);
				return;
			}

			setIsEditing(false);
		};

		const handleSave = (newLabel: string, newDescription?: string) => {
			return onNameChange(handleId, newLabel, newDescription);
		};

		return (
			<div
				ref={ref}
				title={label}
				className={cn("relative group", wrapperClassName)}
			>
				<BaseHandle
					position={position}
					className={handleClassName}
					id={handleId}
					{...handleProps}
				/>
				<div
					className={cn("flex items-center px-4 py-3 gap-3 nodrag", {
						"justify-end": position === "right",
						"justify-start": position === "left",
					})}
				>
					<div className="flex flex-col min-w-0">
						<span
							className={cn(
								"text-foreground truncate whitespace-nowrap",
								labelClassName,
							)}
						>
							{label}
						</span>
						{description && (
							<p className="text-muted-foreground text-sm line-clamp-1">
								{description}
							</p>
						)}
					</div>
					<div className="flex items-center gap-1 shrink-0">
						<HandleEditor
							variant="edit"
							label={label}
							description={description}
							onSave={handleSave}
							onCancel={resetEditing}
							align={position === "left" ? "start" : "end"}
						>
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
							>
								<Edit2 />
							</Button>
						</HandleEditor>
						<Button
							variant="ghost"
							size="icon"
							className="size-4 [&_svg]:size-3.5"
							onClick={() => onDelete(handleId)}
						>
							<Trash />
						</Button>
					</div>
				</div>
			</div>
		);
	},
);

EditableHandle.displayName = "EditableHandle";

export { EditableHandle, HandleEditor };
