"use client";

import { cn } from "@/lib/utils";
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import { useGenerationStore } from "../store";
import { useEffect } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useCompletion } from "ai/react";

export function Chat({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	const { versions, currentVersion } = useGenerationStore();

	const {
		completion,
		isLoading,
		input,
		handleInputChange,
		handleSubmit,
		stop,
	} = useCompletion({
		api: "/api/ai/generate",
		onFinish: (prompt, completion) => {
			console.log("prompt", prompt);
			console.log("completion", completion);
		},
	});

	useEffect(() => {
		console.log("data", completion);
	}, [completion]);

	return (
		<div
			{...props}
			className={cn(
				"flex flex-col h-full overflow-y-auto w-[400px] shrink-0",
				className,
			)}
		>
			<div className="flex-1 p-4 space-y-4 overflow-y-auto">
				{versions.map((version) => (
					<div
						key={version.versionNumber}
						className={cn(
							"p-4 rounded-lg",
							version.versionNumber === currentVersion
								? "bg-primary text-primary-foreground"
								: "bg-muted",
						)}
					>
						<div className="font-medium mb-2">
							Version {version.versionNumber + 1}
						</div>
						<div className="text-sm whitespace-pre-wrap">{version.code}</div>
					</div>
				))}
			</div>
			<div className="px-2 py-4 max-w-2xl mx-auto w-full">
				<ChatInput
					value={input}
					onChange={handleInputChange}
					onSubmit={handleSubmit}
					loading={isLoading}
					onStop={stop}
				>
					<ChatInputTextArea placeholder="Type your code generation prompt..." />
					<ChatInputSubmit />
				</ChatInput>
			</div>
		</div>
	);
}
