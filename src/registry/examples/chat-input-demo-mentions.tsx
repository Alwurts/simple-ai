"use client";

import { FileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputMention,
	ChatInputSubmitButton,
	createMentionConfig,
	useChatInput,
} from "@/registry/ui/chat-input";

type MemberItem = {
	id: string;
	name: string;
	image?: string;
	type: string;
};

type FileItem = {
	id: string;
	name: string;
};

const members: MemberItem[] = [
	{ id: "1", name: "Alice", image: "/avatar-1.png", type: "agent" },
	{ id: "2", name: "Bob", type: "user" },
	{ id: "3", name: "Charlie", image: "/avatar-2.png", type: "bot" },
	{ id: "4", name: "Dave", type: "user" },
];

const files: FileItem[] = [
	{ id: "f1", name: "report.pdf" },
	{ id: "f2", name: "image.png" },
	{ id: "f3", name: "notes.txt" },
];

export default function ChatInputWithMentions() {
	const { value, onChange, parsed, handleSubmit, mentionConfigs } =
		useChatInput({
			mentions: {
				member: createMentionConfig<MemberItem>({
					type: "member",
					trigger: "@",
					items: members,
				}),
				file: createMentionConfig<FileItem>({
					type: "file",
					trigger: "/",
					items: files,
				}),
			},
			onSubmit: (parsedValue) => {
				console.log("Submitted parsed:", parsedValue);
				console.log("Members mentioned:", parsedValue.member);
				console.log("Files mentioned:", parsedValue.file);
			},
		});

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-full max-w-md space-y-4">
				<ChatInput
					onSubmit={handleSubmit}
					value={value}
					onChange={onChange}
				>
					<ChatInputMention
						type={mentionConfigs.member.type}
						trigger={mentionConfigs.member.trigger}
						items={mentionConfigs.member.items}
					>
						{(item) => (
							<>
								<Avatar className="h-6 w-6">
									<AvatarImage
										src={item.image ?? "/placeholder.jpg"}
										alt={item.name}
									/>
									<AvatarFallback>
										{item.name[0].toUpperCase()}
									</AvatarFallback>
								</Avatar>

								<span
									className="text-sm font-medium truncate max-w-[120px]"
									title={item.name}
								>
									{item.name}
								</span>
								<Badge variant="outline" className="ml-auto">
									{item.type}
								</Badge>
							</>
						)}
					</ChatInputMention>
					<ChatInputMention
						type={mentionConfigs.file.type}
						trigger={mentionConfigs.file.trigger}
						items={mentionConfigs.file.items}
					>
						{(item) => (
							<>
								<FileIcon className="h-4 w-4 text-muted-foreground" />
								<span
									className="text-sm font-medium truncate max-w-[200px]"
									title={item.name}
								>
									{item.name}
								</span>
							</>
						)}
					</ChatInputMention>
					<ChatInputEditor placeholder="Type @ for agents, / for files..." />
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" />
					</ChatInputGroupAddon>
				</ChatInput>

				{/* Debug output */}
				<div className="space-y-2">
					<div>
						<h4 className="font-semibold mb-2 text-sm">
							Parsed Output:
						</h4>
						<Card className="p-4 shadow-none max-h-56 overflow-y-auto">
							<pre className="text-xs font-mono leading-relaxed">
								{JSON.stringify(parsed, null, 2)}
							</pre>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
