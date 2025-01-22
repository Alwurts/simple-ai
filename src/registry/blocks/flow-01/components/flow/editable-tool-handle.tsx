"use client";

import { BaseHandle } from "@/components/flow/base-handle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { HandleProps, Node } from "@xyflow/react";
import { useOnSelectionChange } from "@xyflow/react";
import { CheckCheck, Edit2, Trash, X } from "lucide-react";
import React, { useState, useRef } from "react";
import { useCallback } from "react";
import { toast } from "sonner";

const flexDirections = {
	top: "flex-col",
	right: "flex-row-reverse justify-end",
	bottom: "flex-col-reverse justify-end",
	left: "flex-row",
};

type EditableToolHandleProps = HandleProps &
	React.HTMLAttributes<HTMLDivElement> & {
		nodeId: string;
		handleId: string;
		name: string;
		description: string;
		handleClassName?: string;
		nameClassName?: string;
		wrapperClassName?: string;
		onToolChange: (
			handleId: string,
			newName: string,
			newDescription: string,
		) => boolean;
		onDelete: (handleId: string) => void;
	};

const EditableToolHandle = React.forwardRef<
	HTMLDivElement,
	EditableToolHandleProps
>(
	(
		{
			nodeId,
			handleId,
			nameClassName,
			handleClassName,
			name,
			description,
			position,
			wrapperClassName,
			onToolChange,
			onDelete,
			...handleProps
		},
		ref,
	) => {
		const [localName, setLocalName] = useState(name);
		const [localDescription, setLocalDescription] = useState(description);
		const [isEditing, setIsEditing] = useState(name.length === 0);
		const inputRef = useRef<HTMLInputElement>(null);

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

		const handleKeyDown = (
			e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
		) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSave();
			} else if (e.key === "Escape") {
				resetEditing();
			}
		};

		const resetEditing = () => {
			if (name.length === 0) {
				onDelete(handleId);
				return;
			}

			setLocalName(name);
			setLocalDescription(description);
			setIsEditing(false);
		};

		const handleSave = () => {
			// Trim and validate the name has no spaces
			const trimmedName = localName.trim();
			if (trimmedName.includes(" ")) {
				toast.error("Tool name cannot contain spaces");
				return;
			}
			const success = onToolChange(
				handleId,
				trimmedName,
				localDescription.trim(),
			);
			if (success) {
				setIsEditing(false);
			}
		};

		const handleStartEditing = () => {
			setIsEditing(true);
			// Reset local values to current values when starting edit
			setLocalName(name);
			setLocalDescription(description);
		};

		return (
			<div
				ref={ref}
				title={name}
				className={cn(
					"relative flex group text-sm py-3 first:border-t border-b border-border",
					flexDirections[position],
					wrapperClassName,
				)}
			>
				<BaseHandle
					position={position}
					className={handleClassName}
					id={handleId}
					{...handleProps}
				/>
				{isEditing ? (
					<div className="flex-1 flex justify-end px-4 gap-4 min-w-0 nodrag">
						<div className="flex-1 flex flex-col items-end gap-1">
							<Input
								ref={inputRef}
								value={localName}
								onChange={(e) => setLocalName(e.target.value)}
								onKeyDown={handleKeyDown}
								className={cn("px-2 h-6", nameClassName)}
								placeholder="Tool name"
								autoFocus
							/>
							<Textarea
								value={localDescription}
								onChange={(e) => setLocalDescription(e.target.value)}
								onKeyDown={handleKeyDown}
								className="min-h-[60px] resize-none"
								placeholder="Tool description"
							/>
						</div>
						<div className="flex items-center gap-1 shrink-0">
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={handleSave}
							>
								<CheckCheck />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={resetEditing}
							>
								<X />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex-1 flex justify-end px-4 gap-4 min-w-0 nodrag">
						<div className="flex-1 flex flex-col items-end">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label
								className={cn(
									"text-foreground truncate whitespace-nowrap min-w-0 font-medium",
									nameClassName,
								)}
							>
								{name}
							</label>
							<p className="text-muted-foreground line-clamp-2">
								{description}
							</p>
						</div>
						<div className="flex items-center gap-1 shrink-0">
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={handleStartEditing}
							>
								<Edit2 />
							</Button>
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
				)}
			</div>
		);
	},
);

EditableToolHandle.displayName = "EditableToolHandle";

export { EditableToolHandle };
