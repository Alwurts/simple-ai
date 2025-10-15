"use client";

import { FileIcon, PlusIcon } from "lucide-react"; // For file mention icon
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputSubmitButton,
	type ChatInputValue,
	createMentionConfig,
	extractMentions,
} from "@/components/ui/chat-input";
import {
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

//Sample data (in real app, fetch from API or props)
const members = [
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

const files = [
	{ id: "f1", name: "report.pdf" },
	{ id: "f2", name: "image.png" },
	{ id: "f3", name: "notes.txt" },
];

// Helper to convert JSON to plain text (simple recursive flatten)
// function jsonToText(json: ChatInputValue): string {
// 	if (!json.content) {
// 		return "";
// 	}
// 	return json.content
// 		.map((node) => {
// 			if (node.text) {
// 				return node.text;
// 			}
// 			if (node.content) {
// 				return jsonToText({ content: node.content });
// 			}
// 			return "";
// 		})
// 		.join(" ");
// }

export default function ChatExample() {
	// Controlled state: Tiptap JSON for rich content (mentions preserved)
	const [editorValue, setEditorValue] = useState<ChatInputValue>({
		type: "doc",
		content: [],
	});
	//const [isPending, setIsPending] = useState(false);

	// Handle submit (e.g., send to API)
	// const handleSubmit = () => {
	// 	if (!editorValue.content?.length) {
	// 		return; // Empty check
	// 	}

	// 	const text = jsonToText(editorValue);
	// 	const mentions = extractMentions(editorValue);

	// 	console.log("Submitted:", { text, mentions });
	// 	// In real app: await api.sendMessage({ text, mentions });

	// 	// Simulate pending (e.g., API call)
	// 	setIsPending(true);
	// 	setTimeout(() => {
	// 		setIsPending(false);
	// 		setEditorValue({ type: "doc", content: [] }); // Reset after submit
	// 	}, 2000);
	// };

	const mentionConfigs = [
		createMentionConfig({
			type: "member",
			trigger: "@",
			items: members,
			renderItem: (item) => {
				// TypeScript infers item as MemberMention from items array!
				const imgUrl = item.image ?? "/placeholder.jpg";
				return (
					<>
						<Avatar className="h-6 w-6">
							<AvatarImage src={imgUrl} alt={item.name} />
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
				);
			},
		}),
		createMentionConfig({
			type: "file",
			trigger: "/",
			items: files,
			renderItem: (item) => {
				// TypeScript infers item as FileMention from items array!
				return (
					<>
						<FileIcon className="h-4 w-4 text-muted-foreground" />
						<span
							className="text-sm font-medium truncate max-w-[200px]"
							title={item.name}
						>
							{item.name}
						</span>
					</>
				);
			},
		}),
	];

	const handleSubmit = () => {
		console.log("Submit button clicked");
		console.log(editorValue);
		setEditorValue({ type: "doc", content: [] });
	};

	return (
		<div className="max-w-2xl mx-auto p-4 w-full space-y-4">
			<h2 className="text-lg font-semibold mb-4">Chat Input Example</h2>

			<ChatInput>
				<ChatInputEditor
					mentionConfigs={mentionConfigs}
					value={editorValue}
					onChange={setEditorValue}
					onEnter={handleSubmit} // Enter key submits (Shift+Enter for newline)
					placeholder="Type @ for members, / for files..."
				/>
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
					<ChatInputSubmitButton onClick={handleSubmit} />
				</InputGroupAddon>
			</ChatInput>

			{/* Debug output */}
			<pre className="text-xs bg-muted p-2 rounded">
				{JSON.stringify(
					{
						editorValue,
						extractedMentions: extractMentions(editorValue),
					},
					null,
					2,
				)}
			</pre>
		</div>
	);
}
