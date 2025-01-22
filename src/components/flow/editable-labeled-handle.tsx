"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { HandleProps } from "@xyflow/react";
import { BaseHandle } from "@/components/flow/base-handle";
import { Input } from "@/components/ui/input";
import { CheckCheck, Edit2, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const flexDirections = {
	top: "flex-col",
	right: "flex-row-reverse justify-end",
	bottom: "flex-col-reverse justify-end",
	left: "flex-row",
};

type EditableLabeledHandleProps = HandleProps &
	React.HTMLAttributes<HTMLDivElement> & {
		title: string;
		handleClassName?: string;
		labelClassName?: string;
		wrapperClassName?: string;
		onTitleChange: (newTitle: string) => void;
		onDelete: () => void;
	};

const EditableLabeledHandle = React.forwardRef<
	HTMLDivElement,
	EditableLabeledHandleProps
>(
	(
		{
			labelClassName,
			handleClassName,
			title,
			position,
			wrapperClassName,
			onTitleChange,
			onDelete,
			...handleProps
		},
		ref,
	) => {
		const [localTitle, setLocalTitle] = useState(title);
		const [isEditing, setIsEditing] = useState(false);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && onTitleChange) {
				onTitleChange(localTitle);
			} else if (e.key === "Escape") {
				setLocalTitle(title);
				setIsEditing(false);
			}
		};

		return (
			<div
				ref={ref}
				title={title}
				className={cn(
					"relative flex items-center group",
					flexDirections[position],
					wrapperClassName,
				)}
			>
				<BaseHandle
					position={position}
					className={handleClassName}
					{...handleProps}
				/>
				{isEditing ? (
					<div className="flex items-center px-2 gap-2">
						<Input
							value={localTitle}
							onChange={(e) => setLocalTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							className={cn("px-2 h-6 max-w-[130px]", labelClassName)}
							autoFocus
						/>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={() => {
									onTitleChange(localTitle);
									setIsEditing(false);
								}}
							>
								<CheckCheck />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={() => setIsEditing(false)}
							>
								<X />
							</Button>
						</div>
					</div>
				) : (
					<div className="flex-1 flex items-center justify-start px-4 py-0.5 gap-3">
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className={cn("text-foreground", labelClassName)}>
							{title}
						</label>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={() => setIsEditing(true)}
							>
								<Edit2 />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="size-4 [&_svg]:size-3.5"
								onClick={onDelete}
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
