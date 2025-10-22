"use client";

import { FileIcon, PlusIcon } from "lucide-react"; // For file mention icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputMention,
	ChatInputSubmitButton,
	createMentionConfig,
	useChatInput,
} from "@/registry/ui/chat-input";

//Sample data (in real app, fetch from API or props)
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
	{ id: "1", name: "Alice", image: "/alice.jpg", type: "agent" },
	{ id: "2", name: "Bob", type: "user" },
	{ id: "3", name: "Charlie", image: "/charlie.jpg", type: "bot" },
	{ id: "4", name: "Dave", type: "user" },
	{ id: "5", name: "Eve", image: "/eve.jpg", type: "bot" },
	{ id: "6", name: "Frank", type: "user" },
	{ id: "7", name: "Grace", image: "/grace.jpg", type: "bot" },
	{ id: "8", name: "Henry", type: "user" },
	{ id: "9", name: "Ivy", image: "/ivy.jpg", type: "bot" },
	{ id: "10", name: "Jack", type: "user" },
	{ id: "11", name: "Kate", image: "/kate.jpg", type: "bot" },
	{ id: "12", name: "Liam", type: "user" },
	{ id: "13", name: "Mia", image: "/mia.jpg", type: "bot" },
	{ id: "14", name: "Noah", type: "user" },
	{ id: "15", name: "Olivia", image: "/olivia.jpg", type: "bot" },
	{ id: "16", name: "Peter", type: "user" },
	{ id: "17", name: "Quinn", image: "/quinn.jpg", type: "bot" },
	{ id: "18", name: "Ryan", type: "user" },
	{ id: "19", name: "Sarah", image: "/sarah.jpg", type: "bot" },
	{ id: "20", name: "Thomas", type: "user" },
	{ id: "21", name: "Uma", image: "/uma.jpg", type: "bot" },
	{ id: "22", name: "Victor", type: "user" },
];

const files: FileItem[] = [
	{ id: "f1", name: "report.pdf" },
	{ id: "f2", name: "image.png" },
	{ id: "f3", name: "notes.txt" },
];

export default function ChatExample() {
	// Use the new hook with custom onSubmit
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
				// Custom logic: log, send, access type-safe fields
				console.log("Submitted parsed:", parsedValue);
				console.log(
					"Content with mentions as spans:",
					parsedValue.content,
				);
				console.log("Members mentioned:", parsedValue.member); // TS-enforced
				console.log("Files mentioned:", parsedValue.file); // TS-enforced
			},
		});

	return (
		<div className="max-w-2xl mx-auto p-4 w-full space-y-4">
			<h2 className="text-lg font-semibold mb-4">Chat Input Example</h2>

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
				<InputGroupAddon align="block-end">
					<InputGroupButton
						variant="outline"
						className="rounded-full"
						size="icon-sm"
					>
						<PlusIcon />
					</InputGroupButton>
					<InputGroupText className="ml-auto">
						52% used
					</InputGroupText>
					<Separator orientation="vertical" className="!h-6" />
					<ChatInputSubmitButton />
				</InputGroupAddon>
			</ChatInput>

			{/* Debug output */}
			<div className="space-y-2">
				<div>
					<h3 className="text-sm font-semibold mb-1">
						Raw TipTap JSON:
					</h3>
					<pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-48">
						{JSON.stringify(value, null, 2)}
					</pre>
				</div>
				<div>
					<h3 className="text-sm font-semibold mb-1">
						Parsed Output:
					</h3>
					<pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-48">
						{JSON.stringify(parsed, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}
