"use client";

import { BaseHandle } from "@/components/flow/base-handle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type EditableLabeledHandleProps = HandleProps &
	React.HTMLAttributes<HTMLDivElement> & {
		nodeId: string;
		handleId: string;
		label: string;
		handleClassName?: string;
		labelClassName?: string;
		wrapperClassName?: string;
		onLabelChange: (handleId: string, newLabel: string) => boolean;
		onDelete: (handleId: string) => void;
	};

const EditableLabeledHandle = React.forwardRef<
	HTMLDivElement,
	EditableLabeledHandleProps
>(
	(
		{
			nodeId,
			handleId,
			labelClassName,
			handleClassName,
			label,
			position,
			wrapperClassName,
			onLabelChange,
			onDelete,
			...handleProps
		},
		ref,
	) => {
		const [localLabel, setLocalLabel] = useState(label);
		const [isEditing, setIsEditing] = useState(label.length === 0);
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

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				handleSave();
			} else if (e.key === "Escape") {
				resetEditing();
			}
		};

		const resetEditing = () => {
			if (label.length === 0) {
				onDelete(handleId);
				return;
			}

			setLocalLabel(label);
			setIsEditing(false);
		};

		const handleSave = () => {
			// Trim and validate the label has no spaces
			const trimmedLabel = localLabel.trim();
			if (trimmedLabel.includes(" ")) {
				toast.error("Label cannot contain spaces");
				return;
			}
			const success = onLabelChange(handleId, trimmedLabel);
			if (success) {
				setIsEditing(false);
			}
		};

		const handleStartEditing = () => {
			setIsEditing(true);
			// Reset local label to current label when starting edit
			setLocalLabel(label);
		};

		return (
			<div
				ref={ref}
				title={label}
				className={cn(
					"relative flex items-center group",
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
					<div className="flex items-center px-2 gap-2 nodrag">
						<Input
							ref={inputRef}
							value={localLabel}
							onChange={(e) => setLocalLabel(e.target.value)}
							onKeyDown={handleKeyDown}
							className={cn("px-2 h-6", labelClassName)}
							autoFocus
						/>
						<div className="flex items-center gap-1">
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
					<div className="flex-1 flex items-center justify-start px-4 py-0.5 gap-3 min-w-0 nodrag">
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label
							className={cn(
								"text-foreground truncate whitespace-nowrap min-w-0",
								labelClassName,
							)}
						>
							{label}
						</label>
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

EditableLabeledHandle.displayName = "EditableLabeledHandle";

export { EditableLabeledHandle };
